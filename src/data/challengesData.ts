import { Challenge } from '../types/challenge';

export const CHALLENGES_DATA: Challenge[] = [
  // ============================================================================
  // 1. SQL CHALLENGE (Intermediate)
  // ============================================================================
  {
    id: 'ch-01',
    slug: 'fintech-credit-card-fraud-velocity',
    title: 'Fintech Credit Card Fraud Velocity Detection',
    description:
      'Identify anomalous high-velocity transaction bursts where multiple orders occur within the same customer account in the e-commerce database.',
    domainId: 'domain-2',
    topicId: 'd2-t3',
    category: 'sql',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    xpReward: 90,
    isCoding: true,
    scenario:
      'Payment Operations noticed automated card-testing bots executing rapid repeat orders. Standard static amount filters failed because each individual charge is under $500.',
    backgroundContext:
      'In fraud forensics, transaction velocity (order frequency grouped by customer) reveals bots that split stolen card balances across rapid small charges. You need to identify accounts with repeat orders and calculate their cumulative spend.',
    sqlDatabaseId: 'ecommerce',
    datasetName: 'ecommerce.orders & customers',
    datasetDescription: 'Relational orders and customer tables in the ecommerce SQLite database.',
    tasks: [
      {
        id: 't-sql-1',
        order: 1,
        objective: 'Count orders per customer for completed orders and return those with more than 1 order.',
        prompt:
          'Write a SQL query joining `customers` and `orders` to return `customer_id`, `full_name`, and `COUNT(order_id) AS order_count` for completed orders, having `order_count > 1`, ordered descending by `order_count`.',
        submissionMode: 'sql_query',
        solutionCode: `SELECT c.customer_id, c.full_name, COUNT(o.order_id) AS order_count
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'Completed'
GROUP BY c.customer_id, c.full_name
HAVING COUNT(o.order_id) > 1
ORDER BY order_count DESC;`,
        expectedRowCount: 3,
        expectedColumns: ['customer_id', 'full_name', 'order_count'],
      },
      {
        id: 't-sql-2',
        order: 2,
        objective: 'Identify the top velocity customer who accumulated 3 completed orders.',
        prompt:
          'Who is the customer with the highest order count (3 completed orders)?',
        submissionMode: 'multiple_choice',
        options: ['Liam O\'Connor', 'Maya Lin', 'Aarav Patel', 'Ethan Brooks'],
        correctOptionIndex: 1,
      },
    ],
    hints: [
      'Filter `WHERE o.status = \'Completed\'` before grouping by customer.',
      'Use `HAVING COUNT(o.order_id) > 1` to isolate repeat buyers.',
    ],
    evaluationCriteria:
      'Accurate SQL group aggregation, correct join on customer_id, and correct identification of top velocity customer.',
    explanation:
      'Customer 1 (Maya Lin) executed 3 distinct completed orders totaling $1,850. In payment security, multiple consecutive charges within hours without device variation indicates card credential stuffing.',
  },

  // ============================================================================
  // 2. SPREADSHEET CHALLENGE (Beginner)
  // ============================================================================
  {
    id: 'ch-02',
    slug: 'ecommerce-fulfillment-surcharge-model',
    title: 'E-Commerce Logistics Surcharge Optimization',
    description:
      'Model carrier shipping surcharges and identify total delivery expense across regional distribution hubs.',
    domainId: 'domain-1',
    topicId: 'd1-t2',
    category: 'spreadsheet',
    difficulty: 'beginner',
    estimatedMinutes: 25,
    xpReward: 70,
    isCoding: false,
    scenario:
      'Apex Logistics incurred unexpected peak season surcharges across regional hubs. As Logistics Analyst, calculate total freight costs and evaluate cost per package.',
    backgroundContext:
      'Freight billing applies fuel surcharges when distance exceeds 500 miles. Hub B processed 4,500 packages with a base rate of $8.50 and a $2.10 surcharge.',
    datasetName: 'Logistics Hub Freight Ledger',
    datasetDescription: 'Hub-level parcel volumes, baseline freight, and fuel surcharges.',
    datasetRows: [
      { hub: 'Hub East', packages: 6200, base_rate: 7.8, surcharge: 1.5, total: 57660 },
      { hub: 'Hub Central', packages: 4500, base_rate: 8.5, surcharge: 2.1, total: 47700 },
      { hub: 'Hub West', packages: 3800, base_rate: 9.2, surcharge: 2.8, total: 45600 },
    ],
    tasks: [
      {
        id: 't-sheet-1',
        order: 1,
        objective: 'Calculate total packages processed across all three distribution hubs.',
        prompt: 'What is the total package count across Hub East (6,200), Central (4,500), and West (3,800)?',
        submissionMode: 'numeric_value',
        expectedNumericValue: 14500,
        numericTolerance: 0.1,
      },
      {
        id: 't-sheet-2',
        order: 2,
        objective: 'Determine the spreadsheet formula to compute total cost for Hub Central.',
        prompt: 'If cell B3 has packages (4500), C3 has base_rate (8.5), and D3 has surcharge (2.1), what is the formula?',
        submissionMode: 'spreadsheet_formula',
        expectedNumericValue: 47700,
        numericTolerance: 1,
        starterCode: '=B3*(C3+D3)',
      },
    ],
    hints: [
      'Add packages: 6,200 + 4,500 + 3,800 = 14,500.',
      'Multiply package volume by the sum of base rate and surcharge: `=B3*(C3+D3)`.',
    ],
    evaluationCriteria:
      'Exact volume calculation and proper formula construction applying order of operations.',
    explanation:
      'Total logistics cost combines base freight and variable fuel surcharges. Wrapping addition in parentheses ensures rate summation precedes volume multiplication.',
  },

  // ============================================================================
  // 3. PYTHON CHALLENGE (Intermediate)
  // ============================================================================
  {
    id: 'ch-03',
    slug: 'cohort-retention-curve-modeling',
    title: 'Python Cohort Retention & Churn Curve Modeling',
    description:
      'Write a Python script to compute average revenue per user (ARPU) and customer retention drop-off from telemetry dictionaries.',
    domainId: 'domain-3',
    topicId: 'd3-t2',
    category: 'python',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    xpReward: 85,
    isCoding: true,
    scenario:
      'The VP of Growth needs an automated retention degradation calculation from customer order telemetry without external libraries.',
    backgroundContext:
      'Using the preloaded Skulpt Python environment, compute summary statistics across order batches to identify margin erosion.',
    datasetName: 'orders_data (Preloaded Python Object)',
    datasetDescription: '8 preloaded orders with order_id, region, revenue, and profit.',
    tasks: [
      {
        id: 't-py-1',
        order: 1,
        objective: 'Compute total profit across orders_data in Python.',
        prompt:
          'Write a script summing `profit` across all orders in `orders_data` and print the exact sum.',
        submissionMode: 'python_code',
        starterCode: `df = DataFrame(orders_data)\nprint("Total Profit:", sum(df.col('profit')))`,
        solutionCode: `df = DataFrame(orders_data)\nprint("Total Profit:", sum(df.col('profit')))`,
        expectedOutputContains: ['Total Profit: 2059.0'],
      },
      {
        id: 't-py-2',
        order: 2,
        objective: 'Identify which region has negative profit in the dataset.',
        prompt:
          'Reviewing the orders_data, which region contains an order with negative profit (loss-making transaction)?',
        submissionMode: 'multiple_choice',
        options: ['North America only', 'Europe and Asia Pacific', 'Latin America', 'None — all are positive'],
        correctOptionIndex: 1,
      },
    ],
    hints: [
      'Use `df.col(\'profit\')` to extract the array of profit values.',
      'Inspect order 1007 (Europe: profit -240.0) and order 1008 (Asia Pacific: profit -200.0).',
    ],
    evaluationCriteria:
      'Accurate total profit computation in Python and correct identification of loss-making regions.',
    explanation:
      'Total profit across the 8 orders is $2,059.00. However, regional analysis reveals severe margin leakage in Europe and Asia Pacific due to high fulfillment costs.',
  },

  // ============================================================================
  // 4. STATISTICS CHALLENGE (Advanced)
  // ============================================================================
  {
    id: 'ch-04',
    slug: 'healthcare-readmission-hypothesis-testing',
    title: 'Hospital Readmission Reduction Hypothesis Test',
    description:
      'Evaluate a two-sample clinical intervention trial comparing 30-day readmission rates between standard discharge and nurse follow-up protocols.',
    domainId: 'domain-4',
    topicId: 'd4-t4',
    category: 'statistics',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    xpReward: 110,
    isCoding: false,
    scenario:
      'A regional hospital network piloted a post-discharge virtual nurse check-in program (n = 400). Standard care readmission was 18.5%, while treatment readmission fell to 13.2%. Is this reduction statistically significant at α = 0.05?',
    backgroundContext:
      'Hospital penalties under Medicare guidelines penalize excessive 30-day readmissions. The two-sample z-test yields z = 2.08 with an approximate two-tailed p-value of 0.0375.',
    tasks: [
      {
        id: 't-stat-1',
        order: 1,
        objective: 'Calculate the absolute percentage point reduction in readmission rate.',
        prompt: 'What is the absolute reduction in readmission rate (18.5% - 13.2%) in percentage points?',
        submissionMode: 'numeric_value',
        expectedNumericValue: 5.3,
        numericTolerance: 0.1,
      },
      {
        id: 't-stat-2',
        order: 2,
        objective: 'Interpret the statistical significance of p = 0.0375 against α = 0.05.',
        prompt: 'With p = 0.0375 < 0.05, what is the valid analytical conclusion?',
        submissionMode: 'multiple_choice',
        options: [
          'Fail to reject H₀; the reduction is statistically insignificant.',
          'Reject H₀; the nurse callback program produced a statistically significant reduction in 30-day readmissions at α = 0.05.',
          'The sample size was too small to make any inference.',
          'There is a 3.75% chance that the treatment was harmful.',
        ],
        correctOptionIndex: 1,
      },
    ],
    hints: [
      'Absolute reduction: 18.5 - 13.2 = 5.3 percentage points.',
      'Since p-value (0.0375) is less than the significance threshold α (0.05), we reject the null hypothesis.',
    ],
    evaluationCriteria:
      'Correct arithmetic subtraction and rigorous interpretation of hypothesis test p-values.',
    explanation:
      'Because p = 0.0375 < 0.05, we reject the null hypothesis of equal readmission rates. The 5.3 percentage point reduction is statistically significant and justifies expanding the nurse follow-up protocol.',
  },

  // ============================================================================
  // 5. DATA VISUALIZATION CHALLENGE (Intermediate)
  // ============================================================================
  {
    id: 'ch-05',
    slug: 'executive-attribution-storyboard',
    title: 'Executive Marketing Attribution Visual Storyboard',
    description:
      'Select and justify the optimal visual encoding to communicate multichannel acquisition ROAS to executive leadership without misleading visual distortion.',
    domainId: 'domain-5',
    topicId: 'd5-t3',
    category: 'visualization',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    xpReward: 80,
    isCoding: false,
    scenario:
      'The Marketing Director prepared a 3D exploded pie chart with 14 slices and a truncated bar chart with a baseline starting at $40,000 to present channel performance. You must critique the visual integrity flaws.',
    backgroundContext:
      'Visual perception research (Cleveland & McGill) proves that humans compare positions along a common aligned scale with far greater accuracy than 3D area or angle slices.',
    tasks: [
      {
        id: 't-viz-1',
        order: 1,
        objective: 'Identify the primary distortion introduced by truncating a bar chart baseline above zero.',
        prompt: 'Why is truncating a bar chart baseline (starting Y-axis at non-zero) considered misleading?',
        submissionMode: 'multiple_choice',
        options: [
          'It makes the bars look more modern and executive-friendly.',
          'Bar charts encode value through height/area from zero; a non-zero baseline exaggerates minor differences into massive visual proportions.',
          'It saves vertical white space on the presentation slide.',
          'There is no distortion as long as the numbers are printed on top of the bars.',
        ],
        correctOptionIndex: 1,
      },
      {
        id: 't-viz-2',
        order: 2,
        objective: 'Recommend the best chart type to compare revenue across 5 discrete marketing channels.',
        prompt: 'Which chart type provides the highest perceptual accuracy for comparing 5 discrete channel totals?',
        submissionMode: 'multiple_choice',
        options: [
          'A horizontal or vertical standard bar chart with a zero-baseline',
          'A 3D doughnut chart with shadow effects',
          'A radar chart with connected vertices',
          'A decorative word cloud sized by budget',
        ],
        correctOptionIndex: 0,
      },
    ],
    hints: [
      'Bar charts encode data using length from zero. When zero is removed, visual ratios no longer match numerical ratios.',
      'Aligned bar charts on a common scale have the lowest perceptual error rate.',
    ],
    evaluationCriteria:
      'Correct understanding of visual encoding principles and graphical integrity.',
    explanation:
      'Truncating bar chart baselines distorts perceived ratios. A standard bar chart starting at 0 allows viewers to accurately judge relative channel contribution.',
  },

  // ============================================================================
  // 6. BUSINESS ANALYTICS CHALLENGE (Advanced - Locked until ch-01 or ch-03 completed)
  // ============================================================================
  {
    id: 'ch-06',
    slug: 'saas-pricing-elasticity-downgrade-risk',
    title: 'SaaS Tier Repricing & Customer Contraction Analysis',
    description:
      'Analyze the net revenue impact of increasing Growth tier prices from $950 to $1,250 considering expected downgrade elasticity.',
    domainId: 'domain-7',
    topicId: 'd7-t1',
    category: 'business_analytics',
    difficulty: 'advanced',
    estimatedMinutes: 45,
    xpReward: 120,
    isCoding: false,
    prerequisiteChallengeIds: ['ch-01'],
    scenario:
      'CloudPulse SaaS plans to raise its Growth tier price from $950/mo to $1,250/mo across 100 existing accounts. Price sensitivity surveys indicate 15 accounts will downgrade to Starter ($290/mo) and 5 will churn entirely.',
    backgroundContext:
      'Current Monthly Revenue: 100 × $950 = $95,000.\nProjected outcome:\n- 80 accounts stay on Growth @ $1,250 = $100,000\n- 15 accounts downgrade to Starter @ $290 = $4,350\n- 5 accounts churn to $0 = $0\nTotal New Revenue = $104,350.',
    tasks: [
      {
        id: 't-biz-1',
        order: 1,
        objective: 'Calculate the net change in monthly recurring revenue (MRR) from the price increase.',
        prompt: 'What is the net dollar change in monthly revenue ($104,350 - $95,000)?',
        submissionMode: 'numeric_value',
        expectedNumericValue: 9350,
        numericTolerance: 1,
      },
      {
        id: 't-biz-2',
        order: 2,
        objective: 'Formulate an executive recommendation on whether to proceed with the price hike.',
        prompt: 'Provide a structured recommendation assessing the trade-off between the +$9,350 MRR gain and losing 5 logos.',
        submissionMode: 'structured_rubric',
        rubricKeywords: ['net gain', 'churn', 'expansion', 'starter', 'grandfathering', 'ltv'],
      },
    ],
    hints: [
      'Subtract baseline revenue ($95,000) from projected revenue ($104,350).',
      'Consider whether a 5% churn rate on logos is acceptable given the 9.8% expansion in total MRR.',
    ],
    evaluationCriteria:
      'Accurate delta computation and strategic executive reasoning addressing customer lifetime value and churn mitigation.',
    explanation:
      'The price hike yields an immediate net gain of +$9,350/mo (+9.8% MRR). However, to prevent losing 5 logos entirely, the team should offer an annual contract lock-in or grandfathering discount for early adopters.',
  },

  // ============================================================================
  // 7. DATASET INVESTIGATION CHALLENGE (Intermediate)
  // ============================================================================
  {
    id: 'ch-07',
    slug: 'telemetry-missingness-webhook-audit',
    title: 'Audit Log Inconsistency & Webhook Replay Detection',
    description:
      'Audit an ingestion log dataset to isolate duplicate event IDs and quantify artificial revenue inflation caused by unhandled payment gateway retries.',
    domainId: 'domain-6',
    topicId: 'd6-t1',
    category: 'dataset_investigation',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    xpReward: 95,
    isCoding: false,
    scenario:
      'During month-end close, Finance noticed total stripe webhook volume was 12% higher than settled bank deposits. Audit the staging dataset below to locate duplicate payloads.',
    backgroundContext:
      'Distributed systems require idempotent webhook consumers. When a consumer receives HTTP 500 from an internal analytics pipeline, Stripe retries the event with the identical event_id.',
    datasetName: 'webhook_staging_logs',
    datasetDescription: 'Staging transactions with event_id, customer, amount, and timestamp.',
    datasetRows: [
      { event_id: 'evt_901', customer: 'Acme Corp', amount: 1200, status: 'processed' },
      { event_id: 'evt_902', customer: 'Beta LLC', amount: 450, status: 'processed' },
      { event_id: 'evt_901', customer: 'Acme Corp', amount: 1200, status: 'retry_duplicate' },
      { event_id: 'evt_903', customer: 'Gamma Inc', amount: 800, status: 'processed' },
      { event_id: 'evt_901', customer: 'Acme Corp', amount: 1200, status: 'retry_duplicate' },
    ],
    tasks: [
      {
        id: 't-inv-1',
        order: 1,
        objective: 'Identify the duplicate event ID causing billing inflation.',
        prompt: 'Which event_id appears multiple times in the staging log?',
        submissionMode: 'multiple_choice',
        options: ['evt_902', 'evt_903', 'evt_901', 'None — all are unique'],
        correctOptionIndex: 2,
      },
      {
        id: 't-inv-2',
        order: 2,
        objective: 'Calculate the true deduplicated revenue across unique events.',
        prompt: 'What is the true sum of unique transaction amounts (evt_901: $1200, evt_902: $450, evt_903: $800)?',
        submissionMode: 'numeric_value',
        expectedNumericValue: 2450,
        numericTolerance: 0.1,
      },
    ],
    hints: [
      'Count occurrences of `evt_901`: it appears 3 times ($1,200 each).',
      'True revenue equals $1,200 + $450 + $800 = $2,450.',
    ],
    evaluationCriteria:
      'Correct identification of the replayed webhook ID and accurate calculation of deduplicated revenue.',
    explanation:
      '`evt_901` was processed 3 times due to lack of an idempotency key check, inflating raw log totals by $2,400. Deduplication restores actual revenue to $2,450.',
  },

  // ============================================================================
  // 8. REAL-WORLD CASE STUDY CHALLENGE (Advanced)
  // ============================================================================
  {
    id: 'ch-08',
    slug: 'marketplace-merchant-take-rate-strategy',
    title: 'Two-Sided Marketplace Merchant Take-Rate Strategy',
    description:
      'Evaluate the economic trade-offs of shifting an e-commerce platform take-rate from a flat 15% to a tiered model (12% high-volume, 18% standard).',
    domainId: 'domain-7',
    topicId: 'd7-t2',
    category: 'case_study',
    difficulty: 'advanced',
    estimatedMinutes: 45,
    xpReward: 115,
    isCoding: false,
    prerequisiteChallengeIds: ['ch-02'],
    scenario:
      'An online artisan marketplace faces supplier attrition: top merchants generating 60% of GMV threaten to migrate to standalone Shopify stores due to the flat 15% platform commission.',
    backgroundContext:
      'Total Marketplace Annual GMV: $50,000,000.\n- Top Tier (60% of GMV = $30M): proposed 12% take-rate = $3.6M revenue\n- Standard Tier (40% of GMV = $20M): proposed 18% take-rate = $3.6M revenue\nTotal projected platform revenue: $7.2M (vs baseline $7.5M at flat 15%).',
    tasks: [
      {
        id: 't-case-1',
        order: 1,
        objective: 'Calculate the short-term annual commission revenue variance between the tiered model ($7.2M) and flat 15% ($7.5M).',
        prompt: 'What is the immediate dollar reduction in commission revenue under the tiered model ($7,500,000 - $7,200,000)?',
        submissionMode: 'numeric_value',
        expectedNumericValue: 300000,
        numericTolerance: 100,
      },
      {
        id: 't-case-2',
        order: 2,
        objective: 'Evaluate why accepting a -$300k short-term revenue hit protects long-term marketplace viability.',
        prompt: 'Explain how retaining top merchants prevents marketplace collapse despite the $300k take-rate concession.',
        submissionMode: 'structured_rubric',
        rubricKeywords: ['retention', 'liquidity', 'cross-side network effects', 'buyer traffic', 'shopify', 'gmv'],
      },
    ],
    hints: [
      'Subtract projected revenue ($7,200,000) from baseline revenue ($7,500,000) = $300,000.',
      'Remember: If top merchants leave, 60% of product selection and search engine traffic disappears, triggering buyer churn.',
    ],
    evaluationCriteria:
      'Accurate arithmetic revenue delta and deep understanding of two-sided network effects and seller lock-in.',
    explanation:
      'While the tiered take-rate reduces annual revenue by $300,000 in Year 1, losing top merchants would eliminate $30M in GMV and $4.5M in commission. Protecting supply liquidity preserves platform network effects.',
  },
];
