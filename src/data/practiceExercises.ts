import {
  ErrorCategory,
  PracticeExercise,
} from '../types/practice';
import { SQLQueryResult } from '../services/sqlEngine';
import { PythonExecutionResult } from '../services/pythonEngine';
import { CellEvalResult } from '../services/spreadsheetEngine';

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  // ============================================================================
  // 1. INTERACTIVE SQL WORKSPACE EXERCISES (8 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-sql-01',
    title: 'High-Value Completed Orders Filter (SELECT, WHERE, ORDER BY)',
    domainId: 'domain-3',
    topicId: 'd3-t2',
    subtopic: 'Filtering & Sorting Queries',
    type: 'sql',
    isCoding: true,
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 50,
    objective: 'Filter completed e-commerce orders above a revenue threshold and sort them from highest to lowest.',
    scenario:
      'The Finance team wants a clean list of all completed orders with a total_amount strictly greater than $400, ordered from largest order value to smallest.',
    instructions: [
      'Query the `orders` table in the `ecommerce` database.',
      'Select `order_id`, `customer_id`, `order_date`, and `total_amount`.',
      "Filter for rows where `status = 'Completed'` AND `total_amount > 400`.",
      'Sort the results by `total_amount` in descending order (`DESC`).',
    ],
    evaluationCriteria:
      'Result must contain columns order_id, customer_id, order_date, total_amount, return the 6 matching completed orders > $400, with order_id 1007 ($1200) first.',
    hints: [
      "Use `WHERE status = 'Completed' AND total_amount > 400` to apply both conditions.",
      'Add `ORDER BY total_amount DESC` at the end of your query.',
    ],
    explanation:
      'Filtering before sorting ensures SQLite scans only completed orders exceeding $400 and orders them descending so the highest-value order (1007 at $1200.00) appears first.',
    sqlDatabaseId: 'ecommerce',
    starterCode: `SELECT order_id, customer_id, order_date, total_amount
FROM orders
WHERE status = 'Completed'
-- Add your total_amount filter and ORDER BY clause below:
`,
    solutionCode: `SELECT order_id, customer_id, order_date, total_amount
FROM orders
WHERE status = 'Completed' AND total_amount > 400
ORDER BY total_amount DESC;`,
    expectedColumns: ['order_id', 'customer_id', 'order_date', 'total_amount'],
    expectedRowCount: 6,
    expectedFirstRowValues: [1007, 6, '2025-02-05', 1200],
    requiredSqlKeywords: ['SELECT', 'WHERE', 'ORDER BY'],
  },
  {
    id: 'ex-sql-02',
    title: 'Distinct Customer Acquisition Channels & Top Limit (DISTINCT, LIMIT)',
    domainId: 'domain-3',
    topicId: 'd3-t1',
    subtopic: 'Unique Values & Result Limiting',
    type: 'sql',
    isCoding: true,
    difficulty: 'beginner',
    estimatedMinutes: 6,
    xpReward: 45,
    objective: 'Extract unique acquisition channels sorted alphabetically from the customers table.',
    scenario:
      'Marketing Operations needs a deduplicated alphabetical list of every acquisition channel currently recorded in the `customers` table.',
    instructions: [
      'Query the `customers` table in the `ecommerce` database.',
      'Use `SELECT DISTINCT acquisition_channel` to remove duplicates.',
      'Order the channels alphabetically (`ORDER BY acquisition_channel ASC`).',
    ],
    evaluationCriteria:
      'Must use DISTINCT and return the 4 unique acquisition channels in alphabetical order starting with Direct.',
    hints: [
      'Place the `DISTINCT` keyword immediately after `SELECT`.',
      'Sort with `ORDER BY acquisition_channel ASC`.',
    ],
    explanation:
      '`SELECT DISTINCT` eliminates duplicate rows from the projection so each unique channel (`Direct`, `Email`, `Organic Search`, `Paid Social`) is returned once.',
    sqlDatabaseId: 'ecommerce',
    starterCode: `SELECT acquisition_channel
FROM customers;`,
    solutionCode: `SELECT DISTINCT acquisition_channel
FROM customers
ORDER BY acquisition_channel ASC;`,
    expectedColumns: ['acquisition_channel'],
    expectedRowCount: 4,
    expectedFirstRowValues: ['Direct'],
    requiredSqlKeywords: ['DISTINCT', 'ORDER BY'],
  },
  {
    id: 'ex-sql-03',
    title: 'Regional Revenue Aggregation with HAVING Filter',
    domainId: 'domain-3',
    topicId: 'd3-t3',
    subtopic: 'GROUP BY & HAVING Clauses',
    type: 'sql',
    isCoding: true,
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 65,
    objective: 'Aggregate completed order revenue by customer region and filter groups using HAVING.',
    scenario:
      'Executive leadership wants to see total completed revenue and order count for each customer `region`, but only for regions whose total completed revenue exceeds $1,000.',
    instructions: [
      'Join `customers c` and `orders o` on `c.customer_id = o.customer_id` in the `ecommerce` database.',
      "Filter for completed orders (`WHERE o.status = 'Completed'`).",
      'Group by `c.region` and select `c.region`, `COUNT(o.order_id) AS order_count`, and `SUM(o.total_amount) AS total_revenue`.',
      'Filter the grouped results using `HAVING SUM(o.total_amount) > 1000` and sort by `total_revenue DESC`.',
    ],
    evaluationCriteria:
      'Query must use GROUP BY and HAVING (not WHERE for the aggregate check), returning North America ($2520) and Europe ($1640).',
    hints: [
      'Remember: `WHERE` filters individual rows (`o.status = \'Completed\'`) before grouping, while `HAVING` filters aggregated groups (`HAVING SUM(o.total_amount) > 1000`).',
      'Group by `c.region` and sort by `total_revenue DESC`.',
    ],
    explanation:
      'SQL evaluates `WHERE` before `GROUP BY`, and `HAVING` after `GROUP BY`. Using `HAVING SUM(o.total_amount) > 1000` properly filters out regions whose summed revenue is $1,000 or less.',
    sqlDatabaseId: 'ecommerce',
    starterCode: `SELECT c.region, COUNT(o.order_id) AS order_count, SUM(o.total_amount) AS total_revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'Completed'
-- Add GROUP BY, HAVING, and ORDER BY below:
`,
    solutionCode: `SELECT c.region, COUNT(o.order_id) AS order_count, SUM(o.total_amount) AS total_revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'Completed'
GROUP BY c.region
HAVING SUM(o.total_amount) > 1000
ORDER BY total_revenue DESC;`,
    expectedColumns: ['region', 'order_count', 'total_revenue'],
    expectedRowCount: 2,
    expectedFirstRowValues: ['North America', 5, 2520],
    requiredSqlKeywords: ['GROUP BY', 'HAVING'],
  },
  {
    id: 'ex-sql-04',
    title: 'Department Headcount & Average Salary Join (JOIN & Aggregates)',
    domainId: 'domain-3',
    topicId: 'd3-t4',
    subtopic: 'Relational Joins & Aggregations',
    type: 'sql',
    isCoding: true,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 60,
    objective: 'Join departments and employees in the HR database to compute active headcount and average salary.',
    scenario:
      'The People Analytics team wants a breakdown of active employees per department, showing department name, active headcount, and rounded average salary.',
    instructions: [
      'Switch to the `hr_analytics` database.',
      'Join `departments d` and `employees e` on `d.dept_id = e.dept_id`.',
      'Filter for active employees (`WHERE e.is_active = 1`).',
      'Select `d.dept_name`, `COUNT(e.emp_id) AS active_headcount`, and `ROUND(AVG(e.salary), 0) AS avg_salary`.',
      'Group by `d.dept_name` and order by `avg_salary DESC`.',
    ],
    evaluationCriteria:
      'Returns 4 departments ordered by avg_salary descending, starting with Data Science (avg_salary 135000).',
    hints: [
      'Use `WHERE e.is_active = 1` so departed employees are excluded.',
      'Use `ROUND(AVG(e.salary), 0) AS avg_salary` and `GROUP BY d.dept_name`.',
    ],
    explanation:
      'Joining `departments` with `employees` on `dept_id` and filtering `is_active = 1` produces accurate active headcount and mean compensation per department.',
    sqlDatabaseId: 'hr_analytics',
    starterCode: `SELECT d.dept_name, COUNT(e.emp_id) AS active_headcount, ROUND(AVG(e.salary), 0) AS avg_salary
FROM departments d
JOIN employees e ON d.dept_id = e.dept_id
-- Complete the WHERE, GROUP BY, and ORDER BY clauses:
`,
    solutionCode: `SELECT d.dept_name, COUNT(e.emp_id) AS active_headcount, ROUND(AVG(e.salary), 0) AS avg_salary
FROM departments d
JOIN employees e ON d.dept_id = e.dept_id
WHERE e.is_active = 1
GROUP BY d.dept_name
ORDER BY avg_salary DESC;`,
    expectedColumns: ['dept_name', 'active_headcount', 'avg_salary'],
    expectedRowCount: 4,
    expectedFirstRowValues: ['Data Science', 2, 135000],
    requiredSqlKeywords: ['JOIN', 'GROUP BY', 'AVG'],
  },
  {
    id: 'ex-sql-05',
    title: 'Above-Average SaaS MRR Accounts (Subqueries)',
    domainId: 'domain-3',
    topicId: 'd3-t5',
    subtopic: 'Scalar Subqueries',
    type: 'sql',
    isCoding: true,
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 70,
    objective: 'Use a scalar subquery to identify SaaS accounts paying more than the company-wide average MRR.',
    scenario:
      'Customer Success wants to prioritize accounts whose `mrr_usd` is strictly greater than the average `mrr_usd` across all accounts in `saas_metrics`.',
    instructions: [
      'Query the `accounts` table in the `saas_metrics` database.',
      'Select `account_id`, `company_name`, `plan_tier`, and `mrr_usd`.',
      'In the `WHERE` clause, compare `mrr_usd > (SELECT AVG(mrr_usd) FROM accounts)`.',
      'Order the results by `mrr_usd DESC`.',
    ],
    evaluationCriteria:
      'Must use a subquery to filter accounts above the $2178.57 average MRR, returning the 3 Enterprise accounts ordered by MRR descending.',
    hints: [
      'A scalar subquery in parentheses `(SELECT AVG(mrr_usd) FROM accounts)` evaluates the overall mean MRR dynamically.',
      'Sort with `ORDER BY mrr_usd DESC`.',
    ],
    explanation:
      'Scalar subqueries compute a single aggregate value (`AVG(mrr_usd)`) that the outer query uses as a dynamic filter threshold without hardcoding constants.',
    sqlDatabaseId: 'saas_metrics',
    starterCode: `SELECT account_id, company_name, plan_tier, mrr_usd
FROM accounts
-- Add WHERE subquery and ORDER BY below:
`,
    solutionCode: `SELECT account_id, company_name, plan_tier, mrr_usd
FROM accounts
WHERE mrr_usd > (SELECT AVG(mrr_usd) FROM accounts)
ORDER BY mrr_usd DESC;`,
    expectedColumns: ['account_id', 'company_name', 'plan_tier', 'mrr_usd'],
    expectedRowCount: 3,
    expectedFirstRowValues: [204, 'OmniHealth', 'Enterprise', 5600],
    requiredSqlKeywords: ['SELECT', 'AVG'],
  },
  {
    id: 'ex-sql-06',
    title: 'Department Salary Ranking with Window Functions (RANK / OVER)',
    domainId: 'domain-3',
    topicId: 'd3-t6',
    subtopic: 'Window Functions & Partitioning',
    type: 'sql',
    isCoding: true,
    difficulty: 'advanced',
    estimatedMinutes: 15,
    xpReward: 85,
    objective: 'Rank employees by salary within each department using SQLite window functions.',
    scenario:
      'Compensation analysts need to see every employee alongside their salary rank within their own department (`dept_id`), ordered by department and rank.',
    instructions: [
      'Query the `employees` table in `hr_analytics`.',
      'Select `full_name`, `dept_id`, `salary`, and `RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_salary_rank`.',
      'Order the final output by `dept_id ASC, dept_salary_rank ASC`.',
    ],
    evaluationCriteria:
      'Must use OVER and PARTITION BY dept_id to compute within-department salary rank across all 8 employee records.',
    hints: [
      'Use `RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_salary_rank`.',
      'Order the result set by `dept_id ASC, dept_salary_rank ASC`.',
    ],
    explanation:
      'Window functions with `PARTITION BY` calculate rankings across logical groups (each department) without collapsing individual employee rows like `GROUP BY` does.',
    sqlDatabaseId: 'hr_analytics',
    starterCode: `SELECT
  full_name,
  dept_id,
  salary,
  -- Add RANK() OVER (...) window function as dept_salary_rank:
FROM employees
ORDER BY dept_id ASC, dept_salary_rank ASC;`,
    solutionCode: `SELECT
  full_name,
  dept_id,
  salary,
  RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_salary_rank
FROM employees
ORDER BY dept_id ASC, dept_salary_rank ASC;`,
    expectedColumns: ['full_name', 'dept_id', 'salary', 'dept_salary_rank'],
    expectedRowCount: 8,
    expectedFirstRowValues: ['Aarav Mehta', 10, 145000, 1],
    requiredSqlKeywords: ['OVER', 'PARTITION BY'],
  },
  {
    id: 'ex-sql-07',
    title: 'Product Margin & Revenue Contribution Analysis',
    domainId: 'domain-3',
    topicId: 'd3-t4',
    subtopic: 'Multi-Column Expressions & Joins',
    type: 'sql',
    isCoding: true,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 60,
    objective: 'Calculate unit profit margin per product and sort products by unit profit.',
    scenario:
      'Merchandising wants to inspect each product in the catalog with its calculated `unit_profit` (`unit_price - unit_cost`), ordered from highest unit profit to lowest.',
    instructions: [
      'Query the `products` table in the `ecommerce` database.',
      'Select `product_id`, `product_name`, `category`, `unit_price`, and `(unit_price - unit_cost) AS unit_profit`.',
      'Order the results by `unit_profit DESC`.',
    ],
    evaluationCriteria:
      'Returns all 6 products with calculated unit_profit column, starting with Enterprise Analytics License ($440 profit).',
    hints: [
      'Compute `(unit_price - unit_cost) AS unit_profit` in the `SELECT` list.',
      'Sort by `unit_profit DESC`.',
    ],
    explanation:
      'Derived columns in `SELECT` allow immediate unit-economics calculations directly inside SQL before data ever leaves the database engine.',
    sqlDatabaseId: 'ecommerce',
    starterCode: `SELECT product_id, product_name, category, unit_price, (unit_price - unit_cost) AS unit_profit
FROM products
-- Add ORDER BY below:
`,
    solutionCode: `SELECT product_id, product_name, category, unit_price, (unit_price - unit_cost) AS unit_profit
FROM products
ORDER BY unit_profit DESC;`,
    expectedColumns: ['product_id', 'product_name', 'category', 'unit_price', 'unit_profit'],
    expectedRowCount: 6,
    expectedFirstRowValues: [103, 'Enterprise Analytics License', 'Software', 490, 440],
    requiredSqlKeywords: ['SELECT', 'ORDER BY'],
  },
  {
    id: 'ex-sql-08',
    title: 'Safe Data Modification: Updating Churned Account Status (UPDATE & SELECT)',
    domainId: 'domain-3',
    topicId: 'd3-t2',
    subtopic: 'Safe DML Operations',
    type: 'sql',
    isCoding: true,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 65,
    objective: 'Perform a targeted UPDATE in an isolated SQLite sandbox and verify the modified records.',
    scenario:
      'Account `206` (Kinetix AI) just upgraded their Enterprise contract to $4,500 MRR. Update their `mrr_usd` to `4500` and then select all Enterprise accounts ordered by `mrr_usd DESC`.',
    instructions: [
      'In the `saas_metrics` database, run `UPDATE accounts SET mrr_usd = 4500 WHERE account_id = 206;`.',
      "Follow it with `SELECT account_id, company_name, mrr_usd FROM accounts WHERE plan_tier = 'Enterprise' ORDER BY mrr_usd DESC;`.",
      'remember you can reset the database to its clean state anytime with the Reset Database button.',
    ],
    evaluationCriteria:
      'Must execute UPDATE and return the 3 Enterprise accounts with Kinetix AI updated to 4500 MRR in second place.',
    hints: [
      'Always include a specific `WHERE account_id = 206` in your `UPDATE` statement so you do not overwrite every row.',
      'Place the `SELECT` statement after the `UPDATE` statement separated by a semicolon `;`.',
    ],
    explanation:
      'Practicing `UPDATE` with a strict primary-key `WHERE` clause and verifying via `SELECT` builds safe operational database habits.',
    sqlDatabaseId: 'saas_metrics',
    starterCode: `-- Step 1: Update account_id 206 to mrr_usd = 4500
UPDATE accounts SET mrr_usd = 4500 WHERE account_id = 206;

-- Step 2: Verify Enterprise accounts ordered by mrr_usd DESC
SELECT account_id, company_name, mrr_usd
FROM accounts
WHERE plan_tier = 'Enterprise'
ORDER BY mrr_usd DESC;`,
    solutionCode: `UPDATE accounts SET mrr_usd = 4500 WHERE account_id = 206;
SELECT account_id, company_name, mrr_usd
FROM accounts
WHERE plan_tier = 'Enterprise'
ORDER BY mrr_usd DESC;`,
    expectedColumns: ['account_id', 'company_name', 'mrr_usd'],
    expectedRowCount: 3,
    expectedFirstRowValues: [204, 'OmniHealth', 5600],
    requiredSqlKeywords: ['UPDATE', 'SET', 'WHERE'],
  },

  // ============================================================================
  // 2. PYTHON PRACTICE WORKSPACE EXERCISES (5 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-py-01',
    title: 'Revenue List Filtering & Summary Function (Core Python)',
    domainId: 'domain-5',
    topicId: 'd5-t1',
    subtopic: 'Lists, Loops & Functions',
    type: 'python',
    isCoding: true,
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 50,
    objective: 'Write a Python function to filter enterprise transactions above $1,000 and compute their total and mean.',
    scenario:
      'You receive a raw list of daily deal sizes. You need to filter out deals below $1,000 and print the count, total, and average of qualifying enterprise deals.',
    instructions: [
      'Given `deals = [450, 1200, 800, 2500, 1500, 300, 1800]`, filter for deals `>= 1000`.',
      'Print `Qualifying Count: 4`, `Total Revenue: 7000`, and `Average Deal: 1750.0`.',
    ],
    evaluationCriteria:
      'Python stdout must include Qualifying Count: 4, Total Revenue: 7000, and Average Deal: 1750.0.',
    hints: [
      'Use a list comprehension: `enterprise = [d for d in deals if d >= 1000]`.',
      'Compute `sum(enterprise)` and `sum(enterprise) / len(enterprise)`.',
    ],
    explanation:
      'List comprehensions provide a concise, readable way to filter numeric sequences before applying built-in aggregations like `sum()` and `len()`.',
    starterCode: `deals = [450, 1200, 800, 2500, 1500, 300, 1800]

# Filter for deals >= 1000
enterprise = [d for d in deals if d >= 1000]

print("Qualifying Count:", len(enterprise))
print("Total Revenue:", sum(enterprise))
print("Average Deal:", round(sum(enterprise) / len(enterprise), 1))
`,
    solutionCode: `deals = [450, 1200, 800, 2500, 1500, 300, 1800]
enterprise = [d for d in deals if d >= 1000]
print("Qualifying Count:", len(enterprise))
print("Total Revenue:", sum(enterprise))
print("Average Deal:", round(sum(enterprise) / len(enterprise), 1))`,
    expectedStdoutContains: ['Qualifying Count: 4', 'Total Revenue: 7000', 'Average Deal: 1750.0'],
  },
  {
    id: 'ex-py-02',
    title: 'NumPy Statistical Profiling on Order Values',
    domainId: 'domain-5',
    topicId: 'd5-t2',
    subtopic: 'NumPy Array Operations',
    type: 'python',
    isCoding: true,
    difficulty: 'beginner',
    estimatedMinutes: 10,
    xpReward: 55,
    objective: 'Use the preloaded NumPy (`np`) helper to compute mean, median, standard deviation, and IQR.',
    scenario:
      'Analyze latency measurements (in ms) from an analytics API endpoint using `np.mean`, `np.median`, `np.std`, and `np.percentile`.',
    instructions: [
      'Use `latencies = [110, 125, 130, 140, 145, 150, 160, 290]`.',
      'Print `Mean:`, `Median:`, and `Q3:` using `np.mean(latencies)`, `np.median(latencies)`, and `np.percentile(latencies, 75)`.',
    ],
    evaluationCriteria:
      'Code must call np.mean and np.median and output Mean: 156.25 and Median: 142.5.',
    hints: [
      '`np` is preloaded in the Python workspace.',
      'Notice how the outlier `290` pulls the mean (`156.25`) noticeably above the median (`142.5`).',
    ],
    explanation:
      'Comparing `np.mean()` and `np.median()` in Python immediately reveals right-skewness caused by high-latency tail outliers.',
    starterCode: `latencies = [110, 125, 130, 140, 145, 150, 160, 290]

print("Mean:", np.mean(latencies))
print("Median:", np.median(latencies))
print("Q3:", np.percentile(latencies, 75))
`,
    solutionCode: `latencies = [110, 125, 130, 140, 145, 150, 160, 290]
print("Mean:", np.mean(latencies))
print("Median:", np.median(latencies))
print("Q3:", np.percentile(latencies, 75))`,
    expectedStdoutContains: ['Mean: 156.25', 'Median: 142.5'],
    requiredPythonTokens: ['np.mean', 'np.median'],
  },
  {
    id: 'ex-py-03',
    title: 'DataFrame GroupBy & Regional Revenue Aggregation',
    domainId: 'domain-5',
    topicId: 'd5-t3',
    subtopic: 'DataFrame Filtering & GroupBy',
    type: 'python',
    isCoding: true,
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 65,
    objective: 'Load the preloaded `orders_data` into a `DataFrame` and aggregate total revenue by region.',
    scenario:
      'Using the preloaded `orders_data` dataset, construct a `DataFrame`, group by `region`, and compute the sum of `revenue`.',
    instructions: [
      'Initialize `df = DataFrame(orders_data)`.',
      "Call `regional = df.groupby_agg('region', 'revenue', 'sum')`.",
      'Print `regional` to inspect total revenue per region.',
    ],
    evaluationCriteria:
      'Output must show the grouped regional revenue table including North America (3230.0) and Europe (1940.0).',
    hints: [
      '`orders_data` and `DataFrame` are preloaded in the workspace environment.',
      "Call `print(df.groupby_agg('region', 'revenue', 'sum'))`.",
    ],
    explanation:
      'Grouping tabular data by a categorical dimension (`region`) and aggregating a numeric measure (`revenue`) is the foundational pattern of programmatic data analysis.',
    starterCode: `df = DataFrame(orders_data)
print("Dataset Shape:", df.shape)

# Group by 'region' and sum 'revenue'
regional = df.groupby_agg('region', 'revenue', 'sum')
print(regional)
`,
    solutionCode: `df = DataFrame(orders_data)
print("Dataset Shape:", df.shape)
regional = df.groupby_agg('region', 'revenue', 'sum')
print(regional)`,
    expectedStdoutContains: ['North America', '3230.0', 'Europe', '1940.0'],
    requiredPythonTokens: ['DataFrame', 'groupby_agg'],
  },
  {
    id: 'ex-py-04',
    title: 'Data Cleaning: Handling Missing Values & Duplicates',
    domainId: 'domain-6',
    topicId: 'd6-t2',
    subtopic: 'Missing Value Imputation',
    type: 'python',
    isCoding: true,
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 65,
    objective: 'Clean a raw list of customer satisfaction scores containing None/invalid entries and impute with the median.',
    scenario:
      'Survey ingestion produced missing (`None`) values in a numeric list. Clean the valid scores, compute the median of valid scores, and replace `None` values with that median.',
    instructions: [
      'Given `raw_scores = [78, 85, None, 92, 70, None, 88]`, extract valid numbers into `valid`.',
      'Compute `med = np.median(valid)`.',
      'Create `imputed = [med if x is None else x for x in raw_scores]` and print both `Median:` and `Imputed Mean:`.',
    ],
    evaluationCriteria:
      'Output must contain Median: 85 and Imputed Mean: 83.29.',
    hints: [
      'Filter valid scores with `[x for x in raw_scores if x is not None]`.',
      'Round the mean of `imputed` to 2 decimal places using `round(np.mean(imputed), 2)`.',
    ],
    explanation:
      'Imputing missing values with the median preserves sample size without distorting central tendency when distributions are skewed.',
    starterCode: `raw_scores = [78, 85, None, 92, 70, None, 88]

valid = [x for x in raw_scores if x is not None]
med = np.median(valid)
imputed = [med if x is None else x for x in raw_scores]

print("Median:", med)
print("Imputed Mean:", round(np.mean(imputed), 2))
`,
    solutionCode: `raw_scores = [78, 85, None, 92, 70, None, 88]
valid = [x for x in raw_scores if x is not None]
med = np.median(valid)
imputed = [med if x is None else x for x in raw_scores]
print("Median:", med)
print("Imputed Mean:", round(np.mean(imputed), 2))`,
    expectedStdoutContains: ['Median: 85', 'Imputed Mean: 83.29'],
  },
  {
    id: 'ex-py-05',
    title: 'Cohort Retention & Net Margin Calculation in Python',
    domainId: 'domain-5',
    topicId: 'd5-t5',
    subtopic: 'Analytical Feature Engineering',
    type: 'python',
    isCoding: true,
    difficulty: 'advanced',
    estimatedMinutes: 15,
    xpReward: 80,
    objective: 'Compute profit margin percentages across `orders_data` records and identify the highest-margin category.',
    scenario:
      'Calculate the overall profit margin percentage (`total_profit / total_revenue * 100`) across all orders in `orders_data` and print the rounded result.',
    instructions: [
      'Load `df = DataFrame(orders_data)`.',
      "Sum `df.col('revenue')` and `df.col('profit')`.",
      'Compute `margin_pct = round((total_profit / total_revenue) * 100, 2)` and print `Overall Profit Margin %: <value>`.',
    ],
    evaluationCriteria:
      'Must compute total revenue (6280.0), total profit (2059.0), and print Overall Profit Margin %: 32.79.',
    hints: [
      "Use `sum(df.col('revenue'))` and `sum(df.col('profit'))`.",
      'Divide total profit by total revenue, multiply by 100, and round to 2 decimal places.',
    ],
    explanation:
      'Calculating weighted portfolio margin (`SUM(profit) / SUM(revenue)`) avoids the common analytical mistake of averaging unweighted row-level percentages.',
    starterCode: `df = DataFrame(orders_data)

total_rev = sum(df.col('revenue'))
total_prof = sum(df.col('profit'))
margin_pct = round((total_prof / total_rev) * 100, 2)

print("Total Revenue:", total_rev)
print("Total Profit:", total_prof)
print("Overall Profit Margin %:", margin_pct)
`,
    solutionCode: `df = DataFrame(orders_data)
total_rev = sum(df.col('revenue'))
total_prof = sum(df.col('profit'))
margin_pct = round((total_prof / total_rev) * 100, 2)
print("Total Revenue:", total_rev)
print("Total Profit:", total_prof)
print("Overall Profit Margin %:", margin_pct)`,
    expectedStdoutContains: ['Total Revenue: 6280.0', 'Total Profit: 2059.0', 'Overall Profit Margin %: 32.79'],
  },

  // ============================================================================
  // 3. EXCEL & SPREADSHEET PRACTICE EXERCISES (5 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-sheet-01',
    title: 'Quarterly Revenue Totals & Average (SUM & AVERAGE)',
    domainId: 'domain-2',
    topicId: 'd2-t1',
    subtopic: 'Core Aggregation Formulas',
    type: 'spreadsheet',
    isCoding: false,
    difficulty: 'beginner',
    estimatedMinutes: 6,
    xpReward: 45,
    objective: 'Use SUM to calculate total regional revenue in cell B6.',
    scenario:
      'You are preparing a regional sales summary sheet. Cells `B2:B5` contain Q1 revenue by region. Write a formula in cell `B6` to compute the total revenue across all four regions.',
    instructions: [
      'Select cell `B6` in the spreadsheet grid.',
      'Enter `=SUM(B2:B5)` in the formula bar and press Enter or Apply.',
      'Verify that cell `B6` evaluates to `54500` and click Submit Answer.',
    ],
    evaluationCriteria:
      'Cell B6 must use the SUM function and evaluate to 54500.',
    hints: [
      'Click on cell `B6` and type `=SUM(B2:B5)`.',
      'Always start spreadsheet formulas with an equals sign `=`.',
    ],
    explanation:
      '`=SUM(B2:B5)` dynamically adds all numeric values in the contiguous range `B2` through `B5`, automatically recalculating if any regional figure changes.',
    initialGrid: {
      A1: 'Region',
      B1: 'Q1 Revenue ($)',
      C1: 'Target ($)',
      A2: 'North America',
      B2: 21500,
      C2: 20000,
      A3: 'Europe',
      B3: 16200,
      C3: 15000,
      A4: 'Asia Pacific',
      B4: 11400,
      C4: 12000,
      A5: 'Latin America',
      B5: 5400,
      C5: 5000,
      A6: 'Total Revenue',
      B6: '',
      A7: 'Average Revenue',
      B7: '=AVERAGE(B2:B5)',
    },
    targetCell: 'B6',
    expectedCellValue: 54500,
    requiredFormulaFunction: 'SUM',
  },
  {
    id: 'ex-sheet-02',
    title: 'Quota Attainment Status Classification (IF Function)',
    domainId: 'domain-2',
    topicId: 'd2-t2',
    subtopic: 'Logical Functions (IF)',
    type: 'spreadsheet',
    isCoding: false,
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 50,
    objective: 'Write an IF formula in cell D4 to classify whether Asia Pacific met its revenue target.',
    scenario:
      'Sales Operations tracks whether each region achieved its quarterly target (`B >= C`). In cell `D4`, write an `=IF(...)` formula that returns `"Met"` if `B4 >= C4`, and `"Missed"` otherwise.',
    instructions: [
      'Select cell `D4` (Asia Pacific Status).',
      'Enter `=IF(B4>=C4, "Met", "Missed")`.',
      'Verify that cell `D4` evaluates to `Missed` (since 11,400 < 12,000) and submit.',
    ],
    evaluationCriteria:
      'Cell D4 must use IF and evaluate to "Missed".',
    hints: [
      'Syntax: `=IF(logical_test, value_if_true, value_if_false)`.',
      'Use `=IF(B4>=C4, "Met", "Missed")` in cell `D4`.',
    ],
    explanation:
      'The `IF` function evaluates a boolean comparison (`B4>=C4`) and branches to the second argument when true or the third argument when false.',
    initialGrid: {
      A1: 'Region',
      B1: 'Actual ($)',
      C1: 'Target ($)',
      D1: 'Status',
      A2: 'North America',
      B2: 21500,
      C2: 20000,
      D2: '=IF(B2>=C2, "Met", "Missed")',
      A3: 'Europe',
      B3: 16200,
      C3: 15000,
      D3: '=IF(B3>=C3, "Met", "Missed")',
      A4: 'Asia Pacific',
      B4: 11400,
      C4: 12000,
      D4: '',
      A5: 'Latin America',
      B5: 5400,
      C5: 5000,
      D5: '=IF(B5>=C5, "Met", "Missed")',
    },
    targetCell: 'D4',
    expectedCellValue: 'Missed',
    requiredFormulaFunction: 'IF',
  },
  {
    id: 'ex-sheet-03',
    title: 'Conditional Spend Aggregation by Channel (SUMIF)',
    domainId: 'domain-2',
    topicId: 'd2-t2',
    subtopic: 'Conditional Aggregation (SUMIF / COUNTIF)',
    type: 'spreadsheet',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 60,
    objective: 'Use SUMIF in cell E2 to calculate total revenue generated by Enterprise tier deals.',
    scenario:
      'You have a transaction table where Column B lists the Segment (`Enterprise`, `SMB`) and Column C lists Deal Revenue. Calculate the total revenue strictly from `"Enterprise"` deals in cell `E2`.',
    instructions: [
      'Select cell `E2`.',
      'Write `=SUMIF(B2:B6, "Enterprise", C2:C6)`.',
      'Confirm that `E2` evaluates to `11900` and click Submit Answer.',
    ],
    evaluationCriteria:
      'Cell E2 must use SUMIF and evaluate to 11900.',
    hints: [
      '`SUMIF(range, criteria, sum_range)` checks `B2:B6` for `"Enterprise"` and sums the corresponding cells in `C2:C6`.',
      'Type `=SUMIF(B2:B6, "Enterprise", C2:C6)` into cell `E2`.',
    ],
    explanation:
      '`SUMIF` performs single-criterion conditional aggregation without requiring manual sorting or row filtering.',
    initialGrid: {
      A1: 'Deal ID',
      B1: 'Segment',
      C1: 'Revenue ($)',
      D1: 'Summary Metric',
      E1: 'Value',
      A2: 'D-101',
      B2: 'Enterprise',
      C2: 4200,
      D2: 'Enterprise Revenue',
      E2: '',
      A3: 'D-102',
      B3: 'SMB',
      C3: 1500,
      D3: 'Enterprise Deal Count',
      E3: '=COUNTIF(B2:B6, "Enterprise")',
      A4: 'D-103',
      B4: 'Enterprise',
      C4: 3800,
      A5: 'D-104',
      B5: 'SMB',
      C5: 950,
      A6: 'D-105',
      B6: 'Enterprise',
      C6: 3900,
    },
    targetCell: 'E2',
    expectedCellValue: 11900,
    requiredFormulaFunction: 'SUMIF',
  },
  {
    id: 'ex-sheet-04',
    title: 'Product Price Lookup Automation (XLOOKUP / VLOOKUP)',
    domainId: 'domain-2',
    topicId: 'd2-t3',
    subtopic: 'Lookup Functions (XLOOKUP & VLOOKUP)',
    type: 'spreadsheet',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 65,
    objective: 'Use XLOOKUP (or VLOOKUP) in cell E3 to retrieve the unit price for SKU-103.',
    scenario:
      'An invoice template needs to look up the unit price for the SKU entered in cell `E2` (`"SKU-103"`) from the product catalog in `A2:C5`.',
    instructions: [
      'Select cell `E3`.',
      'Enter `=XLOOKUP(E2, A2:A5, C2:C5)` (or `=VLOOKUP(E2, A2:C5, 3, FALSE)`).',
      'Verify that cell `E3` returns `490` and submit.',
    ],
    evaluationCriteria:
      'Cell E3 must use XLOOKUP or VLOOKUP and evaluate to 490.',
    hints: [
      'With `XLOOKUP`, pass `(lookup_value, lookup_array, return_array)`: `=XLOOKUP(E2, A2:A5, C2:C5)`.',
      'With `VLOOKUP`, pass `(lookup_value, table_array, col_index_num, FALSE)`: `=VLOOKUP(E2, A2:C5, 3, FALSE)`.',
    ],
    explanation:
      '`XLOOKUP` decouples the lookup column (`A2:A5`) from the return column (`C2:C5`), preventing broken column indices when tables are restructured.',
    initialGrid: {
      A1: 'SKU',
      B1: 'Product Name',
      C1: 'Unit Price ($)',
      D1: 'Lookup Field',
      E1: 'Result',
      A2: 'SKU-101',
      B2: 'Pro Docking Station',
      C2: 240,
      D2: 'Target SKU',
      E2: 'SKU-103',
      A3: 'SKU-102',
      B3: 'Ergonomic Chair',
      C3: 520,
      D3: 'Looked Up Price',
      E3: '',
      A4: 'SKU-103',
      B4: 'Analytics License',
      C4: 490,
      A5: 'SKU-104',
      B5: '4K Monitor',
      C5: 680,
    },
    targetCell: 'E3',
    expectedCellValue: 490,
  },
  {
    id: 'ex-sheet-05',
    title: 'Gross Margin Percentage Calculation & Rounding',
    domainId: 'domain-2',
    topicId: 'd2-t5',
    subtopic: 'Financial & Margin Formulas',
    type: 'spreadsheet',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 60,
    objective: 'Compute rounded Gross Margin % in cell D2 using arithmetic and ROUND.',
    scenario:
      'Given Revenue in `B2` ($2,500) and COGS in `C2` ($1,625), compute Gross Margin Percentage `((B2 - C2) / B2) * 100` in cell `D2`.',
    instructions: [
      'Select cell `D2`.',
      'Enter `=((B2-C2)/B2)*100` or `=ROUND(((B2-C2)/B2)*100, 1)`.',
      'Verify that `D2` evaluates to `35` (representing 35%) and submit.',
    ],
    evaluationCriteria:
      'Cell D2 must be a formula evaluating to 35.',
    hints: [
      'Wrap `(B2-C2)` in parentheses before dividing by `B2`: `=((B2-C2)/B2)*100`.',
    ],
    explanation:
      'Gross Margin % is defined as `(Revenue - COGS) / Revenue * 100`. Parentheses ensure subtraction happens before division.',
    initialGrid: {
      A1: 'Product Line',
      B1: 'Revenue ($)',
      C1: 'COGS ($)',
      D1: 'Gross Margin %',
      A2: 'Cloud Platform',
      B2: 2500,
      C2: 1625,
      D2: '',
      A3: 'Managed Services',
      B3: 1800,
      C3: 1260,
      D3: '=((B3-C3)/B3)*100',
    },
    targetCell: 'D2',
    expectedCellValue: 35,
  },

  // ============================================================================
  // 4. STATISTICS PRACTICE EXERCISES (4 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-stats-01',
    title: 'Outlier Sensitivity: Sample Median vs Mean',
    domainId: 'domain-4',
    topicId: 'd4-t1',
    subtopic: 'Measures of Central Tendency',
    type: 'statistics',
    isCoding: false,
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 50,
    objective: 'Calculate the sample median of a right-skewed B2B deal dataset and understand why it resists outliers.',
    scenario:
      'A SaaS sales team closed 7 deals this week (in $K): `[12, 15, 18, 22, 25, 28, 190]`. Because of the single $190K enterprise whale deal, the sample mean is pulled up to $44.29K. What is the exact sample **median** (in $K) of these 7 deals?',
    instructions: [
      'Inspect the sorted 7-element sample: `[12, 15, 18, 22, 25, 28, 190]`.',
      'Use the interactive Statistical Calculator or compute the middle position `(n + 1) / 2` for `n = 7`.',
      'Enter the numeric median value below.',
    ],
    evaluationCriteria:
      'Numeric answer must equal 22.',
    hints: [
      'For an odd sample size `n = 7`, the median is the 4th value in sorted order.',
      'Look at index 4 (1-based) of `[12, 15, 18, 22, 25, 28, 190]`.',
    ],
    explanation:
      'In a sorted sample of 7 observations `[12, 15, 18, 22, 25, 28, 190]`, the 4th observation is `22`. Unlike the mean (`44.29`), the median (`22`) is robust to the extreme `$190K` outlier.',
    datasetContext: [
      { deal_id: 1, value_k: 12 },
      { deal_id: 2, value_k: 15 },
      { deal_id: 3, value_k: 18 },
      { deal_id: 4, value_k: 22 },
      { deal_id: 5, value_k: 25 },
      { deal_id: 6, value_k: 28 },
      { deal_id: 7, value_k: 190 },
    ],
    inputMode: 'numeric_input',
    expectedNumericAnswer: 22,
    numericTolerance: 0.01,
    stepByStepDerivation: [
      'Step 1: Sort the observations in ascending order: [12, 15, 18, 22, 25, 28, 190].',
      'Step 2: Count sample size n = 7 (odd).',
      'Step 3: Identify middle rank = (7 + 1) / 2 = 4th observation.',
      'Step 4: Read the 4th value → Median = 22 ($22K). Compare with Mean = 310 / 7 = 44.29 ($44.29K).',
    ],
  },
  {
    id: 'ex-stats-02',
    title: 'Interquartile Range (IQR) & Tukey Outlier Fence Calculation',
    domainId: 'domain-4',
    topicId: 'd4-t2',
    subtopic: 'Spread, Percentiles & IQR',
    type: 'statistics',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 60,
    objective: 'Compute the Interquartile Range (IQR = Q3 - Q1) for page load times.',
    scenario:
      'You are auditing 9 daily p95 page-load measurements (in ms): `[200, 220, 240, 260, 280, 300, 320, 340, 600]`. For this sample, `Q1 (25th percentile) = 240` and `Q3 (75th percentile) = 320`. Calculate the **Interquartile Range (IQR)**.',
    instructions: [
      'Use the formula `IQR = Q3 - Q1`.',
      'Also note how the upper Tukey fence `Q3 + 1.5 * IQR` flags `600 ms` as an anomaly.',
      'Enter the numeric IQR value below.',
    ],
    evaluationCriteria:
      'Numeric answer must equal 80.',
    hints: [
      '`IQR = Q3 - Q1 = 320 - 240`.',
    ],
    explanation:
      '`IQR = Q3 - Q1 = 320 - 240 = 80 ms`. The upper outlier fence is `320 + 1.5(80) = 440 ms`, which proves that the `600 ms` spike is a statistical outlier.',
    datasetContext: [
      { day: 1, load_ms: 200 },
      { day: 2, load_ms: 220 },
      { day: 3, load_ms: 240 },
      { day: 4, load_ms: 260 },
      { day: 5, load_ms: 280 },
      { day: 6, load_ms: 300 },
      { day: 7, load_ms: 320 },
      { day: 8, load_ms: 340 },
      { day: 9, load_ms: 600 },
    ],
    inputMode: 'numeric_input',
    expectedNumericAnswer: 80,
    numericTolerance: 0.1,
    stepByStepDerivation: [
      'Step 1: Locate Q1 (25th percentile) = 240 ms and Q3 (75th percentile) = 320 ms.',
      'Step 2: Compute IQR = Q3 - Q1 = 320 - 240 = 80 ms.',
      'Step 3: Compute Upper Outlier Fence = Q3 + 1.5 × IQR = 320 + 120 = 440 ms.',
    ],
  },
  {
    id: 'ex-stats-03',
    title: 'Z-Score Standardization for Anomaly Detection',
    domainId: 'domain-4',
    topicId: 'd4-t3',
    subtopic: 'Normal Distribution & Z-Scores',
    type: 'statistics',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 65,
    objective: 'Calculate the Z-score of a daily order volume spike given the mean and standard deviation.',
    scenario:
      'Daily checkout volume at an e-commerce store has a historical mean of `μ = 500` orders and a standard deviation of `σ = 50` orders. On Black Friday warm-up day, checkout volume reaches `x = 625` orders. What is the **Z-score** for `x = 625`?',
    instructions: [
      'Apply the standardization formula: `Z = (x - μ) / σ`.',
      'Substitute `x = 625`, `μ = 500`, and `σ = 50`.',
      'Enter the exact Z-score (to 1 decimal place).',
    ],
    evaluationCriteria:
      'Numeric answer must equal 2.5.',
    hints: [
      'Compute `(625 - 500) / 50`.',
    ],
    explanation:
      '`Z = (625 - 500) / 50 = 125 / 50 = 2.5`. This means 625 orders is 2.5 standard deviations above the historical mean.',
    inputMode: 'numeric_input',
    expectedNumericAnswer: 2.5,
    numericTolerance: 0.02,
    stepByStepDerivation: [
      'Step 1: Recall Z-score formula: Z = (x - μ) / σ.',
      'Step 2: Calculate deviation from mean: x - μ = 625 - 500 = 125.',
      'Step 3: Divide by standard deviation σ = 50: Z = 125 / 50 = 2.5.',
    ],
  },
  {
    id: 'ex-stats-04',
    title: 'A/B Test Hypothesis Testing & p-Value Interpretation',
    domainId: 'domain-4',
    topicId: 'd4-t4',
    subtopic: 'Hypothesis Testing & Confidence Intervals',
    type: 'statistics',
    isCoding: false,
    difficulty: 'advanced',
    estimatedMinutes: 12,
    xpReward: 75,
    objective: 'Interpret a two-sample A/B experiment result using p-values, alpha thresholds, and confidence intervals.',
    scenario:
      'Growth Engineering ran a checkout redesign A/B test (`n = 5,000` per variant) with significance threshold `α = 0.05`. Control converted at `4.2%` and Treatment converted at `4.9%`. The two-sample test yields `t = 2.41`, `p = 0.016`, and a 95% confidence interval for the lift of `[+0.13%, +1.27%]`. Which statistical decision and interpretation is valid?',
    instructions: [
      'Compare `p = 0.016` against the significance level `α = 0.05`.',
      'Check whether `0%` lies inside the 95% confidence interval `[+0.13%, +1.27%]`.',
      'Select the rigorous analytical conclusion below.',
    ],
    evaluationCriteria:
      'Must select Option 2: Reject the null hypothesis because p = 0.016 < 0.05 and the 95% CI excludes zero.',
    hints: [
      'When `p < α` (0.016 < 0.05), we reject the null hypothesis `H₀` of zero difference.',
      'Note that a p-value of 0.016 does NOT mean there is a 1.6% chance the null hypothesis is true; it is the probability of observing a difference at least this extreme assuming `H₀` is true.',
    ],
    explanation:
      'Because `p = 0.016 < 0.05` and the 95% confidence interval `[+0.13%, +1.27%]` lies entirely above zero, we reject the null hypothesis `H₀` and conclude the checkout redesign produced a statistically significant positive lift.',
    inputMode: 'multiple_choice',
    options: [
      'Fail to reject the null hypothesis because a 0.7% absolute lift is less than 5%.',
      'Reject the null hypothesis (H₀) at α = 0.05 because p = 0.016 < 0.05 and the 95% CI [+0.13%, +1.27%] excludes 0.',
      'Accept that there is an exact 98.4% probability that the treatment will always convert at 4.9% in every future quarter.',
      'Run the test until p = 0.000 by peeking every hour and stopping as soon as conversion spikes.',
    ],
    correctOptionIndex: 1,
    stepByStepDerivation: [
      'Step 1: State H₀: μ_treatment - μ_control = 0 vs H₁: μ_treatment - μ_control ≠ 0.',
      'Step 2: Compare p-value (0.016) to significance level α (0.05). Since 0.016 < 0.05, reject H₀.',
      'Step 3: Verify via the 95% Confidence Interval [+0.13%, +1.27%]: since 0% is excluded, the lift is statistically significant.',
    ],
  },

  // ============================================================================
  // 5. DATA VISUALISATION PRACTICE EXERCISES (3 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-viz-01',
    title: 'Interactive Chart Builder: Monthly Revenue Trend Encoding',
    domainId: 'domain-7',
    topicId: 'd7-t1',
    subtopic: 'Chart Selection & Visual Encoding',
    type: 'visualization',
    isCoding: false,
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 50,
    objective: 'Configure an interactive visualization using real time-series data to reveal monthly revenue trends.',
    scenario:
      'You are building an executive revenue chart from monthly performance records (`month`, `revenue_usd`, `active_accounts`). Configure the Chart Builder to display continuous temporal trend progression accurately.',
    instructions: [
      'In the Interactive Chart Builder, select `Line Chart` (`line`) as the chart type to show continuous progression over time.',
      'Set the X-Axis dimension to `month` and the Y-Axis metric to `revenue_usd`.',
      'Inspect the rendered chart and click Submit Chart Configuration.',
    ],
    evaluationCriteria:
      'Chart type must be line (or area), X-axis must be month, and Y-axis must be revenue_usd.',
    hints: [
      'Continuous time-series trends are best encoded with a **Line Chart** (`line`) with time (`month`) on the horizontal X-axis.',
    ],
    explanation:
      'Line charts connect ordered temporal points with slopes that directly encode rate of change (`ΔRevenue / ΔMonth`), making acceleration and seasonal dips immediately visible.',
    datasetContext: [
      { month: '2025-01', revenue_usd: 42000, active_accounts: 110, churn_rate: 2.1 },
      { month: '2025-02', revenue_usd: 46500, active_accounts: 118, churn_rate: 1.9 },
      { month: '2025-03', revenue_usd: 51200, active_accounts: 129, churn_rate: 1.8 },
      { month: '2025-04', revenue_usd: 49800, active_accounts: 127, churn_rate: 2.3 },
      { month: '2025-05', revenue_usd: 58400, active_accounts: 142, churn_rate: 1.6 },
      { month: '2025-06', revenue_usd: 64900, active_accounts: 156, churn_rate: 1.5 },
    ],
    inputMode: 'chart_builder',
    recommendedChartType: 'line',
    recommendedXKey: 'month',
    recommendedYKey: 'revenue_usd',
  },
  {
    id: 'ex-viz-02',
    title: 'Identifying Misleading Visualisations: Truncated Bar Chart Baseline',
    domainId: 'domain-7',
    topicId: 'd7-t5',
    subtopic: 'Visual Integrity & Misleading Charts',
    type: 'visualization',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    xpReward: 55,
    objective: 'Diagnose why a bar chart with a truncated Y-axis distorts visual perception of data magnitude.',
    scenario:
      'A presentation slide displays a vertical **Bar Chart** comparing Q1 Retention (`94%`) vs Q2 Retention (`96%`). However, the vertical Y-axis starts at `93%` instead of `0%`, making the Q2 bar look **three times taller** than the Q1 bar. What is the visual flaw and how should it be corrected?',
    instructions: [
      'Analyze how human perception reads bar charts (by comparing bar length/area relative to a zero baseline).',
      'Select the principle that restores visual integrity.',
    ],
    evaluationCriteria:
      'Must select Option 1: Bar charts encode magnitude via length from a zero baseline; truncating the Y-axis to 93% exaggerates a 2% difference into a 300% visual ratio.',
    hints: [
      'Bar charts rely on length-from-zero encoding. When the baseline is non-zero, the ratio of bar heights no longer equals the ratio of values.',
    ],
    explanation:
      'Bar charts encode values using length relative to a zero baseline (`0%`). Starting the Y-axis at `93%` turns a modest relative improvement (`94% → 96%`) into a deceptive `3:1` bar height ratio. Bar charts must always start at zero.',
    inputMode: 'multiple_choice',
    options: [
      'Bar charts encode magnitude through bar length from a zero baseline; starting the Y-axis at 93% distorts a 2 percentage-point gain into a 3x visual height difference. Always start bar chart Y-axes at 0.',
      'Convert the two retention percentages into a 3D exploding pie chart so the angles look larger.',
      'Remove all axis labels and gridlines so viewers cannot notice the 93% starting value.',
      'Use dual Y-axes with different scales for Q1 and Q2 so both bars appear the same height.',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'ex-viz-03',
    title: 'Interactive Chart Builder: Categorical Channel Comparison',
    domainId: 'domain-7',
    topicId: 'd7-t2',
    subtopic: 'Categorical Comparisons',
    type: 'visualization',
    isCoding: false,
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 50,
    objective: 'Build a bar chart comparing attributed revenue across 5 marketing acquisition channels.',
    scenario:
      'The CMO wants to compare `revenue_usd` across discrete marketing `channel` categories (`Paid Search`, `LinkedIn Ads`, `Email Nurture`, `Webinars`, `Organic SEO`). Configure the optimal chart in the Chart Builder.',
    instructions: [
      'Select `Bar Chart` (`bar`) to compare discrete categorical channels.',
      'Map `channel` to the X-Axis and `revenue_usd` to the Y-Axis.',
      'Review the rendered chart and submit.',
    ],
    evaluationCriteria:
      'Chart type must be bar, X-axis must be channel, and Y-axis must be revenue_usd.',
    hints: [
      'Discrete categories (`channel`) are best compared using aligned bar lengths in a **Bar Chart** (`bar`).',
    ],
    explanation:
      'Bar charts align categories along a common zero baseline, enabling rapid rank-ordering and magnitude comparison across non-temporal groups.',
    datasetContext: [
      { channel: 'LinkedIn Ads', revenue_usd: 66240, conversions: 138 },
      { channel: 'Organic SEO', revenue_usd: 61800, conversions: 412 },
      { channel: 'Webinars', revenue_usd: 56880, conversions: 158 },
      { channel: 'Paid Search', revenue_usd: 53280, conversions: 296 },
      { channel: 'Email Nurture', revenue_usd: 41520, conversions: 346 },
    ],
    inputMode: 'chart_builder',
    recommendedChartType: 'bar',
    recommendedXKey: 'channel',
    recommendedYKey: 'revenue_usd',
  },

  // ============================================================================
  // 6. BUSINESS ANALYTICS & KPI PRACTICE EXERCISES (3 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-biz-01',
    title: 'SaaS Net Revenue Retention (NRR) & Expansion Economics',
    domainId: 'domain-11',
    topicId: 'd11-t1',
    subtopic: 'Retention & SaaS Unit Economics',
    type: 'business_kpi',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 65,
    objective: 'Calculate Net Revenue Retention (NRR %) for a B2B SaaS cohort.',
    scenario:
      'A B2B SaaS cohort starts Q1 with `$200,000` in Starting MRR. During Q1, existing customers in that cohort upgrade for `+$35,000` Expansion MRR, downgrade for `-$5,000` Contraction MRR, and churn for `-$10,000` Churned MRR. What is the cohort **Net Revenue Retention (NRR %)**?',
    instructions: [
      'Use the standard SaaS NRR formula: `NRR % = ((Starting MRR + Expansion - Contraction - Churn) / Starting MRR) * 100`.',
      'Compute Ending Cohort MRR and divide by `$200,000`.',
      'Enter the numeric percentage (e.g., `110` for 110%).',
    ],
    evaluationCriteria:
      'Numeric answer must equal 110.',
    hints: [
      'Ending MRR from the cohort = `200,000 + 35,000 - 5,000 - 10,000 = 220,000`.',
      '`NRR % = (220,000 / 200,000) * 100 = 110%`.',
    ],
    explanation:
      'Ending Cohort MRR is `$200,000 + $35,000 - $5,000 - $10,000 = $220,000`. Dividing by `$200,000` gives `110%` NRR, proving the existing customer base grows by 10% organically even before adding new logos.',
    datasetContext: [
      { metric: 'Starting MRR', amount_usd: 200000 },
      { metric: 'Expansion MRR (+)', amount_usd: 35000 },
      { metric: 'Contraction MRR (-)', amount_usd: 5000 },
      { metric: 'Churned MRR (-)', amount_usd: 10000 },
    ],
    inputMode: 'numeric_input',
    expectedNumericAnswer: 110,
    numericTolerance: 0.1,
    stepByStepDerivation: [
      'Step 1: Ending Cohort MRR = Starting ($200k) + Expansion ($35k) - Contraction ($5k) - Churn ($10k) = $220,000.',
      'Step 2: NRR = ($220,000 / $200,000) × 100 = 110%.',
    ],
  },
  {
    id: 'ex-biz-02',
    title: 'Marketing Attribution: LTV:CAC Ratio & Payback Diagnosis',
    domainId: 'domain-11',
    topicId: 'd11-t2',
    subtopic: 'Marketing Funnel & Acquisition KPIs',
    type: 'business_kpi',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 65,
    objective: 'Evaluate acquisition channel efficiency using Customer Acquisition Cost (CAC) and LTV:CAC ratio.',
    scenario:
      'Your growth team spent `$45,000` on LinkedIn Ads last month and acquired `30` new customers (`CAC = $1,500`). Each customer pays `$500/month` with an `80%` gross margin (`$400` monthly gross contribution) and stays for an average of `15 months` (`LTV = $6,000`). What is the **LTV:CAC ratio** for this channel?',
    instructions: [
      'Confirm `CAC = $45,000 / 30 = $1,500`.',
      'Confirm Gross Margin `LTV = $500 * 0.80 * 15 = $6,000`.',
      'Compute `LTV / CAC` and enter the numeric ratio below.',
    ],
    evaluationCriteria:
      'Numeric answer must equal 4.',
    hints: [
      'Divide `LTV ($6,000)` by `CAC ($1,500)`.',
    ],
    explanation:
      'With `CAC = $1,500` and gross-margin-adjusted `LTV = $6,000`, the `LTV:CAC` ratio is `6000 / 1500 = 4.0x` (with a 3.75-month CAC payback period), exceeding the standard 3.0x benchmark for healthy capital allocation.',
    datasetContext: [
      { channel: 'LinkedIn Ads', ad_spend: 45000, new_customers: 30, cac_usd: 1500, ltv_usd: 6000 },
    ],
    inputMode: 'numeric_input',
    expectedNumericAnswer: 4,
    numericTolerance: 0.05,
    stepByStepDerivation: [
      'Step 1: CAC = Total Spend / New Customers = $45,000 / 30 = $1,500.',
      'Step 2: Gross Margin LTV = Monthly ARPU ($500) × Gross Margin (0.80) × Lifespan (15 mos) = $6,000.',
      'Step 3: LTV:CAC Ratio = $6,000 / $1,500 = 4.0.',
    ],
  },
  {
    id: 'ex-biz-03',
    title: 'Executive Recommendation: Revenue Up, Net Profit Down',
    domainId: 'domain-11',
    topicId: 'd11-t3',
    subtopic: 'Root-Cause Commercial Diagnostics',
    type: 'business_kpi',
    isCoding: false,
    difficulty: 'advanced',
    estimatedMinutes: 12,
    xpReward: 75,
    objective: 'Diagnose why top-line revenue grew +18% while net contribution margin dropped -14%.',
    scenario:
      'In Q2, an e-commerce retailer ran a site-wide promotional campaign. Top-line GMV grew `+18%`, order count grew `+24%`, but Net Contribution Profit fell `-14%`. Segment telemetry shows that orders using Promo Code `FLASH25` surged 300%, carried a `-4%` net margin after free expedited shipping, and had a `91%` one-time-buyer churn rate. What is the strongest analytical recommendation?',
    instructions: [
      'Examine the unit economics of promo vs non-promo cohorts.',
      'Select the structured, metric-backed executive recommendation.',
    ],
    evaluationCriteria:
      'Must select Option 1: Cap discount stacking and require a minimum order value (MOV) threshold for free expedited shipping.',
    hints: [
      'Top-line revenue is a vanity metric when marginal orders have negative contribution margin (`-4%`) and low repeat retention.',
    ],
    explanation:
      'Unconstrained `FLASH25` discounting combined with subsidized expedited shipping created negative unit economics (`-4%` contribution margin) on low-retention buyers. Enforcing a Minimum Order Value (MOV) threshold for free shipping and restricting `FLASH25` to high-margin categories restores positive contribution per order.',
    inputMode: 'multiple_choice',
    options: [
      'Restructure promotional guardrails: enforce a Minimum Order Value (MOV) for free shipping and restrict 25% discounts to categories with >45% gross margin to eliminate negative (-4%) unit-margin orders.',
      'Double the ad budget for FLASH25 immediately since order volume grew +24%.',
      'Increase product prices across all non-discounted enterprise customers by 30% to subsidize negative-margin flash sales.',
      'Stop tracking shipping costs in the profit calculation so net margin appears positive on executive dashboards.',
    ],
    correctOptionIndex: 0,
  },

  // ============================================================================
  // 7. DATASET INVESTIGATION EXERCISES (2 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-inv-01',
    title: 'Dataset Hygiene Investigation: Missing-Not-At-Random (MNAR) Bias',
    domainId: 'domain-6',
    topicId: 'd6-t2',
    subtopic: 'Missing Data Diagnostics',
    type: 'dataset_investigation',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 60,
    objective: 'Investigate a customer survey dataset and diagnose why dropping missing rows biases the NPS score.',
    scenario:
      'You inspect a 10-row SaaS telemetry sample where `nps_score` is missing (`NULL`) for 3 accounts. Cross-checking the `churned` and `support_tickets_30d` columns reveals that all 3 accounts with missing NPS scores had `>8 support tickets` and `churned = true`. If you simply drop rows with missing `nps_score` before reporting average NPS, what happens?',
    instructions: [
      'Examine the relationship between missingness in `nps_score` and account health (`churned`).',
      'Identify the statistical distortion caused by listwise deletion (`dropna`).',
    ],
    evaluationCriteria:
      'Must select Option 2: Dropping missing rows introduces upward survivorship/non-response bias because dissatisfied churned accounts are systematically excluded.',
    hints: [
      'When unhappy customers refuse to fill out NPS surveys, the missing values are Missing Not At Random (MNAR).',
    ],
    explanation:
      'Because the missing NPS values occur exclusively among high-ticket churned accounts, the data is Missing Not At Random (MNAR). Dropping those rows artificially inflates the reported average NPS by excluding the most dissatisfied customers.',
    datasetContext: [
      { account: 'ACC-01', support_tickets: 1, nps_score: 70, churned: 'false' },
      { account: 'ACC-02', support_tickets: 9, nps_score: 'NULL', churned: 'true' },
      { account: 'ACC-03', support_tickets: 2, nps_score: 65, churned: 'false' },
      { account: 'ACC-04', support_tickets: 11, nps_score: 'NULL', churned: 'true' },
      { account: 'ACC-05', support_tickets: 10, nps_score: 'NULL', churned: 'true' },
    ],
    inputMode: 'multiple_choice',
    options: [
      'Dropping the missing rows makes the average NPS more accurate because NULL values are always random keyboard typos.',
      'Dropping the missing rows introduces severe upward non-response bias (MNAR), artificially inflating reported NPS by excluding dissatisfied churned accounts.',
      'Replacing NULL with +100 is the standard conservative imputation method.',
      'Missing values in a single column invalidate all other columns like support_tickets.',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'ex-inv-02',
    title: 'Exploratory Data Analysis: Detecting Duplicate Ingestion Inflation',
    domainId: 'domain-6',
    topicId: 'd6-t1',
    subtopic: 'Deduplication & Primary Key Integrity',
    type: 'dataset_investigation',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 60,
    objective: 'Calculate true deduplicated revenue when webhook retries create duplicate order_id rows.',
    scenario:
      'During an EDA audit of the `orders` staging table below, you notice that `ORD-502` ($1,200) was ingested **twice** with identical timestamps due to a payment webhook retry. What is the **true deduplicated total revenue** across unique `order_id`s?',
    instructions: [
      'Inspect the 5 rows in the dataset preview below.',
      'Identify the duplicate `order_id` (`ORD-502` appears twice at `$1,200`).',
      'Sum the revenue across unique `order_id` records only and enter the numeric total.',
    ],
    evaluationCriteria:
      'Numeric answer must equal 3100.',
    hints: [
      'Raw sum is `800 + 1200 + 1200 + 450 + 650 = 4300`.',
      'Subtract the duplicate `1200` row for `ORD-502`: `4300 - 1200 = 3100`.',
    ],
    explanation:
      'Deduplicating on the primary business key (`order_id`) removes the repeated `ORD-502` ($1,200) retry record, correcting total revenue from `$4,300` down to the true `$3,100`.',
    datasetContext: [
      { row_num: 1, order_id: 'ORD-501', customer: 'Apex Corp', revenue: 800 },
      { row_num: 2, order_id: 'ORD-502', customer: 'Vertex IO', revenue: 1200 },
      { row_num: 3, order_id: 'ORD-502', customer: 'Vertex IO', revenue: 1200 },
      { row_num: 4, order_id: 'ORD-503', customer: 'Nova Labs', revenue: 450 },
      { row_num: 5, order_id: 'ORD-504', customer: 'Solaris', revenue: 650 },
    ],
    inputMode: 'numeric_input',
    expectedNumericAnswer: 3100,
    numericTolerance: 0.1,
    stepByStepDerivation: [
      'Step 1: Group by unique order_id: ORD-501 ($800), ORD-502 ($1,200), ORD-503 ($450), ORD-504 ($650).',
      'Step 2: Sum unique order values: 800 + 1200 + 450 + 650 = $3,100.',
    ],
  },

  // ============================================================================
  // 8. ANALYTICAL REASONING EXERCISES (2 Progressive Exercises)
  // ============================================================================
  {
    id: 'ex-reason-01',
    title: "Simpson's Paradox in Segmented Conversion Funnel Analysis",
    domainId: 'domain-1',
    topicId: 'd1-t4',
    subtopic: 'Confounding Variables & Aggregation Bias',
    type: 'analytical_reasoning',
    isCoding: false,
    difficulty: 'advanced',
    estimatedMinutes: 12,
    xpReward: 75,
    objective: "Resolve Simpson's Paradox when aggregate conversion drops despite rising conversion in every device segment.",
    scenario:
      'Between Month 1 and Month 2, your website conversion rate improved on **Desktop** (`5.0% → 5.5%`) AND improved on **Mobile** (`2.0% → 2.3%`). Yet the **overall blended conversion rate dropped** from `4.1%` to `3.2%`. How is this mathematically possible, and what is the correct analytical conclusion?',
    instructions: [
      'Examine how traffic mix (`Desktop` vs `Mobile` share of total visitors) weights the blended average.',
      'Select the explanation that accurately diagnoses the paradox.',
    ],
    evaluationCriteria:
      "Must select Option 1: Traffic mix shifted heavily toward Mobile (which has a lower baseline conversion rate), pulling down the blended average despite both segments improving (Simpson's Paradox).",
    hints: [
      'If Mobile traffic grows from 30% of visitors to 75% of visitors, the blended rate shifts toward Mobile’s ~2.3% rate even though both Desktop and Mobile improved individually.',
    ],
    explanation:
      "This is a classic instance of **Simpson's Paradox**. A large traffic-mix shift toward Mobile (which converts at a lower base rate than Desktop) lowers the unweighted blended average even when every underlying device segment improved.",
    datasetContext: [
      { period: 'Month 1', desktop_conv: '5.0%', mobile_conv: '2.0%', mobile_traffic_share: '30%', blended_conv: '4.1%' },
      { period: 'Month 2', desktop_conv: '5.5%', mobile_conv: '2.3%', mobile_traffic_share: '72%', blended_conv: '3.2%' },
    ],
    inputMode: 'multiple_choice',
    options: [
      "Simpson's Paradox: A major traffic-mix shift toward Mobile (from 30% to 72% of sessions) weighted the blended average toward Mobile's lower base rate, masking the fact that both Desktop and Mobile product experiences improved.",
      'The analytics tracking pixel broke on Desktop and Mobile simultaneously.',
      'Product changes degraded both Desktop and Mobile conversion, so the engineering deployment must be rolled back immediately.',
      'Percentages cannot be compared across months unless sample sizes are identical to the exact visitor.',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'ex-reason-02',
    title: 'Survivorship Bias & Correlation vs Causation in Feature Adoption',
    domainId: 'domain-1',
    topicId: 'd1-t3',
    subtopic: 'Causal Inference & Selection Bias',
    type: 'analytical_reasoning',
    isCoding: false,
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 65,
    objective: 'Identify selection bias and reverse causality in product telemetry.',
    scenario:
      'A product analyst notices that users who configure a `"Custom API Webhook"` have a `94%` 12-month retention rate, compared to `52%` for users who do not. The PM proposes forcing every new user to set up an API Webhook on Day 1 during onboarding before they can view the home dashboard. What is the critical flaw in this reasoning?',
    instructions: [
      'Distinguish between a behavioral proxy of existing power users (selection effect) and a causal driver for novice users.',
      'Select the strongest analytical critique.',
    ],
    evaluationCriteria:
      'Must select Option 2: Self-selection confounding — advanced enterprise teams with high technical commitment adopt webhooks; forcing novices through complex API setup on Day 1 will increase onboarding drop-off.',
    hints: [
      'Ask: Does configuring a webhook *cause* a casual user to become an enterprise power user, or do already-committed technical teams naturally configure webhooks?',
    ],
    explanation:
      'Observational correlation between an advanced feature and retention is heavily confounded by **user intent and technical maturity** (self-selection bias). Forcing novice users through an API webhook wall on Day 1 adds severe onboarding friction rather than transferring enterprise intent.',
    inputMode: 'multiple_choice',
    options: [
      'Correlation above 90% always proves 100% direct causation in product analytics.',
      'Self-selection confounding: highly committed technical teams naturally configure webhooks. Forcing Day-1 novices through a complex API setup wall will cause onboarding drop-off rather than replicate enterprise retention.',
      'Retention rates cannot be measured over a 12-month window.',
      'API webhooks should be deleted from the product since only power users use them.',
    ],
    correctOptionIndex: 1,
  },
];

