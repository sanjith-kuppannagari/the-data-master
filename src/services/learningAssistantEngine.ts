export interface AssistantResponse {
  source: 'local_pedagogical_engine';
  topic: string;
  explanation: string;
  actionableSteps: string[];
  codeExample?: string;
  disclaimer: string;
}

const CONCEPT_KNOWLEDGE_BASE: Record<string, { explanation: string; steps: string[]; code?: string }> = {
  // SQL Concepts
  'window function': {
    explanation:
      'A window function performs a calculation across a set of table rows that are related to the current row, without collapsing rows like GROUP BY does.',
    steps: [
      'Define the target calculation (e.g., SUM, AVG, RANK, ROW_NUMBER).',
      'Use OVER (PARTITION BY ... ORDER BY ...) to establish the analytical window frame.',
      'Remember: Window functions evaluate AFTER the WHERE, GROUP BY, and HAVING clauses.'
    ],
    code: `SELECT customer_id, order_date, amount,\n       AVG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS running_avg\nFROM orders;`
  },
  'cte': {
    explanation:
      'A Common Table Expression (CTE) is a named, temporary result set that exists only within the execution scope of a single SQL statement (WITH ... AS).',
    steps: [
      'Use CTEs to break complex nested subqueries into readable, step-by-step pipelines.',
      'Separate multiple CTEs using commas after a single WITH keyword.',
      'Reference earlier CTEs in subsequent CTE definitions.'
    ],
    code: `WITH monthly_revenue AS (\n  SELECT DATE_TRUNC('month', order_date) AS mth, SUM(amount) AS rev\n  FROM transactions\n  GROUP BY 1\n)\nSELECT mth, rev FROM monthly_revenue WHERE rev > 50000;`
  },
  'having vs where': {
    explanation:
      'WHERE filters individual rows BEFORE aggregations occur. HAVING filters aggregated group metrics AFTER GROUP BY has collapsed rows.',
    steps: [
      'Filter raw row attributes (e.g., country = "USA") in the WHERE clause.',
      'Aggregate using GROUP BY (e.g., GROUP BY customer_id).',
      'Filter aggregate metrics (e.g., SUM(sales) > 1000) in the HAVING clause.'
    ],
    code: `SELECT customer_id, SUM(amount) AS total\nFROM orders\nWHERE status = 'completed' -- Row filter\nGROUP BY customer_id\nHAVING SUM(amount) > 5000; -- Group filter`
  },
  'p-value': {
    explanation:
      'In hypothesis testing, the p-value is the probability of observing test results at least as extreme as the actual data, assuming the null hypothesis (H₀) is true.',
    steps: [
      'If p-value ≤ α (typically 0.05): Reject the null hypothesis (statistically significant effect).',
      'If p-value > α: Fail to reject the null hypothesis (insufficient evidence of an effect).',
      'Caution: A small p-value does NOT prove that the effect size has commercial importance.'
    ]
  },
  'tukey fences': {
    explanation:
      'Tukey fences use non-parametric quartiles to identify outliers without assuming a normal distribution, making them robust on skewed data.',
    steps: [
      'Calculate the Interquartile Range: IQR = Q₃ - Q₁.',
      'Compute Lower Outlier Fence: Q₁ - 1.5 × IQR.',
      'Compute Upper Outlier Fence: Q₃ + 1.5 × IQR.',
      'Values outside these fences are classified as potential anomalies.'
    ]
  },
  'ltv:cac': {
    explanation:
      'The LTV:CAC ratio compares the Customer Lifetime Value against the fully-loaded Customer Acquisition Cost. The industry benchmark for sustainable SaaS is 3:1.',
    steps: [
      'LTV = (ARPU × Gross Margin %) / Churn Rate.',
      'CAC = (Sales + Marketing Expenses) / Net New Customers Acquired.',
      'Ratio < 1: Losing money on every acquired customer.',
      'Ratio > 5: Likely under-investing in marketing expansion.'
    ]
  },
  'simpson\'s paradox': {
    explanation:
      'A statistical phenomenon where a trend appears in different groups of data but disappears or reverses when the groups are aggregated.',
    steps: [
      'Always look for confounding variables (e.g., customer segment, device type).',
      'Disaggregate high-level metrics into key categorical cohorts before drawing conclusions.'
    ]
  }
};

/**
 * Interpret error messages and provide actionable debugging advice
 */
