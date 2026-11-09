import { Lesson } from '../types/lesson';

export const LESSONS_DATABASE: Lesson[] = [
  {
    id: 'lesson-sql-intro',
    topicId: 'd2-t1',
    domainId: 'domain-2',
    title: 'Relational Database Architecture & Keys',
    order: 1,
    difficulty: 'beginner',
    durationMinutes: 20,
    xpReward: 35,
    overview: 'Understand how relational database systems store data in structured tables linked by primary and foreign keys.',
    conceptMarkdown: `### The Essence of Relational Storage

A **Relational Database Management System (RDBMS)** organizes data into two-dimensional tables (called *relations*) consisting of rows (tuples/records) and columns (attributes/fields).

Unlike flat files or spreadsheets, relational databases enforce **referential integrity**:
1. **Primary Key (PK):** A unique, non-null identifier for every single record in a table (e.g. \`customer_id\`).
2. **Foreign Key (FK):** A column in one table referencing the Primary Key of another table, creating an explicit entity relationship.

\`\`\`
customers (table)
┌─────────────────┬──────────────────┬──────────────┐
│ customer_id(PK) │ name             │ signup_date  │
├─────────────────┼──────────────────┼──────────────┤
│ 101             │ Maya Lin         │ 2026-01-14   │
└─────────────────┴──────────────────┴──────────────┘
         ▲
         │ (1-to-many relationship)
         ▼
orders (table)
┌──────────────┬──────────────────┬───────────────┐
│ order_id(PK) │ customer_id(FK)  │ amount        │
├──────────────┼──────────────────┼───────────────┤
│ 5001         │ 101              │ $140.00       │
│ 5002         │ 101              │ $85.50        │
└──────────────┴──────────────────┴───────────────┘
\`\`\`

#### Entity Cardinalities
- **1-to-1 (1:1):** User profile to User settings.
- **1-to-Many (1:N):** One customer places many orders.
- **Many-to-Many (N:M):** Students enrolled in courses (resolved through an intermediate associative bridge table).`,
    keyTakeaways: [
      'Primary Keys uniquely identify rows and cannot contain NULL values.',
      'Foreign Keys enforce referential integrity between tables.',
      'Associative junction tables resolve Many-to-Many relationships.',
      'Relational normalisation reduces redundancy and prevents update anomalies.',
    ],
    codeExample: {
      language: 'sql',
      code: `CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  order_date DATE NOT NULL,
  total_amount NUMERIC(10, 2) CHECK (total_amount >= 0)
);`,
      explanation: 'The orders table defines customer_id as a Foreign Key with an explicit REFERENCES constraint.',
    },
    practicalExercise: {
      title: 'Define Table Integrity',
      prompt: 'Write an SQL statement to query all orders where customer_id is 101 and order_date is after 2026-01-01.',
      language: 'sql',
      starterCode: `SELECT * FROM orders\nWHERE customer_id = 101;\n`,
      expectedOutputKeyword: 'order_date',
      solutionCode: `SELECT * FROM orders\nWHERE customer_id = 101\n  AND order_date > '2026-01-01';`,
      hints: [
        'Use the AND logical operator to combine filtering predicates.',
        'Wrap date literals in single quotes, e.g. \'2026-01-01\'.',
      ],
    },
    quiz: [
      {
        id: 'q-d2-t1-1',
        question: 'What happens if you attempt to insert an order record with a customer_id that does not exist in the customers table?',
        options: [
          'The database automatically creates a new customer row with null values.',
          'The database raises a foreign key constraint violation error and rejects the insert.',
          'The order is accepted and stored in a temporary holding queue.',
          'The customer_id column is converted to zero silently.',
        ],
        correctIndex: 1,
        explanation: 'Foreign key constraints enforce referential integrity; the database strictly refuses orphan records.',
        conceptKey: 'Foreign Key Constraint Integrity',
      },
      {
        id: 'q-d2-t1-2',
        question: 'Which of the following can validly be placed in a Primary Key column?',
        options: [
          'Duplicate values if the timestamp differs.',
          'NULL values during initial data ingestion.',
          'Unique, non-null values only.',
          'Any string value regardless of uniqueness.',
        ],
        correctIndex: 2,
        explanation: 'Primary keys must be both strictly unique and non-null for all records.',
        conceptKey: 'Primary Key Uniqueness',
      },
    ],
    revisionTopicId: 'd2-t1',
    revisionReason: 'Review database relational constraints and foreign key mechanics.',
  },
  {
    id: 'lesson-sql-filtering',
    topicId: 'd2-t2',
    domainId: 'domain-2',
    title: 'SQL Filtering, Conditional CASE & Handling NULLs',
    order: 2,
    difficulty: 'beginner',
    durationMinutes: 25,
    xpReward: 40,
    overview: 'Learn precise data extraction using WHERE predicates, CASE WHEN branching, and NULL-safe operators (COALESCE, NULLIF).',
    conceptMarkdown: `### Precision Filtering in SQL

SQL queries follow a strict **logical execution order** distinct from lexical syntax:
1. \`FROM\` & \`JOIN\` (identify data sources)
2. \`WHERE\` (filter raw rows)
3. \`GROUP BY\` (aggregate groups)
4. \`HAVING\` (filter aggregated metrics)
5. \`SELECT\` (project columns & evaluate CASE statements)
6. \`DISTINCT\` (deduplicate)
7. \`ORDER BY\` (sort result set)
8. \`LIMIT\` (paginate)

#### The Three-Valued Logic of NULL
In SQL, \`NULL\` represents missing or unknown information. Therefore:
- \`column = NULL\` will **never** evaluate to TRUE. It evaluates to \`UNKNOWN\`.
- Always use \`IS NULL\` or \`IS NOT NULL\`.

#### Handling NULLs with COALESCE
\`COALESCE(val1, val2, ...)\` returns the first non-null expression in its argument list:
\`\`\`sql
SELECT COALESCE(phone_number, 'No Phone Provided') AS contact_phone
FROM customers;
\`\`\`

#### Conditional Branching with CASE
\`\`\`sql
SELECT customer_id, total_spend,
  CASE
    WHEN total_spend >= 5000 THEN 'VIP Tier'
    WHEN total_spend >= 1000 THEN 'Standard Tier'
    ELSE 'Prospect'
  END AS customer_segment
FROM customer_aggregates;
\`\`\``,
    keyTakeaways: [
      'WHERE executes before SELECT and GROUP BY; aliases defined in SELECT cannot be used in WHERE.',
      'Comparison with NULL using = or != always evaluates to UNKNOWN.',
      'COALESCE evaluates arguments sequentially and returns the first non-null value.',
      'CASE statements evaluate sequentially and stop at the first matching condition.',
    ],
    codeExample: {
      language: 'sql',
      code: `SELECT 
  employee_id,
  department,
  salary,
  COALESCE(bonus, 0) AS safe_bonus,
  salary + COALESCE(bonus, 0) AS total_compensation
FROM employees
WHERE termination_date IS NULL
  AND department IN ('Sales', 'Marketing')
ORDER BY total_compensation DESC;`,
      explanation: 'COALESCE ensures that adding salary and bonus does not produce NULL when bonus is missing.',
    },
    practicalExercise: {
      title: 'Categorize Customer Value',
      prompt: 'Write an SQL query to select all orders where total_amount is at least 100 and status is not "Cancelled". Replace NULL shipping dates with "Pending".',
      language: 'sql',
      starterCode: `SELECT order_id, total_amount, shipping_date\nFROM orders;\n`,
      expectedOutputKeyword: 'COALESCE',
      solutionCode: `SELECT \n  order_id,\n  total_amount,\n  COALESCE(shipping_date, 'Pending') AS shipping_status\nFROM orders\nWHERE total_amount >= 100\n  AND status <> 'Cancelled';`,
      hints: [
        'Use COALESCE(shipping_date, \'Pending\') to handle missing shipping dates.',
        'Use status != \'Cancelled\' or status <> \'Cancelled\'.',
      ],
    },
    quiz: [
      {
        id: 'q-d2-t2-1',
        question: 'Why does the expression WHERE discount_code = NULL fail to return records with missing discount codes?',
        options: [
          'Because discount_code is a reserved keyword in ANSI SQL.',
          'Because in SQL three-valued logic, comparison with NULL yields UNKNOWN, which evaluates as false in WHERE.',
          'Because the query must use the HAVING clause instead of WHERE.',
          'Because NULL can only be compared inside subqueries.',
        ],
        correctIndex: 1,
        explanation: 'SQL implements three-valued logic (TRUE, FALSE, UNKNOWN). Testing equality with NULL results in UNKNOWN. You must write "WHERE discount_code IS NULL".',
        conceptKey: 'Three-Valued Logic & NULL Comparisons',
      },
      {
        id: 'q-d2-t2-2',
        question: 'In which order does the database engine evaluate SQL clauses?',
        options: [
          'SELECT → FROM → WHERE → GROUP BY → HAVING',
          'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
          'FROM → SELECT → WHERE → ORDER BY → GROUP BY',
          'WHERE → FROM → SELECT → GROUP BY → HAVING',
        ],
        correctIndex: 1,
        explanation: 'SQL executes FROM/JOIN first, then WHERE filters raw rows, GROUP BY aggregates, HAVING filters groups, SELECT projects columns, and ORDER BY sorts.',
        conceptKey: 'SQL Logical Order of Execution',
      },
    ],
    revisionTopicId: 'd2-t2',
    revisionReason: 'Review SQL logical query execution order and NULL handling with COALESCE.',
  },
  {
    id: 'lesson-sql-joins',
    topicId: 'd2-t3',
    domainId: 'domain-2',
    title: 'Multi-Table Joins, Aggregations & HAVING',
    order: 3,
    difficulty: 'intermediate',
    durationMinutes: 30,
    xpReward: 50,
    overview: 'Master relational joins (INNER, LEFT, RIGHT, FULL) and combine multi-table datasets with GROUP BY and HAVING filters.',
    conceptMarkdown: `### Combining Relational Tables

Joins correlate records across tables based on common matching keys.

#### Join Mechanics
- **INNER JOIN:** Returns records with matching keys in **both** tables.
- **LEFT OUTER JOIN:** Returns all records from the left table, plus matched records from the right table (unmatched right attributes populate as NULL).
- **RIGHT OUTER JOIN:** Reverse of LEFT JOIN.
- **FULL OUTER JOIN:** Returns all records from both tables, filling with NULL wherever matches do not exist.

\`\`\`
Table A (Customers)        Table B (Orders)
┌────┬──────────────┐      ┌──────────┬────┬────────┐
│ id │ name         │      │ order_id │ id │ amount │
├────┼──────────────┤      ├──────────┼────┼────────┤
│ 1  │ Alice        │      │ 101      │ 1  │ $50    │
│ 2  │ Bob          │      │ 102      │ 1  │ $75    │
│ 3  │ Charlie      │      │ 103      │ 4  │ $90    │
└────┴──────────────┘      └──────────┴────┴────────┘

LEFT JOIN (A -> B on id):
Alice   -> $50, $75
Bob     -> NULL, NULL  (Retained!)
Charlie -> NULL, NULL  (Retained!)
(Record with customer 4 is excluded because 4 is not in Table A)
\`\`\`

#### WHERE vs. HAVING Filtering
- **WHERE:** Evaluates on individual row records *before* aggregation.
- **HAVING:** Evaluates on aggregated summary values *after* \`GROUP BY\`.

\`\`\`sql
SELECT c.name, COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.country = 'Germany'             -- Filter before group
GROUP BY c.id, c.name
HAVING COUNT(o.order_id) >= 5;          -- Filter after group
\`\`\``,
    keyTakeaways: [
      'LEFT JOIN is critical for finding zero-activity entities (e.g. customers with zero orders).',
      'Aggregate functions ignore NULL values except for COUNT(*).',
      'Every non-aggregated column in the SELECT list must appear in the GROUP BY clause.',
      'HAVING filters group summaries, whereas WHERE filters individual row instances.',
    ],
    codeExample: {
      language: 'sql',
      code: `SELECT 
  u.user_id,
  u.username,
  COUNT(o.order_id) AS total_orders,
  COALESCE(SUM(o.amount), 0) AS total_revenue
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.username
HAVING COUNT(o.order_id) = 0;`,
      explanation: 'Uses LEFT JOIN and HAVING COUNT(order_id) = 0 to identify inactive users who registered but never placed an order.',
    },
    practicalExercise: {
      title: 'Find Customers with High Order Volume',
      prompt: 'Write an SQL query to join customers and orders, grouping by customer name, returning only customers who placed at least 3 orders.',
      language: 'sql',
      starterCode: `SELECT c.customer_name, COUNT(o.order_id) AS order_count\nFROM customers c\nJOIN orders o ON c.id = o.customer_id;\n`,
      expectedOutputKeyword: 'HAVING',
      solutionCode: `SELECT c.customer_name, COUNT(o.order_id) AS order_count\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.customer_name\nHAVING COUNT(o.order_id) >= 3;`,
      hints: [
        'Add a GROUP BY clause with c.id, c.customer_name.',
        'Use HAVING COUNT(o.order_id) >= 3 to filter aggregated counts.',
      ],
    },
    quiz: [
      {
        id: 'q-d2-t3-1',
        question: 'Which query structure should you use to locate all customers who have never placed an order?',
        options: [
          'INNER JOIN on customer_id WHERE order_id IS NULL',
          'LEFT JOIN on customer_id WHERE orders.order_id IS NULL',
          'CROSS JOIN on customer_id HAVING COUNT(orders.order_id) > 0',
          'RIGHT JOIN on customer_id WHERE customers.id IS NOT NULL',
        ],
        correctIndex: 1,
        explanation: 'A LEFT JOIN keeps all customers. If a customer placed no orders, the joined order columns will be NULL. Thus, WHERE orders.order_id IS NULL isolates customers with zero orders.',
        conceptKey: 'Finding Missing Matches with LEFT JOIN',
      },
      {
        id: 'q-d2-t3-2',
        question: 'Can you use a column alias created in the SELECT clause directly inside a HAVING clause in standard SQL?',
        options: [
          'Yes, because HAVING executes after SELECT.',
          'No, in standard ANSI SQL, HAVING executes before SELECT, so column aliases are not yet available.',
          'Only if the alias is uppercase.',
          'Only when joining fewer than three tables.',
        ],
        correctIndex: 1,
        explanation: 'In ANSI SQL logical execution order, HAVING executes before SELECT. While some dialects (like MySQL) allow aliases in HAVING, standard SQL requires repeating the aggregate expression.',
        conceptKey: 'Logical Execution of HAVING vs SELECT',
      },
    ],
    revisionTopicId: 'd2-t3',
    revisionReason: 'Review multi-table outer join mechanics and the distinction between WHERE and HAVING.',
  },
  {
    id: 'lesson-sql-window',
    topicId: 'd2-t5',
    domainId: 'domain-2',
    title: 'Analytical Window Functions & Offset Mechanics',
    order: 4,
    difficulty: 'advanced',
    durationMinutes: 35,
    xpReward: 65,
    overview: 'Calculate running totals, customer rankings, and period-over-period growth without collapsing rows using OVER, PARTITION BY, and LAG/LEAD.',
    conceptMarkdown: `### The Power of Window Functions

Traditional \`GROUP BY\` collapses multiple rows into a single summary record. In contrast, **Window Functions** compute aggregate or ranking metrics across an associated partition of rows while **retaining individual row identities**.

#### Syntax Anatomy
\`\`\`sql
FUNCTION() OVER (
  PARTITION BY column_name      -- Logical partition / group
  ORDER BY sort_column          -- Sort order inside partition
  ROWS BETWEEN ... AND ...      -- Frame boundaries
)
\`\`\`

#### Essential Window Functions
1. **Ranking:**
   - \`ROW_NUMBER()\`: Unique integer (1, 2, 3, 4) regardless of ties.
   - \`RANK()\`: Tied ranks skip numbers (1, 2, 2, 4).
   - \`DENSE_RANK()\`: Tied ranks do not skip numbers (1, 2, 2, 3).
2. **Offset Analysis:**
   - \`LAG(col, n)\`: Accesses the value of \`col\` from \`n\` rows *prior* in the window. Ideal for month-over-month growth.
   - \`LEAD(col, n)\`: Accesses the value of \`col\` from \`n\` rows *ahead*.

#### Cumulative Running Totals
\`\`\`sql
SELECT 
  order_date,
  order_amount,
  SUM(order_amount) OVER (
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM daily_sales;
\`\`\``,
    keyTakeaways: [
      'Window functions execute during the SELECT step, after WHERE and HAVING.',
      'PARTITION BY defines sub-groups without collapsing the record set.',
      'DENSE_RANK() avoids rank gaps on tied values, whereas RANK() introduces gaps.',
      'LAG() is the industry standard pattern for computing period-over-period delta.',
    ],
    codeExample: {
      language: 'sql',
      code: `SELECT 
  sales_rep_id,
  order_month,
  monthly_revenue,
  LAG(monthly_revenue, 1) OVER (
    PARTITION BY sales_rep_id 
    ORDER BY order_month
  ) AS prev_month_revenue,
  monthly_revenue - LAG(monthly_revenue, 1) OVER (
    PARTITION BY sales_rep_id 
    ORDER BY order_month
  ) AS monthly_growth
FROM monthly_rep_sales;`,
      explanation: 'Uses LAG to compute period-over-period revenue growth partitioned by individual sales rep.',
    },
    practicalExercise: {
      title: 'Rank Orders per Customer',
      prompt: 'Write an SQL query using ROW_NUMBER() to rank orders per customer from most recent to oldest.',
      language: 'sql',
      starterCode: `SELECT customer_id, order_id, order_date\nFROM orders;\n`,
      expectedOutputKeyword: 'PARTITION BY',
      solutionCode: `SELECT \n  customer_id,\n  order_id,\n  order_date,\n  ROW_NUMBER() OVER (\n    PARTITION BY customer_id \n    ORDER BY order_date DESC\n  ) AS order_sequence\nFROM orders;`,
      hints: [
        'Use ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC).',
      ],
    },
    quiz: [
      {
        id: 'q-d2-t5-1',
        question: 'What is the key functional difference between RANK() and DENSE_RANK() when two rows tie for 2nd place?',
        options: [
          'RANK() assigns 2 to both and gives 3 to the next row; DENSE_RANK() gives 4 to the next row.',
          'RANK() assigns 2 to both and skips to 4 for the next row; DENSE_RANK() assigns 2 to both and assigns 3 to the next row.',
          'RANK() only works with dates; DENSE_RANK() only works with numeric currencies.',
          'There is no difference; they are synonymous aliases.',
        ],
        correctIndex: 1,
        explanation: 'RANK() skips rank numbers after a tie (1, 2, 2, 4), while DENSE_RANK() never leaves gaps (1, 2, 2, 3).',
        conceptKey: 'Ranking Functions: RANK vs DENSE_RANK',
      },
      {
        id: 'q-d2-t5-2',
        question: 'Can you place a window function inside a WHERE clause directly (e.g. WHERE ROW_NUMBER() OVER(...) = 1)?',
        options: [
          'Yes, window functions can be placed anywhere in an SQL statement.',
          'No, because the WHERE clause executes before window functions are evaluated. You must use a CTE or subquery.',
          'Only if the partition size is smaller than 100 rows.',
          'Only when querying views rather than base tables.',
        ],
        correctIndex: 1,
        explanation: 'Because WHERE executes before window calculations in the SQL pipeline, you must wrap the query in a Common Table Expression (CTE) or subquery to filter on window outputs.',
        conceptKey: 'Window Function Execution Order in CTEs',
      },
    ],
    revisionTopicId: 'd2-t5',
    revisionReason: 'Review window function framing, ranking gap rules, and CTE wrapping.',
  },
  {
    id: 'lesson-excel-lookups',
    topicId: 'd1-t2',
    domainId: 'domain-1',
    title: 'Modern Lookups: XLOOKUP vs INDEX/MATCH & Dynamic Arrays',
    order: 5,
    difficulty: 'intermediate',
    durationMinutes: 25,
    xpReward: 45,
    overview: 'Transition from fragile VLOOKUP formulas to robust, bidirectional XLOOKUP and dynamic array formulas (FILTER, UNIQUE, SORT).',
    conceptMarkdown: `### The Evolution of Spreadsheet Lookups

For decades, \`VLOOKUP\` was the most used lookup function in spreadsheets. However, it suffered from severe structural limitations:
- Could only look to the right of the lookup column.
- Broke silently whenever columns were inserted or deleted due to static column index numbers.
- Required an external \`IFERROR\` wrapper to handle missing entries.

#### Modern Syntax: XLOOKUP
\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
\`\`\`
1. **Bidirectional:** Looks left or right with equal ease.
2. **Column Resilient:** Uses explicit cell range references rather than fragile integer column indices.
3. **Built-in Error Handling:** The 4th argument \`[if_not_found]\` handles missing items natively without \`IFERROR\`.

#### Dynamic Array Functions
Modern Excel and Google Sheets support **Array Spilling**: a single formula spills calculated outputs across multiple cells automatically:
- \`=FILTER(data_range, criteria_range = "Value")\`: Extract matching subsets dynamically.
- \`=UNIQUE(array)\`: Deduplicate a column into distinct values.
- \`=SORT(array, sort_index, sort_order)\`: Order ranges without modifying source data.`,
    keyTakeaways: [
      'XLOOKUP completely eliminates the need for VLOOKUP and legacy INDEX/MATCH in modern spreadsheets.',
      'The 4th argument of XLOOKUP handles missing matches natively without external error functions.',
      'Dynamic array functions (FILTER, UNIQUE) spill outputs automatically and update in real time.',
      'Inserting columns into an XLOOKUP range never corrupts formula output.',
    ],
    codeExample: {
      language: 'excel',
      code: `=XLOOKUP(E2, A2:A500, C2:C500, "Employee Not Found")`,
      explanation: 'Looks up employee ID in cell E2 against column A, returns the salary in column C, or outputs "Employee Not Found" if no match exists.',
    },
    practicalExercise: {
      title: 'Write a Robust XLOOKUP Formula',
      prompt: 'Construct an XLOOKUP formula to find product SKU in A2 within lookup range Products!A:A, returning unit price in Products!D:D with fallback "Discontinued".',
      language: 'excel',
      starterCode: `=VLOOKUP(A2, Products!A:D, 4, FALSE)\n`,
      expectedOutputKeyword: 'XLOOKUP',
      solutionCode: `=XLOOKUP(A2, Products!A:A, Products!D:D, "Discontinued")`,
      hints: [
        'Use =XLOOKUP(lookup_val, lookup_range, return_range, [if_not_found]).',
        'Replace VLOOKUP with XLOOKUP to prevent column insertion breakage.',
      ],
    },
    quiz: [
      {
        id: 'q-d1-t2-1',
        question: 'What is a major structural hazard of using =VLOOKUP(A2, B:D, 3, FALSE) in financial models?',
        options: [
          'VLOOKUP runs significantly slower than Python in all scenarios.',
          'If a user inserts a new column between B and D, the formula continues referencing index 3, silently returning the wrong column.',
          'VLOOKUP does not support numeric lookups.',
          'VLOOKUP requires an active database connection.',
        ],
        correctIndex: 1,
        explanation: 'Because VLOOKUP relies on a hardcoded static index number (3), inserting or deleting columns between the lookup and return ranges corrupts the data output without warning.',
        conceptKey: 'VLOOKUP Column Index Fragility',
      },
      {
        id: 'q-d1-t2-2',
        question: 'What happens when a modern dynamic array formula like =FILTER(A2:B100, B2:B100="Q3") attempts to spill into cells that already contain data?',
        options: [
          'It overwrites existing data immediately.',
          'It throws a #SPILL! error until the destination cells are cleared.',
          'It prompts the operating system with a file dialog.',
          'It deletes the workbook.',
        ],
        correctIndex: 1,
        explanation: 'If any cell in the intended spill range is blocked by existing text or values, Excel generates a #SPILL! error until the obstruction is removed.',
        conceptKey: 'Dynamic Array Spill Blockage',
      },
    ],
    revisionTopicId: 'd1-t2',
    revisionReason: 'Review modern dynamic array functions and XLOOKUP error handling.',
  },
  {
    id: 'lesson-stats-descriptive',
    topicId: 'd4-t1',
    domainId: 'domain-4',
    title: 'Descriptive Statistics & Outlier Sensitivity Traps',
    order: 6,
    difficulty: 'beginner',
    durationMinutes: 25,
    xpReward: 35,
    overview: 'Learn why summary averages deceive decision-makers, and master median, IQR, variance, and skewness for resilient data profiling.',
    conceptMarkdown: `### The Flaw of Averages

When describing distributions, relying solely on the **Arithmetic Mean** is one of the most dangerous mistakes an analyst can make.

#### Sensitivity to Extreme Values
Consider salaries at a startup with 5 employees:
\`$40,000, $45,000, $50,000, $55,000, $1,000,000\` (Founder)
- **Mean:** \`$238,000\` (Grossly misleading; 80% of employees earn under $60k!)
- **Median:** \`$50,000\` (Resilient representation of the typical worker)

#### When to Use What
| Metric | Parametric (Normal) | Non-Parametric (Skewed/Outliers) |
|---|---|---|
| **Center** | Mean (Average) | Median (50th Percentile) |
| **Spread** | Standard Deviation (σ) | Interquartile Range (IQR = Q3 - Q1) |

#### Measuring Dispersion
- **Variance (s²):** Average squared deviations from the mean.
- **Standard Deviation (s):** Square root of variance, returning dispersion to original measurement units.
- **IQR (Interquartile Range):** Range of the middle 50% of records.
- **Tukey’s Outlier Fence Rule:**
  - Lower Bound = \`Q1 - 1.5 × IQR\`
  - Upper Bound = \`Q3 + 1.5 × IQR\``,
    keyTakeaways: [
      'The Mean and Standard Deviation are highly sensitive to skewness and extreme outliers.',
      'The Median and Interquartile Range (IQR) are robust non-parametric metrics.',
      'Tukey’s 1.5 × IQR fence rule identifies univariate outliers reliably without assuming normality.',
      'Always inspect distribution shape (skewness, modality) before choosing summary statistics.',
    ],
    codeExample: {
      language: 'python',
      code: `import numpy as np

salaries = np.array([40000, 45000, 50000, 55000, 1000000])

print(f"Mean: {np.mean(salaries):,.2f}")      # $238,000.00
print(f"Median: {np.median(salaries):,.2f}")  # $50,000.00

q75, q25 = np.percentile(salaries, [75 ,25])
iqr = q75 - q25
upper_fence = q75 + (1.5 * iqr)
print(f"Outlier Threshold: {upper_fence:,.2f}")`,
      explanation: 'Demonstrates how a single extreme outlier shifts the mean by over 400% while leaving the median untouched.',
    },
    practicalExercise: {
      title: 'Calculate IQR Fences',
      prompt: 'Given Q1 = 120 and Q3 = 200, calculate the Upper Fence beyond which a data point is considered an outlier.',
      language: 'python',
      starterCode: `q1 = 120\nq3 = 200\niqr = q3 - q1\n# Calculate upper fence:\n`,
      expectedOutputKeyword: 'upper_fence',
      solutionCode: `q1 = 120\nq3 = 200\niqr = q3 - q1\nupper_fence = q3 + (1.5 * iqr)\nprint(upper_fence) # 320.0`,
      hints: [
        'IQR = Q3 - Q1 = 200 - 120 = 80.',
        'Upper Fence = Q3 + (1.5 * 80) = 200 + 120 = 320.',
      ],
    },
    quiz: [
      {
        id: 'q-d4-t1-1',
        question: 'If an e-commerce order dataset has a strong right skew (a few very large B2B wholesale orders), which relationship between Mean and Median is expected?',
        options: [
          'Mean < Median',
          'Mean > Median',
          'Mean == Median',
          'Standard deviation will be zero',
        ],
        correctIndex: 1,
        explanation: 'In a right-skewed (positively skewed) distribution, extreme values in the upper tail pull the mean upward, making Mean > Median.',
        conceptKey: 'Distribution Skewness & Mean/Median Relationships',
      },
      {
        id: 'q-d4-t1-2',
        question: 'Under Tukey’s 1.5 × IQR outlier fence rule, what is the lower outlier boundary formula?',
        options: [
          'Mean - (1.5 × Standard Deviation)',
          'Q1 - (1.5 × IQR)',
          'Median - IQR',
          'Q3 - (2 × Variance)',
        ],
        correctIndex: 1,
        explanation: 'The lower fence is defined as Q1 - (1.5 × IQR), identifying observations unusually far below the 25th percentile.',
        conceptKey: 'Tukey IQR Outlier Thresholds',
      },
    ],
    revisionTopicId: 'd4-t1',
    revisionReason: 'Review measures of dispersion and outlier detection fences.',
  },
  {
    id: 'lesson-business-kpis',
    topicId: 'd7-t1',
    domainId: 'domain-7',
    title: 'Unit Economics, Margin Deconstruction & KPI Trees',
    order: 7,
    difficulty: 'intermediate',
    durationMinutes: 30,
    xpReward: 50,
    overview: 'Bridge raw transactional tables with commercial value by deconstructing revenue into volume, price, and unit margin KPI trees.',
    conceptMarkdown: `### Thinking in KPI Trees

A Senior Analyst never reports a metric in isolation. They deconstruct high-level corporate metrics into **diagnostic component branches**.

\`\`\`
Total Revenue ($)
  ├── Total Orders (Volume)
  │     ├── Unique Active Customers (Traffic × Conversion)
  │     └── Purchase Frequency per Customer (Orders / Customer)
  └── Average Order Value (AOV in $)
        ├── Units Per Transaction (Basket Depth)
        └── Average Selling Price per Unit (ASP in $)
\`\`\`

#### Unit Economics Metrics
- **CAC (Customer Acquisition Cost):** Total sales & marketing spend / new customers acquired.
- **LTV (Customer Lifetime Value):** Average gross profit contribution per customer across their entire lifespan.
- **LTV / CAC Ratio:**
  - \`< 1.0x\`: Destroying capital (immediate emergency).
  - \`~ 3.0x\`: Healthy, sustainable commercial benchmark.
  - \`> 5.0x\`: Underinvesting in growth; leaving market share on the table.
- **Payback Period:** Number of months required to recoup the upfront CAC from customer gross margin.`,
    keyTakeaways: [
      'KPI trees connect top-line financial metrics to frontline operational levers.',
      'Revenue equals Volume (Active Users × Frequency) multiplied by Average Order Value.',
      'A healthy SaaS / E-Commerce commercial engine targets an LTV/CAC ratio of ~3:1.',
      'Always analyze Gross Margin alongside Revenue to avoid celebrating unprofitable growth.',
    ],
    codeExample: {
      language: 'sql',
      code: `SELECT 
  DATE_TRUNC('month', order_date) AS order_month,
  COUNT(DISTINCT customer_id) AS active_customers,
  COUNT(order_id)::NUMERIC / COUNT(DISTINCT customer_id) AS purchase_frequency,
  SUM(order_amount) / COUNT(order_id) AS avg_order_value,
  SUM(order_amount) AS total_monthly_revenue
FROM orders
GROUP BY 1
ORDER BY 1;`,
      explanation: 'Decomposes monthly revenue into active customer volume, purchase frequency, and average order value.',
    },
    practicalExercise: {
      title: 'Calculate Customer Lifetime Value (LTV)',
      prompt: 'Given Average Monthly Margin per Customer = $45, and Monthly Churn Rate = 5% (0.05), calculate Customer LTV (LTV = Monthly Margin / Churn Rate).',
      language: 'python',
      starterCode: `monthly_margin = 45\nchurn_rate = 0.05\n# Calculate LTV:\n`,
      expectedOutputKeyword: 'ltv',
      solutionCode: `monthly_margin = 45\nchurn_rate = 0.05\nltv = monthly_margin / churn_rate\nprint(ltv) # $900.0`,
      hints: [
        'LTV = 45 / 0.05 = $900.',
      ],
    },
    quiz: [
      {
        id: 'q-d7-t1-1',
        question: 'If a company celebrates a 40% jump in monthly revenue, but net profit collapses by 18%, what KPI tree branch is most likely failing?',
        options: [
          'Website visitor traffic count.',
          'Gross Margin percentage or Customer Acquisition Cost (CAC) efficiency.',
          'The number of rows in the SQL database.',
          'The server timezone configuration.',
        ],
        correctIndex: 1,
        explanation: 'Revenue growth accompanied by collapsing profit indicates unit economics erosion: either discounts compressed gross margin or acquisition marketing spend exceeded customer lifetime margin.',
        conceptKey: 'Unit Economics & Margin Decay',
      },
      {
        id: 'q-d7-t1-2',
        question: 'What is the benchmark target LTV to CAC ratio for a sustainable digital subscription business?',
        options: [
          '0.5:1 (Spend double what the customer generates)',
          '1:1 (Break-even with zero profit buffer)',
          '3:1 (Three dollars of lifetime gross margin per dollar of marketing spend)',
          '50:1 (Zero sales team)',
        ],
        correctIndex: 2,
        explanation: 'A 3:1 ratio provides healthy profitability while ensuring the business invests sufficiently in market acquisition.',
        conceptKey: 'LTV/CAC Ratio Benchmarks',
      },
    ],
    revisionTopicId: 'd7-t1',
    revisionReason: 'Review business model economics and KPI tree decomposition.',
  },
];

export const getLessonById = (id: string): Lesson | undefined => {
  return LESSONS_DATABASE.find(l => l.id === id);
};

export const getLessonsByTopicId = (topicId: string): Lesson[] => {
  return LESSONS_DATABASE.filter(l => l.topicId === topicId);
};

export const getLessonsByDomainId = (domainId: string): Lesson[] => {
  return LESSONS_DATABASE.filter(l => l.domainId === domainId);
};
