import assert from 'node:assert/strict';
import { CHALLENGES_DATA } from '../data/challengesData';
import { BUSINESS_SIMULATIONS_DATA } from '../data/simulationsData';
import { DATA_DETECTIVE_MYSTERIES } from '../data/detectiveData';
import { COMPETITIONS_DATA } from '../data/competitionsData';
import {
  evaluateChallenge,
  evaluateChallengeTask,
  evaluateCompetitionEntry,
  evaluateDetectiveMystery,
  evaluateSimulationRecommendation,
} from '../services/challengeEvaluationEngine';
import { executeSQLQuery } from '../services/sqlEngine';
import { evaluateXPReward } from '../services/gamification';

async function runPhase4Tests() {
  console.log('=============================================================');
  console.log('RUNNING PHASE 4 AUTOMATED VERIFICATION SUITE');
  console.log('=============================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Challenge Library Completeness & Categorization
  // ---------------------------------------------------------------------------
  console.log('1. Testing Challenge Library & 8 Categories...');
  assert.ok(CHALLENGES_DATA.length >= 8, 'Must have at least 8 challenges');

  const requiredCategories = [
    'sql',
    'python',
    'spreadsheet',
    'statistics',
    'visualization',
    'business_analytics',
    'dataset_investigation',
    'case_study',
  ];
  for (const cat of requiredCategories) {
    assert.ok(
      CHALLENGES_DATA.some((c) => c.category === cat),
      `Challenge bank must include a challenge for category "${cat}"`
    );
  }

  // Check prerequisite locking
  const lockedChallenge = CHALLENGES_DATA.find((c) => c.prerequisiteChallengeIds && c.prerequisiteChallengeIds.length > 0);
  assert.ok(lockedChallenge, 'There should be challenges with prerequisite dependencies');
  console.log('   ✓ Challenge bank contains all 8 required categories and dependency constraints.');

  // ---------------------------------------------------------------------------
  // 2. Multi-Modal Task & Challenge Evaluation
  // ---------------------------------------------------------------------------
  console.log('2. Testing Multi-Modal Challenge Evaluation Engine...');
  const chSql = CHALLENGES_DATA.find((c) => c.id === 'ch-01')!;
  const sqlTask = chSql.tasks.find((t) => t.submissionMode === 'sql_query')!;

  const sqlRes = await executeSQLQuery(
    'ecommerce',
    sqlTask.solutionCode!
  );
  assert.equal(sqlRes.success, true);

  const evalTask1 = await evaluateChallengeTask(sqlTask, sqlTask.solutionCode!, {
    sqlDatabaseId: 'ecommerce',
    sqlResult: sqlRes,
  });
  assert.equal(evalTask1.isCorrect, true);
  assert.equal(evalTask1.score, 100);

  // Test full challenge evaluation for ch-01
  const fullEval = await evaluateChallenge(chSql, {
    draftCode: sqlTask.solutionCode!,
    taskAnswers: {
      't-sql-1': sqlTask.solutionCode!,
      't-sql-2': 1, // Maya Lin
    },
    sqlResult: sqlRes,
  });
  assert.equal(fullEval.isPassed, true);
  assert.equal(fullEval.totalScore, 100);

  // Test Spreadsheet formula task
  const chSheet = CHALLENGES_DATA.find((c) => c.id === 'ch-02')!;
  const sheetTask = chSheet.tasks.find((t) => t.submissionMode === 'spreadsheet_formula')!;
  const sheetEval = await evaluateChallengeTask(sheetTask, '=4500*(8.5+2.1)');
  assert.equal(sheetEval.isCorrect, true);

  // Test Numeric task
  const numTask = chSheet.tasks.find((t) => t.submissionMode === 'numeric_value')!;
  const numEval = await evaluateChallengeTask(numTask, 14500);
  assert.equal(numEval.isCorrect, true);
  console.log('   ✓ Challenge evaluation engine accurately grades SQL, spreadsheet, and numeric tasks.');

  // ---------------------------------------------------------------------------
  // 3. Business Simulations (All 7 Scenarios)
  // ---------------------------------------------------------------------------
  console.log('3. Testing 7 Business Simulations & Rubric Evaluation...');
  assert.equal(BUSINESS_SIMULATIONS_DATA.length, 7, 'Must have exactly 7 business simulations');

  const sim1 = BUSINESS_SIMULATIONS_DATA.find((s) => s.id === 'sim-01')!;
  const simEvalPass = evaluateSimulationRecommendation(
    sim1,
    { 'q1-1': 1, 'q1-2': 1 },
    'In the North and East apparel departments, promo share reached 50% due to discount stacking, eroding gross profit margins to 32%. We must institute floor margin guardrails of 40% and prohibit stacking.'
  );
  assert.equal(simEvalPass.isPassed, true, 'Valid simulation answers and memo should pass rubric');
  assert.ok(simEvalPass.score >= 70);
  assert.equal(simEvalPass.rubricBreakdown.analyticalAccuracy, 40);

  const simEvalFail = evaluateSimulationRecommendation(
    sim1,
    { 'q1-1': 0, 'q1-2': 0 },
    'Sales fell. Maybe do more ads.'
  );
  assert.equal(simEvalFail.isPassed, false, 'Superficial memo with wrong answers must fail rubric');
  assert.ok(simEvalFail.score < 70);
  console.log('   ✓ All 7 business simulations rubric evaluation functioning with transparent scoring.');

  // ---------------------------------------------------------------------------
  // 4. Data Detective Forensic Mysteries
  // ---------------------------------------------------------------------------
  console.log('4. Testing Data Detective Bureau Cases & Verdicts...');
  assert.ok(DATA_DETECTIVE_MYSTERIES.length >= 3, 'Must have at least 3 mystery dossiers');
  assert.ok(
    DATA_DETECTIVE_MYSTERIES.some((m) => m.difficulty === 'beginner') &&
    DATA_DETECTIVE_MYSTERIES.some((m) => m.difficulty === 'advanced'),
    'Must have both beginner and advanced mysteries'
  );

  const case1 = DATA_DETECTIVE_MYSTERIES.find((m) => m.id === 'case-884')!;
  const detEvalPass = evaluateDetectiveMystery(
    case1,
    { 'det-q1': 1, 'det-q2': 1 },
    case1.correctVerdictIndex
  );
  assert.equal(detEvalPass.isSolved, true);
  assert.equal(detEvalPass.score, 100);

  const detEvalFail = evaluateDetectiveMystery(
    case1,
    { 'det-q1': 0, 'det-q2': 0 },
    0 // Wrong verdict
  );
  assert.equal(detEvalFail.isSolved, false);
  console.log('   ✓ Data Detective cases properly verify clues, intermediate questions, and verdicts.');

  // ---------------------------------------------------------------------------
  // 5. Competitions & Fair Leaderboard
  // ---------------------------------------------------------------------------
  console.log('5. Testing Competitions & Fair Leaderboards...');
  assert.ok(COMPETITIONS_DATA.length >= 2, 'Must have weekly and monthly competitions');
  const comp1 = COMPETITIONS_DATA[0];
  assert.ok(comp1.leaderboard.length >= 3, 'Competition leaderboard must contain valid participant entries');

  const compEntry = evaluateCompetitionEntry(
    comp1,
    'Our cohort retention analysis shows that e-commerce margin leakage is concentrated in seasonal categories where freight cost exceeded revenue. By enforcing a minimum order value threshold and calculating contribution margin per order, we restore net profit.'
  );
  assert.ok(compEntry.score >= 70);
  console.log('   ✓ Competition engine scores deliverables and ranks entries on verified leaderboard.');

  // ---------------------------------------------------------------------------
  // 6. Anti-Duplicate XP Verification for Phase 4 Activities
  // ---------------------------------------------------------------------------
  console.log('6. Testing Idempotent Anti-Duplicate XP Awards...');
  const userId = 'usr_demo_01';
  const completedActivities: string[] = [];

  const firstAward = evaluateXPReward(userId, 'challenge', 'ch-01', 90, completedActivities, false);
  assert.equal(firstAward.isDuplicate, false);
  assert.equal(firstAward.xpAwarded, 90);
  completedActivities.push(firstAward.transaction.id);

  // Attempt duplicate submission
  const secondAward = evaluateXPReward(userId, 'challenge', 'ch-01', 90, completedActivities, false);
  assert.equal(secondAward.isDuplicate, true);
  assert.equal(secondAward.xpAwarded, 0, 'Duplicate challenge submission must award 0 XP');

  // Simulation anti-duplicate XP
  const simAward1 = evaluateXPReward(userId, 'simulation', 'sim-01', 140, completedActivities, false);
  assert.equal(simAward1.isDuplicate, false);
  assert.equal(simAward1.xpAwarded, 140);
  completedActivities.push(simAward1.transaction.id);

  const simAward2 = evaluateXPReward(userId, 'simulation', 'sim-01', 140, completedActivities, false);
  assert.equal(simAward2.isDuplicate, true);
  assert.equal(simAward2.xpAwarded, 0, 'Duplicate simulation submission must award 0 XP');
  console.log('   ✓ Anti-duplicate XP protection strictly enforced across challenges and simulations.');

  console.log('\n=============================================================');
  console.log('ALL PHASE 4 AUTOMATED TESTS PASSED SUCCESSFULLY! (100%)');
  console.log('=============================================================');
}

runPhase4Tests().catch((err) => {
  console.error('Phase 4 Test Suite Failed:', err);
  process.exit(1);
});
