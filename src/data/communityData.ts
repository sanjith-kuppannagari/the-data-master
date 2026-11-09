import { CommunityDiscussion } from '../types/community';

export const INITIAL_COMMUNITY_DISCUSSIONS: CommunityDiscussion[] = [
  {
    id: 'disc-01',
    title: 'How do you handle Window Function frame specifications with NULL values in timestamps?',
    authorId: 'mentor-marcus-01',
    authorName: 'Marcus Vance',
    authorRole: 'Platform Mentor • SQL',
    category: 'SQL & Databases',
    domainId: 'sql-relational-databases',
    content: `When calculating a 7-day rolling moving average of daily transactions using SQL window functions:
\`\`\`sql
AVG(revenue) OVER (
  PARTITION BY merchant_id 
  ORDER BY transaction_date 
  RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
)
\`\`\`
If a merchant has zero transactions on certain calendar dates, the window skips those rows rather than treating them as 0.00 revenue, which artificially inflates the rolling average!

What is your preferred pattern to guarantee calendar date density before running window aggregates? Do you prefer joining on a recursive date CTE, or using a calendar dimension table?`,
    tags: ['SQL', 'WindowFunctions', 'DataModeling', 'BestPractices'],
    replies: [
      {
        id: 'rep-01-1',
        discussionId: 'disc-01',
        authorId: 'user-demo-001',
        authorName: 'Alex Mercer',
        authorRole: 'Analyst',
        content: `I usually generate a recursive date CTE or use PostgreSQL's \`generate_series('2025-01-01', CURRENT_DATE, '1 day'::interval)\` and then \`LEFT JOIN\` the merchants and sales. Coalesce the null revenues to \`COALESCE(sales.revenue, 0)\` so that the window function sees actual zero-revenue calendar days!`,
        upvotes: 12,
        isAcceptedAnswer: true,
        createdAt: '2026-11-04T14:22:00Z'
      },
      {
        id: 'rep-01-2',
        discussionId: 'disc-01',
        authorId: 'mentor-elena-02',
        authorName: 'Elena Rostova',
        authorRole: 'Senior Data Architect',
        content: `In production data warehouses like BigQuery or Snowflake, maintaining a dedicated \`dim_date\` calendar table is significantly faster and cheaper than generating dates dynamically via recursive CTEs, especially across millions of records.`,
        upvotes: 8,
        createdAt: '2026-11-04T15:45:00Z'
      }
    ],
    upvotes: 24,
    views: 142,
    isPinned: true,
    createdAt: '2026-11-04T12:00:00Z',
    updatedAt: '2026-11-04T15:45:00Z'
  },
  {
    id: 'disc-02',
    title: 'Tableau LOD Expressions: When to prefer {FIXED} vs {INCLUDE} for cohort baselines?',
    authorId: 'mentor-elena-02',
    authorName: 'Elena Rostova',
    authorRole: 'Senior Data Architect',
    category: 'Data Visualization & BI',
    domainId: 'data-visualization-storytelling',
    content: `Level of Detail (LOD) expressions in Tableau are essential for calculating customer retention baselines independent of worksheet filters.

A common pitfall is using \`{FIXED [Customer ID] : MIN([Order Date])}\` when worksheet dimension filters (like Region or Product Category) need to filter the cohort. Since \`{FIXED}\` evaluates *before* dimension filters in Tableau's order of operations, the cohort baseline will ignore the filter unless it is promoted to a Context Filter!

Has anyone established standard documentation guidelines for their business intelligence teams regarding Context Filters with LOD calculations?`,
    tags: ['Tableau', 'BI', 'DataVisualization', 'LODExpressions'],
    replies: [
      {
        id: 'rep-02-1',
        discussionId: 'disc-02',
        authorId: 'instructor-david-03',
        authorName: 'David Lin',
        authorRole: 'Curriculum Director',
        content: `Great reminder on Tableau's Order of Operations. We always teach:
1. Extract Filters -> Data Source Filters -> Context Filters -> {FIXED} LOD.
2. If you want dimension filters to affect the baseline calculation, use {INCLUDE} or mark the filter as "Add to Context" (which turns the pill gray in Tableau).`,
        upvotes: 15,
        createdAt: '2026-11-05T09:10:00Z'
      }
    ],
    upvotes: 19,
    views: 98,
    createdAt: '2026-11-05T08:30:00Z',
    updatedAt: '2026-11-05T09:10:00Z'
  },
  {
    id: 'disc-03',
    title: 'Structuring an Analytics Portfolio Project: What hiring managers actually inspect',
    authorId: 'instructor-david-03',
    authorName: 'David Lin',
    authorRole: 'Curriculum Director',
    category: 'Portfolio Reviews',
    domainId: 'business-analytics-kpis',
    content: `When reviewing candidates for Data Analyst and Analytics Engineer positions, hiring managers spend less than 90 seconds on a portfolio project before deciding whether to interview.

Here is what they look for:
1. **The Business Hook**: Can you state the commercial problem in plain English without jargon?
2. **Data Hygiene**: Did you address dirty data, outliers, and edge cases, or did you assume the dataset was pristine?
3. **Actionable Recommendations**: Did you stop at charts, or did you quantify the dollar impact and specify 3 concrete business actions?
4. **Clean Code / Method**: Commented queries, sensible variable names, and clear visual layout.

Feel free to post links to your published portfolio drafts in this thread for community feedback!`,
    tags: ['Career', 'Portfolio', 'Hiring', 'DataAnalyst'],
    replies: [],
    upvotes: 38,
    views: 215,
    isPinned: true,
    createdAt: '2026-11-06T10:00:00Z',
    updatedAt: '2026-11-06T10:00:00Z'
  },
  {
    id: 'disc-04',
    title: 'Tukey Fences vs Z-Score: Which outlier detection method do you use for skewed revenue data?',
    authorId: 'mentor-priya-04',
    authorName: 'Priya Sharma',
    authorRole: 'Staff Statistician',
    category: 'Statistics & Mathematics',
    domainId: 'statistics-foundations',
    content: `In commercial financial data, transaction amounts almost always follow a log-normal or Pareto distribution (heavy right skew).

Using standard Z-scores ($|Z| > 3$) assumes an underlying normal Gaussian distribution. On heavy-tailed data, the sample mean and sample standard deviation are themselves inflated by extreme values, causing Z-scores to mask real anomalies!

Tukey's IQR method ($Q_1 - 1.5 \\times \\text{IQR}$ and $Q_3 + 1.5 \\times \\text{IQR}$) is non-parametric and resistant to extreme skew, making it far more reliable for e-commerce transactions.

What methods do you employ when analyzing transactional distributions?`,
    tags: ['Statistics', 'EDA', 'Outliers', 'DataScience'],
    replies: [
      {
        id: 'rep-04-1',
        discussionId: 'disc-04',
        authorId: 'user-demo-001',
        authorName: 'Alex Mercer',
        authorRole: 'Analyst',
        content: `I ran into this exact issue in Practice Arena Exercise #12! On raw e-commerce order amounts, Z-score missed 4 obvious high-value outliers because the standard deviation was huge. Once I logged the values (\`log(revenue)\`) or applied Tukey fences, the outlier boundaries were crystal clear.`,
        upvotes: 9,
        isAcceptedAnswer: true,
        createdAt: '2026-11-07T11:15:00Z'
      }
    ],
    upvotes: 21,
    views: 110,
    createdAt: '2026-11-07T08:00:00Z',
    updatedAt: '2026-11-07T11:15:00Z'
  }
];
