import { ProjectTemplate } from '../types/portfolio';

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'tmpl-excel-sales',
    title: 'Excel Sales & Revenue Analysis',
    domainId: 'spreadsheets-data-analysis',
    domainName: 'Spreadsheets & Data Analysis',
    projectType: 'spreadsheet',
    difficulty: 'Beginner',
    estimatedHours: 6,
    summary: 'Analyze multi-region sales performance, seasonal variance, and SKU profitability using pivot tables, dynamic arrays, and financial formulas.',
    problemStatement: 'A mid-market retail distributor experienced an 8% drop in gross margins over the last three quarters despite flat revenue, suggesting unfavorable product mix and unmonitored discounting.',
    businessContext: 'Executive leadership needs an audit of Q1-Q3 transaction logs across four sales territories to identify which product categories and sales reps are eroding net profit margins.',
    objectives: [
      'Clean and normalize raw transactional export data into a structured Excel table.',
      'Construct dynamic pivot tables aggregating revenue, cost of goods sold (COGS), and net margin by region and sales rep.',
      'Implement multi-condition formulas (SUMIFS, XLOOKUP, IF/AND) to calculate discount tiers and salesperson commissions.',
      'Produce an executive summary tab with KPI metric cards and conditional formatting highlighting margin erosion.'
    ],
    suggestedWorkflow: [
      'Data Cleansing: Remove trailing spaces, standardize date formatting, and resolve #N/A customer lookups.',
      'Calculated Columns: Add Net Revenue, COGS, Gross Margin %, and Discount Bracket fields.',
      'Pivot & Trend Modeling: Create pivot summaries for Territory vs Category and Month-over-Month growth.',
      'Visual Reporting: Design a 1-page executive dashboard with bar charts and margin waterfall breakdown.',
      'Recommendation Memo: Draft strategic pricing and discounting threshold rules for sales leadership.'
    ],
    expectedDeliverables: [
      'Cleaned Excel workbook (.xlsx) with separated Raw Data, Calculation, and Executive Summary sheets.',
      'Margin sensitivity analysis showing impact of capping rep discounts at 12%.',
      'Written business memo with 3 actionable recommendations for commercial management.'
    ],
    recommendedTools: ['Microsoft Excel / Google Sheets', 'Pivot Tables & Power Query', 'XLOOKUP / Dynamic Arrays'],
    sampleDatasetName: 'Global_Retail_Sales_2025_Q1-Q3.csv',
    starterMarkdown: {
      methodology: '### Data Methodology\n- Evaluated 14,200 transactional records spanning Jan 1 - Sep 30.\n- Audited column schema: `Order_ID`, `Order_Date`, `Customer_Segment`, `Territory`, `SKU`, `List_Price`, `Discount_Pct`, `Unit_Cost`, `Quantity`.\n- Filtered out test orders and verified mathematical integrity across `List_Price * (1 - Discount_Pct) * Quantity`.',
      analysisAndFindings: '### Key Analytical Findings\n1. **Discount Bleed**: The West territory accounted for 54% of all discounts exceeding 20%, resulting in a net margin of only 6.2% compared to the company benchmark of 18.5%.\n2. **Product Mix Distortion**: Category "Hardware Bundles" surged in unit volume by 32% but delivered negative marginal contribution due to recent supplier tariff increases.\n3. **Rep Variance**: Top 3 sales reps drove revenue targets by offering unauthorized discount concessions to enterprise accounts.',
      conclusionsAndRecommendations: '### Strategic Recommendations\n1. **Implement Automated Discount Approvals**: Cap sales rep discretionary discount authority at 10%; discounts between 10-18% require VP sign-off.\n2. **Renegotiate or Reprice Hardware Bundles**: Adjust bundle list price upward by 7.5% to offset supplier tariff inflation.\n3. **Restructure Commission Incentives**: Transition rep commissions from Gross Revenue to Gross Profit Dollar Contribution.'
    }
  },
  {
    id: 'tmpl-sql-business',
    title: 'SQL Business Analysis & Customer Retention',
    domainId: 'sql-relational-databases',
    domainName: 'SQL & Relational Databases',
    projectType: 'coding',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    summary: 'Query relational database schemas using CTEs, window functions, and cohort analysis to uncover subscription churn patterns.',
    problemStatement: 'A subscription SaaS platform is experiencing unexpected month-2 churn spikes following an onboarding UI revamp.',
    businessContext: 'Product management and growth teams require relational SQL queries to track user lifecycle progression, activation milestones, and churn probabilities across signup cohorts.',
    objectives: [
      'Write modular, performant SQL queries utilizing CTEs and Window Functions (LAG, LEAD, DENSE_RANK).',
      'Construct a monthly cohort retention matrix tracking user activity from Month 0 to Month 12.',
      'Identify onboarding events that strongly correlate with 90-day retention and lifetime customer value.',
      'Benchmark query execution plans and index recommendations for recurring reporting.'
    ],
    suggestedWorkflow: [
      'Schema Exploration: Inspect ERD mapping users, subscriptions, events, and billing transactions.',
      'Cohort Querying: Generate Month 0 baseline cohort sizes and join monthly activity logs.',
      'Feature Flag Analysis: Segment cohorts by users exposed to New vs Legacy onboarding experience.',
      'Retention Curve Construction: Output normalized retention percentages by monthly cohort.',
      'Synthesis & Delivery: Format SQL scripts with clear documentation and export summary cohort tables.'
    ],
    expectedDeliverables: [
      'Documented SQL script repository (.sql) containing clean CTEs and commented business logic.',
      'Monthly cohort retention heatmap dataset (CSV/Markdown table).',
      'Analytical briefing identifying the primary driver of month-2 churn divergence.'
    ],
    recommendedTools: ['PostgreSQL / DuckDB / SQLite', 'SQL Window Functions & CTEs', 'DBeaver / DataGrip'],
    sampleDatasetName: 'SaaS_User_Activity_Cohorts_2025.db',
    starterMarkdown: {
      methodology: '### SQL Architecture & Query Design\n- Utilized common table expressions (CTEs) to isolate user activation timestamps and subsequent active billing cycles.\n- Applied `DATE_TRUNC(\'month\', signup_date)` and `DENSE_RANK() OVER (PARTITION BY user_id ORDER BY activity_month)` to build longitudinal user activity vectors.',
      analysisAndFindings: '### Empirical Discoveries\n1. **Cohort Churn Spike**: Month 2 retention for the August cohort (onboarded on UI v2) dropped to 41.2% versus the 64.8% historical baseline.\n2. **Root Cause Identification**: Users who did not complete the "Connect Data Source" setup step within 48 hours had an 82% churn probability within 45 days.\n3. **Interface Friction**: Drop-off occurred at the OAuth token validation step on mobile web clients.',
      conclusionsAndRecommendations: '### Recommendations for Engineering & Product\n1. **Reinstate Assisted Token Handshake**: Add guided fallback OAuth flow for mobile Safari and Android users.\n2. **Trigger Automated In-App Nudge**: Dispatch targeted SMS/email guidance if a new user has not linked their data source within 18 hours.\n3. **Establish Daily Churn Telemetry**: Schedule a recurring materialized view tracking 7-day milestone completion.'
    }
  },
  {
    id: 'tmpl-python-eda',
    title: 'Python Exploratory Data Analysis & Anomaly Detection',
    domainId: 'python-programming',
    domainName: 'Python for Data Analysis',
    projectType: 'coding',
    difficulty: 'Intermediate',
    estimatedHours: 10,
    summary: 'Perform rigorous programmatic data cleaning, statistical distribution profiling, outlier detection, and multivariate correlations using Pandas and Seaborn.',
    problemStatement: 'Fintech transaction stream contains subtle fraudulent patterns and data anomalies that bypass traditional rule-based transaction filters.',
    businessContext: 'Risk and compliance teams need an automated EDA pipeline in Python that ingests transaction logs, handles missing data hygienically, detects multivariate anomalies, and flags suspicious velocity clusters.',
    objectives: [
      'Ingest and profile dirty raw datasets using Pandas, auditing datatypes and memory footprint.',
      'Apply statistical outlier detection algorithms (IQR fences, Z-scores, and Isolation Forest fundamentals).',
      'Compute correlation matrices and address multicollinearity and skewed distributions.',
      'Generate publication-quality statistical charts using Matplotlib and Seaborn.'
    ],
    suggestedWorkflow: [
      'Data Ingestion: Load dataset, inspect `.info()`, `.describe()`, and null distribution.',
      'Data Sanitization: Impute missing values with domain rationale; handle date/time features.',
      'Univariate & Bivariate EDA: Plot histograms, KDE curves, and boxplots across transaction amounts.',
      'Anomaly Scoring: Flag transactions exceeding 3 standard deviations within rolling 1-hour user windows.',
      'Summary Notebook: Assemble findings into an annotated Jupyter / Python analytical notebook.'
    ],
    expectedDeliverables: [
      'Self-contained, reproducible Python script or notebook (.py / .ipynb).',
      'Statistical distribution plots and correlation heatmaps.',
      'High-risk transaction cluster report with actionable mitigation rules.'
    ],
    recommendedTools: ['Python 3.10+', 'Pandas & NumPy', 'Matplotlib & Seaborn', 'Scipy / Scikit-learn'],
    sampleDatasetName: 'Fintech_Synthetic_Transactions_100k.csv',
    starterMarkdown: {
      methodology: '### Data Pipeline & Preprocessing\n- Ingested 100,000 transaction events.\n- Handled missing billing postal codes using geographic mode imputation.\n- Extracted temporal features: `hour_of_day`, `day_of_week`, `is_weekend`, `seconds_since_last_txn`.',
      analysisAndFindings: '### Statistical Observations\n1. **Heavy-Tailed Skew**: Transaction amount exhibits severe right skew (skewness = 4.82, kurtosis = 28.1).\n2. **Micro-Transaction Velocity**: Detected a distinct cluster of 1,240 accounts executing 8-15 rapid micro-transactions ($0.50 - $1.99) within 120 seconds between 02:00 and 04:00 UTC.\n3. **Feature Correlation**: Strong positive correlation ($r = 0.74$) between rapid velocity bursts and subsequent chargeback filings within 14 days.',
      conclusionsAndRecommendations: '### Risk Mitigation Directives\n1. **Implement Dynamic Velocity Throttling**: Freeze outbound transfers when more than 5 micro-transactions occur within 3 minutes.\n2. **Mandate Biometric Step-Up Challenge**: Require 2FA verification for transactions originating during non-standard hours from novel IP subnets.\n3. **Integrate Real-Time Anomaly Scoring**: Deploy automated Python pipeline to scoring queue with sub-50ms latency.'
    }
  },
  {
    id: 'tmpl-customer-segmentation',
    title: 'Customer Segmentation & RFM Value Clustering',
    domainId: 'exploratory-data-analysis',
    domainName: 'Exploratory Data Analysis',
    projectType: 'statistical_study',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    summary: 'Segment customer bases using Recency, Frequency, Monetary (RFM) scoring and behavioral clustering to drive targeted retention.',
    problemStatement: 'E-commerce retailer treats all 85,000 active customers with identical blast email promotions, yielding declining open rates (11%) and wasted promotional spend.',
    businessContext: 'Marketing leadership needs a data-driven customer segmentation framework to identify "Champions", "At Risk", "Promising", and "Hibernating" customer cohorts for personalized lifecycle campaigns.',
    objectives: [
      'Calculate individual customer RFM metrics from transactional order history.',
      'Establish quintile scoring thresholds (1-5 scale) for Recency, Frequency, and Monetary dimensions.',
      'Cluster customers into actionable business personas based on RFM score combinations.',
      'Model projected revenue uplift from migrating "At Risk" customers to "Loyal" status.'
    ],
    suggestedWorkflow: [
      'Transaction Aggregation: Group orders by Customer ID to compute Max Date (Recency), Count (Frequency), and Sum (Monetary).',
      'Scoring Quintiles: Apply rank-based percentiles to distribute customers across 1-5 bins.',
      'Segment Mapping: Code business logic assigning segment names based on RFM matrix.',
      'Segment Profiling: Calculate average basket size, repurchase interval, and total revenue contribution per segment.',
      'Strategic Playbook: Build specific email and discount campaigns for each persona.'
    ],
    expectedDeliverables: [
      'Customer RFM database export with assigned segments and quintile scores.',
      'Visual breakdown of customer count vs revenue contribution by segment.',
      'Campaign playbook with specific retention offers tailored to top 4 segments.'
    ],
    recommendedTools: ['Python / R / SQL', 'RFM Scoring Models', 'Tableau / Looker Studio'],
    sampleDatasetName: 'Ecommerce_Customer_Orders_2Year.csv',
    starterMarkdown: {
      methodology: '### RFM Segmentation Architecture\n- Analyzed 24 months of order history across 85,410 unique customer IDs.\n- Reference audit date set to November 1, 2025.\n- Evaluated Recency (days since last purchase), Frequency (lifetime order count), and Monetary value (lifetime net spend).',
      analysisAndFindings: '### Segment Discovery Breakdown\n1. **The 80/20 Reality**: "Champions" and "Loyal Customers" represent only 12.4% of the customer base but generate 61.8% of total gross profit.\n2. **At Risk Cohort**: 18,200 previously high-value customers have not purchased in over 120 days (Recency score 1 or 2, Monetary score 4 or 5).\n3. **Discount Seekers**: Segment with Frequency > 6 but Monetary < $150 only buys during seasonal clearance sales with zero margin.',
      conclusionsAndRecommendations: '### Lifecycle Marketing Directives\n1. **VIP Loyalty Concierge for Champions**: Provide early product access and free express shipping rather than margin-diluting discount codes.\n2. **Win-Back Campaign for "At Risk"**: Trigger automated dynamic email sequence offering a personalized restock bundle on day 90.\n3. **De-prioritize Low-Value Bargain Hunters**: Exclude low-margin discount seekers from paid retargeting ad campaigns to conserve ad budget.'
    }
  },
  {
    id: 'tmpl-bi-dashboard',
    title: 'Executive Business Intelligence Dashboard',
    domainId: 'data-visualization-storytelling',
    domainName: 'Data Visualization & Storytelling',
    projectType: 'bi_dashboard',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    summary: 'Design an interactive, human-centered executive dashboard translating complex operational telemetry into clear business decisions.',
    problemStatement: 'C-suite leadership receives 14 disparate weekly CSV reports with conflicting metric definitions and zero real-time drill-down visibility.',
    businessContext: 'The executive committee needs a unified, intuitive business intelligence dashboard displaying high-level corporate KPIs (ARR, NRR, CAC Payback, Gross Margin) with hierarchical drill-downs by department and region.',
    objectives: [
      'Consolidate disjointed reporting streams into a unified dimensional star-schema data model.',
      'Design an information hierarchy that prioritizes primary KPIs at the top with secondary diagnostic metrics below.',
      'Implement interactive cross-filtering, date range slicing, and domain drill-down paths.',
      'Enforce visual integrity principles (zero-baselines on bar charts, accessible palettes, clear benchmark targets).'
    ],
    suggestedWorkflow: [
      'Stakeholder Discovery: Interview VP of Finance, Sales, and Ops to codify definitive KPI definitions.',
      'Data Modeling: Construct dimensional tables (Date Dim, Region Dim, Metric Fact Table).',
      'Wireframing: Draft layout wireframes adhering to the 5-second executive comprehension rule.',
      'Dashboard Build: Develop dashboard with reactive cards, sparklines, and breakdown charts.',
      'User Testing: Validate drill-down performance and gather feedback from department managers.'
    ],
    expectedDeliverables: [
      'Interactive dashboard file (.twbx, .pbix, or web embed link).',
      'Data dictionary defining every metric, calculation formula, and update cadence.',
      'Executive dashboard user guide outlining drill-down paths and anomaly response protocols.'
    ],
    recommendedTools: ['Power BI / Tableau / Looker Studio', 'DAX / Calculated Fields', 'Figma Wireframing'],
    sampleDatasetName: 'Enterprise_Operations_KPI_Monthly.csv',
    starterMarkdown: {
      methodology: '### Dashboard Architecture & Human Factors\n- Structured around the classic "Executive Summary -> Regional Diagnostics -> Operational Details" hierarchy.\n- Color coding strictly reserved for performance status: Emerald for target exceeded (+5%), Amber for watch range (±5%), Crimson for off-track (>5% deficit).',
      analysisAndFindings: '### Operational Insights Revealed via Dashboard\n1. **Departmental Variance**: Customer Success efficiency improved by 22% quarter-over-quarter, whereas Sales Development cost per qualified lead rose by 34%.\n2. **Geographic Concentration**: APAC delivered 78% of new pipeline growth while EMEA contracted by 6%.\n3. **Drill-Down Impact**: Identifying EMEA underperformance directly uncovered 3 open enterprise sales rep vacancies that remained unstaffed for 5 months.',
      conclusionsAndRecommendations: '### Operational Directives\n1. **Standardize Corporate KPI Governance**: Enforce the unified data model as the sole source of truth for all board meetings.\n2. **Resource Reallocation**: Shift 15% of underutilized EMEA marketing spend into the high-velocity APAC channel.\n3. **Automate Anomaly Alerts**: Configure automated Slack notifications when any regional pipeline drops below 85% of monthly target.'
    }
  },
  {
    id: 'tmpl-statistical-analysis',
    title: 'Statistical Hypothesis Testing & A/B Experiment Analysis',
    domainId: 'statistics-foundations',
    domainName: 'Statistics Foundations for Data Analysis',
    projectType: 'statistical_study',
    difficulty: 'Advanced',
    estimatedHours: 8,
    summary: 'Evaluate product experimentation results using rigorous two-sample t-tests, Mann-Whitney U, sample size sizing, and false discovery corrections.',
    problemStatement: 'Product team claims a new checkout flow increased conversion by 1.8%, but finance questions whether the result is statistically significant or driven by random sample variance.',
    businessContext: 'The growth team ran a 14-day A/B experiment with 42,000 users. Management requires rigorous statistical testing to verify whether to roll out the new flow company-wide.',
    objectives: [
      'Verify experiment pre-conditions: sample ratio mismatch (SRM) checks and baseline balance.',
      'Formulate null and alternative hypotheses for conversion rate and average revenue per user (ARPU).',
      'Perform appropriate statistical tests (Two-proportion Z-test, Welch\'s t-test, and bootstrap confidence intervals).',
      'Calculate statistical power ($1 - \\beta$), effect sizes (Cohen\'s $d$), and minimum detectable effect (MDE).'
    ],
    suggestedWorkflow: [
      'Data Integrity & SRM Check: Confirm traffic was divided exactly 50/50 without selection bias.',
      'Distribution Normality Assessment: Check normality and skewness of revenue per user.',
      'Hypothesis Testing: Execute two-sided hypothesis tests at $\\alpha = 0.05$ significance level.',
      'Confidence Interval Modeling: Compute 95% confidence interval for absolute and relative lift.',
      'Decision Memo: Formulate definitive go/no-go recommendation based on risk vs return.'
    ],
    expectedDeliverables: [
      'Comprehensive statistical analysis script (Python/R) with commented mathematical steps.',
      'Visual summary of conversion distribution curves and confidence intervals.',
      'Executive decision memo with risk-weighted financial impact projections.'
    ],
    recommendedTools: ['Python (SciPy, Statsmodels)', 'R (stats, pwr)', 'Jupyter Notebook'],
    sampleDatasetName: 'Checkout_Experiment_Variant_AB_42k.csv',
    starterMarkdown: {
      methodology: '### Experimental Design & Verification\n- Experiment ran for 14 complete days (accounting for weekend seasonality cycles).\n- Sample sizes: Control $N_A = 21,048$, Variant $N_B = 20,952$.\n- Sample Ratio Mismatch (SRM) Chi-Square test yielded $p = 0.64$, confirming zero allocation bias.\n- Significance threshold preset to $\\alpha = 0.05$ with $80\\%$ target statistical power.',
      analysisAndFindings: '### Hypothesis Test Results\n1. **Conversion Rate Metric**: Control conversion was $3.42\\%$; Variant conversion reached $3.98\\%$.\n   - Absolute Lift: $+0.56\\%$ percentage points.\n   - Relative Lift: $+16.37\\%$.\n   - Two-Proportion Z-Test: $z = 3.12$, $p$-value $= 0.0018$ (statistically significant at $\\alpha = 0.05$).\n2. **Revenue Per User (ARPU)**: Control Mean = $\\$4.12$, Variant Mean = $\\$4.81$.\n   - Welch\'s Two-Sample t-test: $t = 2.45$, $p$-value $= 0.014$, 95% CI: $[\\$0.14, \\$1.24]$.\n3. **Power Verification**: Post-hoc statistical power reached $92.4\\%$, ruling out Type II error.',
      conclusionsAndRecommendations: '### Executive Recommendation\n1. **Full Rollout Authorized**: Deploy Variant B to $100\\%$ of global web traffic immediately.\n2. **Financial Upside**: Projected incremental annual recurring gross margin of $\\$1.42\\text{M} \\pm \\$280\\text{K}$.\n3. **Monitoring Guardrail**: Track refund rates for 30 days post-launch to ensure checkout speed did not induce unintended accidental purchases.'
    }
  },
  {
    id: 'tmpl-marketing-attribution',
    title: 'Marketing Performance & Multi-Touch Attribution Analysis',
    domainId: 'business-analytics-kpis',
    domainName: 'Business Analytics & Commercial KPIs',
    projectType: 'business_case',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    summary: 'Evaluate customer acquisition cost (CAC), return on ad spend (ROAS), and touchpoint attribution models across paid social, search, and organic channels.',
    problemStatement: 'Marketing is deploying $120,000 monthly ad spend across 5 channels, but Last-Touch attribution unfairly credits branded search while ignoring upper-funnel video ads.',
    businessContext: 'The Chief Marketing Officer needs a multi-touch attribution analysis (First-Touch, Last-Touch, Linear, and Position-Based 40/40/20) to reallocate the annual marketing budget toward channels that genuinely drive net-new customer discovery.',
    objectives: [
      'Ingest multi-session customer journey logs and reconstruct touchpoint sequence paths.',
      'Model and compare 4 distinct attribution algorithms across 6 acquisition channels.',
      'Calculate true blended CAC and Channel-Specific CAC Payback periods.',
      'Recommend an optimal budget reallocation model to maximize overall portfolio ROAS.'
    ],
    suggestedWorkflow: [
      'Touchpoint Sessionization: Aggregate user ad clicks, email interactions, and organic visits by user journey.',
      'Attribution Modeling: Programmatically assign fractional conversion credit based on position.',
      'Efficiency Benchmarking: Divide total ad spend by attributed conversions per channel.',
      'Sensitivity Analysis: Simulate revenue outcome if 25% of underperforming channel budget is moved to top-funnel winners.',
      'Presentation Deck: Prepare visual slides comparing attribution models side-by-side.'
    ],
    expectedDeliverables: [
      'Attribution comparison dataset showing conversion credit variance by channel.',
      'ROAS & CAC efficiency matrix by acquisition channel.',
      'Budget reallocation matrix with forecasted revenue expansion.'
    ],
    recommendedTools: ['SQL / Python', 'Google Analytics 4 / BigQuery', 'Tableau / Excel'],
    sampleDatasetName: 'Multi_Channel_Customer_Journeys_2025.csv',
    starterMarkdown: {
      methodology: '### Attribution Frameworks Evaluated\n- Evaluated 34,000 converted customer journeys over 180 days.\n- Contrasted Last-Touch (100% to final click) with Position-Based U-Shaped (40% First Touch, 40% Last Touch, 20% distributed across intermediate nurturing clicks).',
      analysisAndFindings: '### Channel Attribution Discrepancies\n1. **The Branded Search Mirage**: Last-touch credited Paid Branded Search with 48% of total revenue ($1.2M), but position-based attribution revealed 76% of these customers first discovered the brand via YouTube Product Demos.\n2. **Under-Credited Upper Funnel**: Paid Social (Meta/TikTok) CAC appeared artificially high ($142) under Last-Touch, but dropped to $58 when credited for initial customer introduction.\n3. **Affiliate Channel Fatigue**: Affiliate marketing drove high coupon-redemption volume but generated a 64% 60-day customer churn rate.',
      conclusionsAndRecommendations: '### Budget Reallocation Strategy\n1. **Reallocate $35,000 Monthly**: Shift $35K from Over-Funded Branded Search into Top-Funnel Video & Paid Social Discovery.\n2. **Renegotiate Affiliate Terms**: Transition affiliate payout structure from one-off signup bounty to 90-day active retention milestone payouts.\n3. **Adopt Position-Based KPI Standards**: Mandate Position-Based ROAS as the official departmental reporting standard for all performance marketing reviews.'
    }
  },
  {
    id: 'tmpl-business-case',
    title: 'Operational Business Case Study & Process Optimization',
    domainId: 'dataset-investigation-data-hygiene',
    domainName: 'Dataset Investigation & Data Hygiene',
    projectType: 'business_case',
    difficulty: 'Advanced',
    estimatedHours: 10,
    summary: 'Investigate operational bottlenecks, fulfillment warehouse SLA failures, and inventory carrying cost overruns to build an executive ROI justification case.',
    problemStatement: 'Fulfillment operations are missing the 24-hour dispatch SLA on 22% of orders, triggering $480,000 in customer support credits and carrier expedited delivery surcharges.',
    businessContext: 'The Chief Operating Officer requires a forensic operational investigation to pinpoint whether warehouse labor scheduling, packing station bottlenecks, or inventory misplacement is the core cause of delivery delays, accompanied by an investment ROI proposal.',
    objectives: [
      'Trace order journey timestamps from checkout confirmation to warehouse dock departure.',
      'Conduct Root-Cause Analysis (Fishbone / 5-Whys framework backed by operational telemetry data).',
      'Quantify the total cost of delay (carrier surcharges, support tickets, lost repeat purchase value).',
      'Build a discounted cash flow (DCF) ROI model for deploying an automated bin-picking sorting station.'
    ],
    suggestedWorkflow: [
      'Process Mapping: Map physical warehouse steps: Picking -> Batching -> Packing -> Labeling -> Carrier Loading.',
      'Latency Profiling: Calculate median and 95th percentile dwell time at each operational stage.',
      'Correlation Analysis: Correlate delays with order complexity (single-item vs multi-SKU bins) and shift timing.',
      'Financial Modeling: Model capex/opex of sorting automation vs annual savings in support credits and carrier surcharges.',
      'Executive Case Study: Draft full business case study with executive summary, findings, and capital investment proposal.'
    ],
    expectedDeliverables: [
      'Comprehensive operational case study document (.md or PDF format).',
      'Stage-by-stage latency analysis dataset and bottleneck Pareto chart.',
      '3-year financial ROI and payback period investment model.'
    ],
    recommendedTools: ['Process Telemetry Logs', 'Python / Excel DCF Modeling', 'Executive Presentation Memos'],
    sampleDatasetName: 'Warehouse_Fulfillment_Telemetry_2025.csv',
    starterMarkdown: {
      methodology: '### Operational Process Telemetry\n- Audited 185,000 warehouse order timestamps across 3 distribution centers (East, Central, West).\n- Tracked stage durations: $T_1$ (Pick Time), $T_2$ (Packing Dwell), $T_3$ (Carrier Scan Latency).\n- Segmented orders into Single-Line Orders (62%) and Complex Multi-SKU Orders (38%).',
      analysisAndFindings: '### Bottleneck Root-Cause Findings\n1. **The Multi-SKU Packing Chokepoint**: 84% of all SLA breaches occurred during the packing stage of Multi-SKU orders ($T_2$), where manual collation caused an average delay of 14.2 hours.\n2. **Shift Handoff Latency**: Orders queued between 15:00 and 17:00 (during afternoon shift handoff) sat idle for an average of 3.8 hours before being assigned to a packer.\n3. **Financial Hemorrhage**: Expedited carrier upgrade costs ($12.50 per late parcel) totaled $38,000 monthly, while support refunds totaled an additional $22,000.',
      conclusionsAndRecommendations: '### Capital Investment & Operational Directives\n1. **Deploy Staggered Shift Handoffs**: Eliminate the 15:00-17:00 idle dead-zone by staggering floor worker meal and shift transitions by 45 minutes.\n2. **Procure Automated Multi-SKU Sorting Conveyor**: Invest $240,000 in automated batching conveyors, projected to reduce multi-SKU packing dwell time from 14.2 hours to 1.8 hours.\n3. **ROI & Payback Justification**: Projected annual savings of $540,000 yield a rapid payback period of 5.3 months and a 3-year Net Present Value (NPV) of $1.18M at an 8% discount rate.'
    }
  }
];