export const interpretRuntimeError = (
  errorText: string,
  context: 'sql' | 'python' | 'spreadsheet' = 'sql'
): AssistantResponse => {
  const lower = errorText.toLowerCase();

  if (context === 'sql') {
    if (lower.includes('group by') || lower.includes('aggregate')) {
      return {
        source: 'local_pedagogical_engine',
        topic: 'SQL Aggregation & GROUP BY Mismatch',
        explanation:
          'In SQL, every non-aggregated column in your SELECT list MUST be included in your GROUP BY clause.',
        actionableSteps: [
          'Inspect the columns in your SELECT clause.',
          'Identify which columns are wrapped in aggregates (e.g. SUM, AVG, COUNT) and which are bare columns.',
          'Add all bare columns to your GROUP BY clause, or wrap them in an aggregate function.'
        ],
        codeExample: `SELECT category, region, SUM(sales) -- category & region must be in GROUP BY\nFROM transactions\nGROUP BY category, region;`,
        disclaimer: 'Curriculum Rule Engine • Deterministic Debugging',
      };
    }

    if (lower.includes('syntax error') || lower.includes('near')) {
      return {
        source: 'local_pedagogical_engine',
        topic: 'SQL Syntax Structure',
        explanation:
          'A syntax error indicates that the query parser encountered an unexpected keyword, missing comma, or misplaced clause.',
        actionableSteps: [
          'Verify the canonical SQL clause execution order: SELECT -> FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> ORDER BY -> LIMIT.',
          'Check for a trailing comma on the line immediately preceding the error.',
          'Ensure all string literals are enclosed in single quotes (\'text\') rather than double quotes.'
        ],
        disclaimer: 'Curriculum Rule Engine • Deterministic Debugging',
      };
    }

    if (lower.includes('no such table') || lower.includes('does not exist')) {
      return {
        source: 'local_pedagogical_engine',
        topic: 'Table Schema Identifier',
        explanation:
          'The query engine cannot find the referenced table name in the active database schema.',
        actionableSteps: [
          'Inspect the Schema Inspector panel to verify the exact table spelling (e.g. "orders" vs "order_items").',
          'Ensure you did not miss a FROM or JOIN keyword.'
        ],
        disclaimer: 'Curriculum Rule Engine • Deterministic Debugging',
      };
    }
  }

  if (context === 'python') {
    if (lower.includes('keyerror')) {
      return {
        source: 'local_pedagogical_engine',
        topic: 'Pandas DataFrame KeyError',
        explanation:
          'A KeyError occurs when attempting to access a column or index label that does not exist in the DataFrame.',
        actionableSteps: [
          'Run `df.columns` to inspect the exact column spelling and case sensitivity.',
          'Check for leading or trailing whitespace in CSV column headers.'
        ],
        codeExample: `print(df.columns.tolist()) # Inspect actual headers`,
        disclaimer: 'Curriculum Rule Engine • Deterministic Debugging',
      };
    }

    if (lower.includes('zerodivisionerror')) {
      return {
        source: 'local_pedagogical_engine',
        topic: 'Division by Zero Guard',
        explanation:
          'The Python calculation attempted to divide a number by zero or an empty set.',
        actionableSteps: [
          'Add a conditional check: `if denominator != 0:` before division.',
          'In Pandas, use `np.where(df["col"] != 0, df["num"] / df["col"], 0)`.'
        ],
        disclaimer: 'Curriculum Rule Engine • Deterministic Debugging',
      };
    }
  }

  // Fallback for general errors
  return {
    source: 'local_pedagogical_engine',
    topic: 'Analytical Execution Diagnostic',
    explanation: `Encountered runtime diagnostic: "${errorText.slice(0, 100)}"`,
    actionableSteps: [
      'Check data types of all referenced variables or columns.',
      'Verify that null values or missing data are handled defensively.',
      'Run intermediate calculations step-by-step to isolate the failing line.'
    ],
    disclaimer: 'Curriculum Rule Engine • Deterministic Debugging',
  };
};

/**
 * Explains an analytical concept on demand
 */
export const explainAnalyticalConcept = (conceptQuery: string): AssistantResponse => {
  const query = conceptQuery.toLowerCase().trim();

  for (const [key, value] of Object.entries(CONCEPT_KNOWLEDGE_BASE)) {
    if (query.includes(key) || key.includes(query)) {
      return {
        source: 'local_pedagogical_engine',
        topic: key.toUpperCase(),
        explanation: value.explanation,
        actionableSteps: value.steps,
        codeExample: value.code,
        disclaimer: 'Curriculum Pedagogical Knowledge Base',
      };
    }
  }

  // Default concept fallback
  return {
    source: 'local_pedagogical_engine',
    topic: conceptQuery,
    explanation: `In data analytics, "${conceptQuery}" relates to rigorous empirical observation, structured querying, and deriving business decisions from quantitative evidence.`,
    actionableSteps: [
      'Define the metric numerator and denominator precisely.',
      'Check whether the metric is sensitive to outliers or skewed distributions.',
      'Validate conclusions with cross-tabulated cohort breakdowns.'
    ],
    disclaimer: 'Curriculum Pedagogical Knowledge Base',
  };
};

/**
 * Returns progressive hint without spoiling the answer
 */
export const getProgressiveHint = (level: 1 | 2 | 3, topicTitle: string): string => {
  if (level === 1) {
    return `Hint 1 (Conceptual Orientation): Focus on the core objective of ${topicTitle}. Consider what data relationship or mathematical formula forms the foundation before writing syntax.`;
  }
  if (level === 2) {
    return `Hint 2 (Syntactic Structure): Structure your statement into steps: 1) Identify input columns, 2) Apply the appropriate function/clause, 3) Verify edge cases like null values.`;
  }
  return `Hint 3 (Forensic Diagnostic): Check whether your query/formula filters out unexpected rows or misplaces parentheses. Verify against the schema inspector columns.`;
};
