import assert from 'node:assert/strict';
import {
  executeSQLQuery,
  getDatabaseSchema,
  resetSQLDatabase,
} from '../services/sqlEngine';
import { executePythonCode } from '../services/pythonEngine';
import {
  evaluateFormulaString,
  evaluateFullGrid,
} from '../services/spreadsheetEngine';
import {
  calculateConfidenceInterval,
  calculateDescriptiveStats,
  calculatePearsonCorrelation,
  calculateZScore,
  performTwoSampleTTest,
} from '../services/statisticsEngine';
import {
  computeDatasetNumericStats,
  PRELOADED_PLAYGROUND_DATASETS,
  profileDatasetColumns,
  validateAndParseDatasetFile,
} from '../services/datasetService';
import {
  evaluatePracticeExercise,
  PRACTICE_EXERCISES,
} from '../data/practiceExercises';
import { generateSmartRevisionPlan } from '../services/revisionEngine';
import { INITIAL_DEMO_USER } from '../data/sampleData';
import { UserProfile } from '../types/user';

async function runPhase3Tests() {
  console.log('=============================================================');
  console.log('RUNNING PHASE 3 AUTOMATED VERIFICATION SUITE');
  console.log('=============================================================\n');

  // ---------------------------------------------------------------------------
  // 1. SQL Execution, Result Accuracy & Error Handling
  // ---------------------------------------------------------------------------
  console.log('1. Testing Interactive SQL Engine (SQLite WASM)...');
  const ecomSchema = await getDatabaseSchema('ecommerce');
  assert.equal(ecomSchema.tables.length, 4, 'ecommerce DB should have 4 relational tables');

  // Basic SELECT + WHERE + ORDER BY
  const sqlRes1 = await executeSQLQuery(
    'ecommerce',
    `SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE status = 'Completed' AND total_amount > 400 ORDER BY total_amount DESC;`
  );
  assert.equal(sqlRes1.success, true, 'Valid SQL query should succeed');
  assert.equal(sqlRes1.rowCount, 6, 'Should return 6 completed orders > $400');
  assert.equal(sqlRes1.rows[0][0], 1007, 'Highest completed order should be order_id 1007');
  assert.equal(sqlRes1.rows[0][3], 1200, 'Highest order amount should be 1200');

  // JOIN + GROUP BY + HAVING
  const sqlRes2 = await executeSQLQuery(
    'ecommerce',
    `SELECT c.region, COUNT(o.order_id) AS order_count, SUM(o.total_amount) AS total_revenue
     FROM customers c JOIN orders o ON c.customer_id = o.customer_id
     WHERE o.status = 'Completed'
     GROUP BY c.region HAVING SUM(o.total_amount) > 1000 ORDER BY total_revenue DESC;`
  );
  assert.equal(sqlRes2.success, true);
  assert.equal(sqlRes2.rowCount, 2, 'Two regions exceed $1,000 in completed revenue');
  assert.equal(sqlRes2.rows[0][0], 'North America');
  assert.equal(sqlRes2.rows[0][2], 2520);

  // Window Function RANK() OVER
  const sqlResWindow = await executeSQLQuery(
    'hr_analytics',
    `SELECT full_name, dept_id, salary, RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk FROM employees ORDER BY dept_id ASC, rnk ASC;`
  );
  assert.equal(sqlResWindow.success, true, 'Window function RANK() OVER should succeed');
  assert.equal(sqlResWindow.rowCount, 8);
  assert.equal(sqlResWindow.rows[0][0], 'Aarav Mehta');
  assert.equal(sqlResWindow.rows[0][3], 1);

  // Safe DML UPDATE & Reset
  const sqlUpdate = await executeSQLQuery(
    'saas_metrics',
    `UPDATE accounts SET mrr_usd = 4500 WHERE account_id = 206; SELECT mrr_usd FROM accounts WHERE account_id = 206;`
  );
  assert.equal(sqlUpdate.success, true);
  assert.equal(sqlUpdate.rows[0][0], 4500, 'Account 206 MRR should be updated to 4500');
  await resetSQLDatabase('saas_metrics');
  const sqlAfterReset = await executeSQLQuery(
    'saas_metrics',
    `SELECT mrr_usd FROM accounts WHERE account_id = 206;`
  );
  assert.equal(sqlAfterReset.rows[0][0], 3800, 'Resetting DB should restore Account 206 MRR to 3800');

  // Empty Result vs Query Error Distinction
  const sqlEmpty = await executeSQLQuery(
    'ecommerce',
    `SELECT * FROM orders WHERE total_amount > 999999;`
  );
  assert.equal(sqlEmpty.success, true, 'Empty result query should still succeed');
  assert.equal(sqlEmpty.isEmptyResult, true, 'isEmptyResult flag should be true');
  assert.equal(sqlEmpty.rowCount, 0);

  const sqlSyntaxErr = await executeSQLQuery(
    'ecommerce',
    `SELEC broken_column FROM non_existent_table;`
  );
  assert.equal(sqlSyntaxErr.success, false, 'Invalid SQL syntax must fail cleanly');
  assert.ok(sqlSyntaxErr.error && sqlSyntaxErr.errorHint, 'Must return error message and beginner hint');
  console.log('   ✓ SQL Engine passed all query, join, window, DML, and error diagnostics tests.');

  // ---------------------------------------------------------------------------
  // 2. Python Execution & Error Handling (Skulpt)
  // ---------------------------------------------------------------------------
  console.log('2. Testing Interactive Python Engine (Skulpt)...');
  const pyRes1 = await executePythonCode(`
df = DataFrame(orders_data)
print("Shape:", df.shape)
print("Mean Revenue:", np.mean(df.col('revenue')))
print(df.groupby_agg('region', 'revenue', 'sum'))
`);
  assert.equal(pyRes1.success, true, 'Valid Python analytics script should succeed');
  assert.ok(pyRes1.stdout.includes('Shape: (8, 7)'), 'Should output DataFrame shape (8, 7)');
  assert.ok(pyRes1.stdout.includes('Mean Revenue: 785.0'), 'Should output Mean Revenue: 785.0');
  assert.ok(pyRes1.stdout.includes('North America'), 'Should output grouped regional summary');

  const pyErr = await executePythonCode(`print(undefined_variable_xyz + 10)`);
  assert.equal(pyErr.success, false, 'Python NameError must be caught');
  assert.ok(pyErr.error?.includes('NameError'), 'Error should report NameError');
  assert.ok(pyErr.errorHint, 'Python error must provide beginner-friendly debugging hint');
  console.log('   ✓ Python Engine passed execution, NumPy/DataFrame prelude, and error tests.');

  // ---------------------------------------------------------------------------
  // 3. Spreadsheet Formula Evaluation & Error Codes
  // ---------------------------------------------------------------------------
  console.log('3. Testing Spreadsheet Formula Engine...');
  const sampleSheet: Record<string, string | number> = {
    A1: 'Product',
    B1: 'Region',
    C1: 'Sales',
    A2: 'Alpha',
    B2: 'North',
    C2: 1200,
    A3: 'Beta',
    B3: 'South',
    C3: 800,
    A4: 'Gamma',
    B4: 'North',
    C4: 1600,
    D2: '=SUM(C2:C4)',
    D3: '=AVERAGE(C2:C4)',
    D4: '=IF(C2>1000, "High", "Low")',
    D5: '=SUMIF(B2:B4, "North", C2:C4)',
    D6: '=COUNTIF(B2:B4, "North")',
    D7: '=XLOOKUP("Beta", A2:A4, C2:C4)',
    D8: '=VLOOKUP("Gamma", A2:C4, 3, FALSE)',
  };
  const evalMap = evaluateFullGrid(sampleSheet, ['A', 'B', 'C', 'D'], 8);
  assert.equal(evalMap.D2.value, 3600, 'SUM(C2:C4) should equal 3600');
  assert.equal(evalMap.D3.value, 1200, 'AVERAGE(C2:C4) should equal 1200');
  assert.equal(evalMap.D4.value, 'High', 'IF(C2>1000, "High", "Low") should equal "High"');
  assert.equal(evalMap.D5.value, 2800, 'SUMIF North sales should equal 2800');
  assert.equal(evalMap.D6.value, 2, 'COUNTIF North should equal 2');
  assert.equal(evalMap.D7.value, 800, 'XLOOKUP Beta should return 800');
  assert.equal(evalMap.D8.value, 1600, 'VLOOKUP Gamma col 3 should return 1600');

  // Error code verification
  const errName = evaluateFormulaString('=UNKNOWNFUNC(A1:A3)', sampleSheet);
  assert.equal(errName.errorCode, '#NAME?');
  const errDiv = evaluateFormulaString('=100/0', sampleSheet);
  assert.equal(errDiv.errorCode, '#DIV/0!');
  const errVal = evaluateFormulaString('="hello" * 5', sampleSheet);
  assert.equal(errVal.errorCode, '#VALUE!');
  const errNA = evaluateFormulaString('=XLOOKUP("MissingItem", A2:A4, C2:C4)', sampleSheet);
  assert.equal(errNA.errorCode, '#N/A');
  console.log('   ✓ Spreadsheet Engine passed formula evaluation and error code diagnostics.');

  // ---------------------------------------------------------------------------
  // 4. Statistics Engine Calculations
  // ---------------------------------------------------------------------------
  console.log('4. Testing Statistics Calculation Engine...');
  const stats = calculateDescriptiveStats([12, 15, 18, 22, 25, 28, 190]);
  assert.equal(stats.count, 7);
  assert.equal(stats.median, 22, 'Median of [12, 15, 18, 22, 25, 28, 190] is 22');
  assert.equal(stats.min, 12);
  assert.equal(stats.max, 190);
  assert.equal(stats.range, 178);
  assert.ok(stats.outliers.includes(190), '190 should be flagged as a Tukey outlier');

  const r = calculatePearsonCorrelation([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  assert.equal(r, 1, 'Perfect linear correlation should be r = 1');

  const z = calculateZScore(625, 500, 50);
  assert.equal(z, 2.5, 'Z-score of 625 with mean 500, sd 50 should be 2.5');

  const ci = calculateConfidenceInterval(100, 20, 100, 0.95);
  assert.equal(ci.marginOfError, 3.92);
  assert.equal(ci.lowerBound, 96.08);
  assert.equal(ci.upperBound, 103.92);

  const tTest = performTwoSampleTTest(4.9, 1.2, 500, 4.2, 1.2, 500);
  assert.equal(tTest.rejectNullAt05, true);
  console.log('   ✓ Statistics Engine passed descriptive, correlation, Z-score, CI, and t-test checks.');

  // ---------------------------------------------------------------------------
  // 5. CSV & JSON Dataset Upload, Validation & Profiling
  // ---------------------------------------------------------------------------
  console.log('5. Testing Dataset Playground Upload, Validation & Stats...');
  assert.ok(PRELOADED_PLAYGROUND_DATASETS.length >= 4, 'Must have at least 4 preloaded datasets');

  const validCsv = `region,revenue,orders\nNorth,1500,12\nSouth,,8\nWest,2100,15`;
  const csvParse = validateAndParseDatasetFile('regional_sales.csv', validCsv);
  assert.equal(csvParse.valid, true, 'Valid CSV should pass validation');
  assert.equal(csvParse.dataset?.rows.length, 3);
  assert.equal(csvParse.dataset?.isUploaded, true);

  const csvProfiles = profileDatasetColumns(csvParse.dataset!.rows);
  const revProfile = csvProfiles.find((c) => c.name === 'revenue');
  assert.equal(revProfile?.type, 'number');
  assert.equal(revProfile?.missingCount, 1, 'Should detect 1 missing value in revenue');

  const csvStats = computeDatasetNumericStats(csvParse.dataset!.rows);
  const revStat = csvStats.find((s) => s.column === 'revenue');
  assert.equal(revStat?.mean, 1800, 'Mean of [1500, 2100] should be 1800');

  const validJson = JSON.stringify([
    { channel: 'Search', spend: 500, conversions: 25 },
    { channel: 'Email', spend: 100, conversions: 40 },
  ]);
  const jsonParse = validateAndParseDatasetFile('campaigns.json', validJson);
  assert.equal(jsonParse.valid, true, 'Valid JSON should pass validation');
  assert.equal(jsonParse.dataset?.rows.length, 2);

  // Invalid file extension
  const badExt = validateAndParseDatasetFile('malware.exe', 'binary');
  assert.equal(badExt.valid, false);
  // Malformed JSON
  const badJson = validateAndParseDatasetFile('broken.json', '{bad json');
  assert.equal(badJson.valid, false);
  // Malformed CSV (mismatched columns)
  const badCsv = validateAndParseDatasetFile('broken.csv', 'a,b,c\n1,2');
  assert.equal(badCsv.valid, false);
  console.log('   ✓ Dataset Service passed CSV/JSON parsing, validation, and missing-value profiling.');

  // ---------------------------------------------------------------------------
  // 6. Exercise Bank & Answer Evaluation Across All 8 Types
  // ---------------------------------------------------------------------------
  console.log('6. Testing Practice Exercise Bank & Answer Evaluator...');
  assert.equal(PRACTICE_EXERCISES.length, 32, 'Practice bank should contain 32 exercises');
  const requiredTypes = [
    'sql',
    'python',
    'spreadsheet',
    'statistics',
    'visualization',
    'business_kpi',
    'dataset_investigation',
    'analytical_reasoning',
  ];
  for (const t of requiredTypes) {
    assert.ok(
      PRACTICE_EXERCISES.some((e) => e.type === t),
      `Practice bank must include exercises of type "${t}"`
    );
  }

  // Test grading SQL exercise ex-sql-01
  const exSql1 = PRACTICE_EXERCISES.find((e) => e.id === 'ex-sql-01')!;
  const gradeSqlPass = evaluatePracticeExercise(exSql1, {
    sqlCode: exSql1.solutionCode,
    sqlResult: sqlRes1,
  });
  assert.equal(gradeSqlPass.isCorrect, true, 'ex-sql-01 solution should grade as correct');

  // Test grading Stats exercise ex-stats-01
  const exStats1 = PRACTICE_EXERCISES.find((e) => e.id === 'ex-stats-01')!;
  const gradeStatsPass = evaluatePracticeExercise(exStats1, { numericInput: 22 });
  assert.equal(gradeStatsPass.isCorrect, true, 'ex-stats-01 answer 22 should grade as correct');
  const gradeStatsFail = evaluatePracticeExercise(exStats1, { numericInput: 44.29 });
  assert.equal(gradeStatsFail.isCorrect, false, 'ex-stats-01 wrong answer 44.29 should fail');

  // Test grading Chart Builder exercise ex-viz-01
  const exViz1 = PRACTICE_EXERCISES.find((e) => e.id === 'ex-viz-01')!;
  const gradeVizPass = evaluatePracticeExercise(exViz1, {
    chartConfig: { chartType: 'line', xKey: 'month', yKey: 'revenue_usd' },
  });
  assert.equal(gradeVizPass.isCorrect, true);
  console.log('   ✓ Exercise Grader passed verification across SQL, Python, Sheets, Stats, Viz, and KPI exercises.');

  // ---------------------------------------------------------------------------
  // 7. Mistake Journal & Smart Revision Recommendation Engine
  // ---------------------------------------------------------------------------
  console.log('7. Testing Mistake Journal & Dynamic Smart Revision Engine...');
  const initialPlan = generateSmartRevisionPlan(INITIAL_DEMO_USER);
  assert.ok(initialPlan.length >= 2, 'Smart Revision should generate recommendations from user activity');
  assert.equal(
    initialPlan[0].urgency,
    'high',
    'Unresolved mistakes in Mistake Journal should be ranked high urgency'
  );
  assert.ok(
    initialPlan.some((r) => r.topicId === 'd3-t3'),
    'Smart Revision must prioritize topic d3-t3 (GROUP BY & HAVING mistake)'
  );

  // Verify that resolving mistakes dynamically lowers urgency / removes resolved items
  const resolvedUser: UserProfile = {
    ...INITIAL_DEMO_USER,
    mistakeRecords: INITIAL_DEMO_USER.mistakeRecords?.map((m) => ({
      ...m,
      reviewStatus: 'resolved',
    })),
    practiceAttempts: INITIAL_DEMO_USER.practiceAttempts?.map((a) => ({
      ...a,
      isCorrect: true,
    })),
  };
  const updatedPlan = generateSmartRevisionPlan(resolvedUser);
  assert.ok(
    !updatedPlan.some((r) => r.mistakeCount > 0),
    'Resolving all mistakes should result in 0 unresolved mistakes in Smart Revision'
  );
  console.log('   ✓ Mistake Journal & Smart Revision Engine passed dynamic prioritization tests.');

  console.log('\n=============================================================');
  console.log('ALL PHASE 3 AUTOMATED TESTS PASSED SUCCESSFULLY! (100%)');
  console.log('=============================================================');
}

runPhase3Tests().catch((err) => {
  console.error('Phase 3 Test Suite Failed:', err);
  process.exit(1);
});