export interface ExerciseGraderInput {
  sqlResult?: SQLQueryResult;
  sqlCode?: string;
  pythonResult?: PythonExecutionResult;
  pythonCode?: string;
  spreadsheetGridEval?: Record<string, CellEvalResult>;
  spreadsheetRawGrid?: Record<string, string | number>;
  selectedOptionIndex?: number;
  numericInput?: string | number;
  chartConfig?: {
    chartType: string;
    xKey: string;
    yKey: string;
  };
}

export interface ExerciseGradeResult {
  isCorrect: boolean;
  feedback: string;
  submittedSummary: string;
  expectedSummary: string;
  errorCategory: ErrorCategory;
}

export function evaluatePracticeExercise(
  exercise: PracticeExercise,
  input: ExerciseGraderInput
): ExerciseGradeResult {
  // 1. SQL Exercise Evaluation
  if (exercise.type === 'sql') {
    const code = (input.sqlCode || '').trim();
    const res = input.sqlResult;
    if (!res) {
      return {
        isCorrect: false,
        feedback: 'Please run your SQL query first before submitting for validation.',
        submittedSummary: code || '(Empty query)',
        expectedSummary: exercise.solutionCode || '',
        errorCategory: 'SQL Query & Syntax',
      };
    }

    if (!res.success) {
      return {
        isCorrect: false,
        feedback: `SQL execution error: ${res.error}${res.errorHint ? ` — ${res.errorHint}` : ''}`,
        submittedSummary: code,
        expectedSummary: exercise.solutionCode || '',
        errorCategory: 'SQL Query & Syntax',
      };
    }

    // Check required SQL keywords
    if (exercise.requiredSqlKeywords) {
      const upperCode = code.toUpperCase();
      for (const kw of exercise.requiredSqlKeywords) {
        if (!upperCode.includes(kw.toUpperCase())) {
          return {
            isCorrect: false,
            feedback: `Your query executed, but it did not use the required SQL clause/keyword "${kw}". Check the instructions and try again.`,
            submittedSummary: code,
            expectedSummary: exercise.solutionCode || '',
            errorCategory: 'SQL Query & Syntax',
          };
        }
      }
    }

    if (
      exercise.expectedRowCount !== undefined &&
      res.rowCount !== exercise.expectedRowCount
    ) {
      return {
        isCorrect: false,
        feedback: `Row count mismatch: your query returned ${res.rowCount} row(s), but ${exercise.expectedRowCount} row(s) were expected.`,
        submittedSummary: `${code} [Returned ${res.rowCount} rows]`,
        expectedSummary: `${exercise.solutionCode} [Expected ${exercise.expectedRowCount} rows]`,
        errorCategory: 'SQL Query & Syntax',
      };
    }

    if (exercise.expectedFirstRowValues && res.rows.length > 0) {
      const firstRow = res.rows[0];
      for (let i = 0; i < exercise.expectedFirstRowValues.length; i++) {
        const expectedVal = exercise.expectedFirstRowValues[i];
        const actualVal = firstRow[i];
        if (String(actualVal).toLowerCase() !== String(expectedVal).toLowerCase()) {
          return {
            isCorrect: false,
            feedback: `First row value mismatch at column "${res.columns[i] || i}": found "${actualVal}", expected "${expectedVal}". Check your filtering or ORDER BY direction.`,
            submittedSummary: code,
            expectedSummary: exercise.solutionCode || '',
            errorCategory: 'SQL Query & Syntax',
          };
        }
      }
    }

    return {
      isCorrect: true,
      feedback: `Spot on! Your SQL query returned the exact ${res.rowCount} expected rows and columns.`,
      submittedSummary: code,
      expectedSummary: exercise.solutionCode || '',
      errorCategory: 'SQL Query & Syntax',
    };
  }

  // 2. Python Exercise Evaluation
  if (exercise.type === 'python') {
    const code = (input.pythonCode || '').trim();
    const res = input.pythonResult;
    if (!res) {
      return {
        isCorrect: false,
        feedback: 'Please click "Run Python" to execute your script before submitting.',
        submittedSummary: code || '(Empty script)',
        expectedSummary: exercise.solutionCode || '',
        errorCategory: 'Python Logic & Runtime',
      };
    }

    if (!res.success) {
      return {
        isCorrect: false,
        feedback: `Python runtime error: ${res.error}${res.errorHint ? ` — ${res.errorHint}` : ''}`,
        submittedSummary: code,
        expectedSummary: exercise.solutionCode || '',
        errorCategory: 'Python Logic & Runtime',
      };
    }

    if (exercise.requiredPythonTokens) {
      for (const tok of exercise.requiredPythonTokens) {
        if (!code.includes(tok)) {
          return {
            isCorrect: false,
            feedback: `Your script ran, but it must use \`${tok}\` as specified in the exercise instructions.`,
            submittedSummary: code,
            expectedSummary: exercise.solutionCode || '',
            errorCategory: 'Python Logic & Runtime',
          };
        }
      }
    }

    if (exercise.expectedStdoutContains) {
      const out = res.stdout;
      for (const expectedFragment of exercise.expectedStdoutContains) {
        if (!out.includes(expectedFragment)) {
          return {
            isCorrect: false,
            feedback: `Output mismatch: expected stdout to contain "${expectedFragment}", but got:\n${out || '(no output)'}`,
            submittedSummary: out.trim() || code,
            expectedSummary: exercise.expectedStdoutContains.join(' | '),
            errorCategory: 'Python Logic & Runtime',
          };
        }
      }
    }

    return {
      isCorrect: true,
      feedback: 'Excellent Python execution! Your script produced the exact analytical output.',
      submittedSummary: code,
      expectedSummary: exercise.solutionCode || '',
      errorCategory: 'Python Logic & Runtime',
    };
  }

  // 3. Spreadsheet Exercise Evaluation
  if (exercise.type === 'spreadsheet') {
    const target = exercise.targetCell || 'B6';
    const cellEval = input.spreadsheetGridEval?.[target];
    const rawFormula = String(input.spreadsheetRawGrid?.[target] ?? '').trim();

    if (!cellEval || rawFormula === '') {
      return {
        isCorrect: false,
        feedback: `Target cell ${target} is empty. Enter a formula starting with "=" in cell ${target}.`,
        submittedSummary: `${target}: (empty)`,
        expectedSummary: `Formula in ${target} evaluating to ${exercise.expectedCellValue}`,
        errorCategory: 'Spreadsheet Formula',
      };
    }

    if (cellEval.errorCode) {
      return {
        isCorrect: false,
        feedback: `Formula error ${cellEval.errorCode} in cell ${target}: ${cellEval.errorHint}`,
        submittedSummary: `${target}: ${rawFormula} (${cellEval.errorCode})`,
        expectedSummary: `Formula in ${target} evaluating to ${exercise.expectedCellValue}`,
        errorCategory: 'Spreadsheet Formula',
      };
    }

    if (!rawFormula.startsWith('=')) {
      return {
        isCorrect: false,
        feedback: `Cell ${target} contains a hardcoded value ("${rawFormula}") instead of a dynamic spreadsheet formula starting with "=".`,
        submittedSummary: `${target}: ${rawFormula}`,
        expectedSummary: `Formula in ${target} evaluating to ${exercise.expectedCellValue}`,
        errorCategory: 'Spreadsheet Formula',
      };
    }

    if (
      exercise.requiredFormulaFunction &&
      !rawFormula.toUpperCase().includes(exercise.requiredFormulaFunction.toUpperCase())
    ) {
      return {
        isCorrect: false,
        feedback: `Your formula in ${target} should use the ${exercise.requiredFormulaFunction} function.`,
        submittedSummary: `${target}: ${rawFormula}`,
        expectedSummary: `=${exercise.requiredFormulaFunction}(...) -> ${exercise.expectedCellValue}`,
        errorCategory: 'Spreadsheet Formula',
      };
    }

    const actual = cellEval.value;
    const expected = exercise.expectedCellValue;
    const matches =
      typeof expected === 'number' && typeof actual === 'number'
        ? Math.abs(actual - expected) <= 0.05
        : String(actual).toLowerCase() === String(expected).toLowerCase();

    if (!matches) {
      return {
        isCorrect: false,
        feedback: `Cell ${target} evaluated to "${actual}", but expected "${expected}". Check your cell range references.`,
        submittedSummary: `${target}: ${rawFormula} -> ${actual}`,
        expectedSummary: `${target} -> ${expected}`,
        errorCategory: 'Spreadsheet Formula',
      };
    }

    return {
      isCorrect: true,
      feedback: `Great job! Formula ${rawFormula} in cell ${target} evaluated to ${actual}.`,
      submittedSummary: `${target}: ${rawFormula} -> ${actual}`,
      expectedSummary: `${target} -> ${expected}`,
      errorCategory: 'Spreadsheet Formula',
    };
  }

  // 4. Interactive Chart Builder Evaluation
  if (exercise.inputMode === 'chart_builder') {
    const cfg = input.chartConfig;
    if (!cfg) {
      return {
        isCorrect: false,
        feedback: 'Please configure the chart type, X-axis, and Y-axis before submitting.',
        submittedSummary: 'No chart config',
        expectedSummary: `${exercise.recommendedChartType} (${exercise.recommendedXKey} vs ${exercise.recommendedYKey})`,
        errorCategory: 'Chart & Visual Encoding',
      };
    }

    const typeMatch =
      cfg.chartType === exercise.recommendedChartType ||
      (exercise.recommendedChartType === 'line' && cfg.chartType === 'area');
    const xMatch = cfg.xKey === exercise.recommendedXKey;
    const yMatch = cfg.yKey === exercise.recommendedYKey;

    if (!typeMatch || !xMatch || !yMatch) {
      return {
        isCorrect: false,
        feedback: `Visual encoding mismatch: you selected a ${cfg.chartType.toUpperCase()} chart with X="${cfg.xKey}" and Y="${cfg.yKey}". Recommended encoding for this analytical goal is a ${exercise.recommendedChartType?.toUpperCase()} chart with X="${exercise.recommendedXKey}" and Y="${exercise.recommendedYKey}".`,
        submittedSummary: `${cfg.chartType} (X: ${cfg.xKey}, Y: ${cfg.yKey})`,
        expectedSummary: `${exercise.recommendedChartType} (X: ${exercise.recommendedXKey}, Y: ${exercise.recommendedYKey})`,
        errorCategory: 'Chart & Visual Encoding',
      };
    }

    return {
      isCorrect: true,
      feedback: `Accurate visual encoding! Mapping X="${cfg.xKey}" and Y="${cfg.yKey}" to a ${cfg.chartType} chart clearly communicates the underlying pattern.`,
      submittedSummary: `${cfg.chartType} (X: ${cfg.xKey}, Y: ${cfg.yKey})`,
      expectedSummary: `${exercise.recommendedChartType} (X: ${exercise.recommendedXKey}, Y: ${exercise.recommendedYKey})`,
      errorCategory: 'Chart & Visual Encoding',
    };
  }

  // 5. Numeric Input Evaluation (Statistics / Business KPI / Dataset Investigation)
  if (exercise.inputMode === 'numeric_input') {
    const rawStr = String(input.numericInput ?? '').replace(/[,$%]/g, '').trim();
    const numVal = Number(rawStr);
    const expected = exercise.expectedNumericAnswer ?? 0;
    const tol = exercise.numericTolerance ?? 0.05;

    const category: ErrorCategory =
      exercise.type === 'statistics'
        ? 'Statistical Calculation'
        : exercise.type === 'business_kpi'
        ? 'Business KPI Reasoning'
        : 'Conceptual Misconception';

    if (rawStr === '' || Number.isNaN(numVal)) {
      return {
        isCorrect: false,
        feedback: 'Please enter a valid numeric value.',
        submittedSummary: String(input.numericInput ?? '(empty)'),
        expectedSummary: String(expected),
        errorCategory: category,
      };
    }

    if (Math.abs(numVal - expected) > tol) {
      return {
        isCorrect: false,
        feedback: `Your value (${numVal}) differs from the expected calculation (${expected}). Review the formula and step-by-step derivation.`,
        submittedSummary: String(numVal),
        expectedSummary: String(expected),
        errorCategory: category,
      };
    }

    return {
      isCorrect: true,
      feedback: `Correct! ${numVal} matches the exact analytical calculation (${expected}).`,
      submittedSummary: String(numVal),
      expectedSummary: String(expected),
      errorCategory: category,
    };
  }

  // 6. Multiple Choice Evaluation
  const idx = input.selectedOptionIndex;
  const correctIdx = exercise.correctOptionIndex ?? 0;
  const options = exercise.options || [];
  const category: ErrorCategory =
    exercise.type === 'visualization'
      ? 'Chart & Visual Encoding'
      : exercise.type === 'statistics'
      ? 'Statistical Calculation'
      : exercise.type === 'business_kpi'
      ? 'Business KPI Reasoning'
      : 'Conceptual Misconception';

  if (idx === undefined || idx === null || idx < 0) {
    return {
      isCorrect: false,
      feedback: 'Please select an answer option before submitting.',
      submittedSummary: '(No option selected)',
      expectedSummary: options[correctIdx] || '',
      errorCategory: category,
    };
  }

  if (idx !== correctIdx) {
    return {
      isCorrect: false,
      feedback: `Not quite. Review the analytical explanation below to see why option ${correctIdx + 1} is the strongest choice.`,
      submittedSummary: options[idx] || `Option ${idx + 1}`,
      expectedSummary: options[correctIdx] || `Option ${correctIdx + 1}`,
      errorCategory: category,
    };
  }

  return {
    isCorrect: true,
    feedback: 'Correct analytical reasoning!',
    submittedSummary: options[idx] || `Option ${idx + 1}`,
    expectedSummary: options[correctIdx] || `Option ${correctIdx + 1}`,
    errorCategory: category,
  };
}
