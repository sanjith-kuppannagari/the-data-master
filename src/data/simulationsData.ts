import { BusinessSimulation } from '../types/challenge';

export const BUSINESS_SIMULATIONS_DATA: BusinessSimulation[] = [
  // ============================================================================
  // 1. RETAIL SALES DECLINE INVESTIGATION
  // ============================================================================
  {
    id: 'sim-01',
    slug: 'retail-sales-decline',
    title: 'Retail Sales Decline & Margin Compression Investigation',
    category: 'Retail & E-Commerce',
    difficulty: 'intermediate',
    xpReward: 140,
    estimatedMinutes: 45,
    businessBackground:
      'Apex Department Stores experienced an abrupt 18% quarter-over-quarter gross profit collapse across 4 regional territories in Q2. Store managers blame online competitors, but Regional Directors claim foot traffic was stable.',
    businessObjective:
      'Pinpoint the exact driver of the margin drop (basket size vs unit margins vs discount depth vs return rates) and propose a merchandise policy to recover $850,000 in Q3 gross margin.',
    businessProblem:
      'Revenue remained relatively flat (-2.1%), yet Gross Margin plunged from 42.5% to 34.8%. The executive team needs an unbiased decomposition of transaction logs.',
    availableInformation:
      'Q2 Store POS logs across North, South, East, and West branches; product category margins; promo code redemption rates; and store return frequencies.',
    datasetName: 'apex_store_q2_telemetry.csv',
    datasetDescription: 'Quarterly store performance records across 4 territories and 3 primary merchandise categories.',
    datasetRows: [
      { territory: 'North', category: 'Apparel', q1_margin_pct: 48.0, q2_margin_pct: 32.5, promo_share_pct: 46.0, return_rate_pct: 8.2 },
      { territory: 'North', category: 'Electronics', q1_margin_pct: 28.5, q2_margin_pct: 27.8, promo_share_pct: 12.0, return_rate_pct: 3.1 },
      { territory: 'South', category: 'Apparel', q1_margin_pct: 46.5, q2_margin_pct: 45.2, promo_share_pct: 14.0, return_rate_pct: 4.5 },
      { territory: 'South', category: 'Home Goods', q1_margin_pct: 38.0, q2_margin_pct: 37.1, promo_share_pct: 10.0, return_rate_pct: 2.8 },
      { territory: 'East', category: 'Apparel', q1_margin_pct: 47.0, q2_margin_pct: 31.0, promo_share_pct: 52.0, return_rate_pct: 9.1 },
      { territory: 'West', category: 'Apparel', q1_margin_pct: 45.0, q2_margin_pct: 44.0, promo_share_pct: 15.0, return_rate_pct: 4.0 },
    ],
    metricsSummary: {
      'Total Q2 Sales': '$18,420,000',
      'Blended Gross Margin Q1': '42.5%',
      'Blended Gross Margin Q2': '34.8%',
      'Margin Erosion': '-7.7 percentage points',
      'North & East Apparel Promo Share': '49.0% (vs 14.5% baseline)',
    },
    investigationTasks: [
      'Compare Q1 vs Q2 gross margin percentages across all four territories.',
      'Correlate the regional margin erosion with promotional discount coupon penetration.',
      'Evaluate whether product returns in discounted apparel compounded net margin loss.',
    ],
    decisionQuestions: [
      {
        id: 'q1-1',
        question: 'Which specific territory and category suffered the severe margin collapse?',
        objective: 'Isolate root cause territory and merchandise department.',
        options: [
          'South and West Home Goods',
          'North and East Apparel departments (margins dropped ~16 percentage points)',
          'All Electronics departments across all branches',
          'South Apparel only',
        ],
        correctOptionIndex: 1,
        rationale: 'North Apparel fell from 48.0% to 32.5% and East Apparel fell from 47.0% to 31.0%, explaining >80% of total company profit erosion.',
      },
      {
        id: 'q1-2',
        question: 'What behavioral operational practice caused the margin collapse in North and East?',
        objective: 'Connect quantitative data to store management decisions.',
        options: [
          'Store theft and shrinkage increased by 500%',
          'Store managers stacked unauthorized 30% local coupons on top of 20% clearance apparel sales (promo share ~50%)',
          'Suppliers doubled wholesale prices overnight',
          'Customer footfall dropped to zero',
        ],
        correctOptionIndex: 1,
        rationale: 'North and East exhibited a 46%-52% promo share, indicating heavy discount stacking that cut Apparel margins nearly in half.',
      },
    ],
    recommendationPrompt:
      'Draft an executive memo to the Chief Commercial Officer recommending policy changes to halt coupon stacking, protect baseline gross margin, and establish promo guardrails in Q3.',
    rubricCriteria: {
      analyticalAccuracy: 'Identify North and East Apparel as the source of the 16 percentage point drop.',
      evidenceInterpretation: 'Cite the ~50% promo share and elevated return rates (8-9%) on heavily discounted items.',
      actionableFeasibility: 'Propose strict POS rule preventing discount code stacking and establishing a 40% floor margin.',
      essentialKeywords: ['apparel', 'north', 'east', 'promo share', 'discount stacking', 'floor margin', 'gross profit'],
    },
    solutionExplanation:
      'The margin collapse was entirely driven by unauthorized promotional discounting in the North and East Apparel departments. Discretionary manager coupons were stacked on top of clearance prices, inflating unit volumes but eroding margins from 48% to 31%. Introducing automated POS floor margin guardrails halts the leakage.',
  },

  // ============================================================================
  // 2. B2B SAAS CUSTOMER CHURN DYNAMICS
  // ============================================================================
  {
    id: 'sim-02',
    slug: 'saas-customer-churn-dynamics',
    title: 'B2B SaaS Subscription Churn & Cohort Retention Diagnostics',
    category: 'Product & SaaS Analytics',
    difficulty: 'advanced',
    xpReward: 160,
    estimatedMinutes: 50,
    businessBackground:
      'CloudPulse SaaS witnessed annual Net Revenue Retention (NRR) slip from 114% to 92% over 6 months. Customer Success insists churn is uniform, but product analytics telemetry suggests an onboarding drop-off.',
    businessObjective:
      'Identify the critical feature activation milestone that separates retained from churned accounts and redesign the customer onboarding journey.',
    businessProblem:
      'Gross customer churn spiked to 2.8% monthly among accounts with under 15 active users, while Enterprise accounts (>50 users) retained at 98%.',
    availableInformation:
      '1,200 subscription accounts with MRR, seat utilization, support tickets, feature adoption timestamps, and 12-month churn status.',
    datasetName: 'cloudpulse_churn_telemetry.csv',
    datasetDescription: 'Account-level usage metrics and retention outcomes.',
    datasetRows: [
      { tier: 'Starter', accounts: 450, active_seat_util: 0.28, webhook_configured: 0.12, churn_rate_12m: 0.38, avg_mrr: 350 },
      { tier: 'Growth', accounts: 520, active_seat_util: 0.64, webhook_configured: 0.45, churn_rate_12m: 0.18, avg_mrr: 1100 },
      { tier: 'Enterprise', accounts: 230, active_seat_util: 0.88, webhook_configured: 0.89, churn_rate_12m: 0.04, avg_mrr: 5200 },
    ],
    metricsSummary: {
      'Total ARR': '$24,600,000',
      'Net Revenue Retention': '92% (down from 114%)',
      'Starter Churn Rate': '38% annually',
      'Enterprise Churn Rate': '4% annually',
      'Webhook Configured Retention Lift': '+34 percentage points',
    },
    investigationTasks: [
      'Examine retention differences between Starter, Growth, and Enterprise tiers.',
      'Evaluate seat utilization vs churn rate correlation.',
      'Quantify the retention premium of accounts that configured automated webhooks in their first 14 days.',
    ],
    decisionQuestions: [
      {
        id: 'q2-1',
        question: 'Which metric shows the strongest protective correlation against customer cancellation?',
        objective: 'Identify high-leverage product engagement milestones.',
        options: [
          'Account age in months',
          'Active seat utilization above 60% and webhook/API integration within 14 days',
          'Company headquarters geographic location',
          'Whether the customer paid monthly or via check',
        ],
        correctOptionIndex: 1,
        rationale: 'Accounts with active seat utilization >60% and webhook setup churn at only 4-10% compared to 38% for unintegrated accounts.',
      },
    ],
    recommendationPrompt:
      'Write a strategy brief for the VP of Customer Success outlining an automated 14-day onboarding playbook focused on seat invites and webhook configuration.',
    rubricCriteria: {
      analyticalAccuracy: 'Identify low seat utilization (28%) and missing integrations as key churn predictors.',
      evidenceInterpretation: 'Contrast the 38% Starter churn with the 4% Enterprise churn.',
      actionableFeasibility: 'Design an automated email & in-app concierge sprint to drive webhook setup by Day 10.',
      essentialKeywords: ['seat utilization', 'webhook', 'starter', 'onboarding', 'activation', 'retention', 'nrr'],
    },
    solutionExplanation:
      'Churn is heavily concentrated in the Starter tier where 72% of seats sit unused and 88% never integrate webhooks. Making workflow integration the core onboarding milestone converts passive buyers into sticky power users.',
  },

  // ============================================================================
  // 3. OMNICHANNEL MARKETING FUNNEL DECAY
  // ============================================================================
  {
    id: 'sim-03',
    slug: 'marketing-conversion-funnel-decay',
    title: 'Omnichannel Marketing Funnel Decay & Attribution Reallocation',
    category: 'Marketing Analytics',
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 40,
    businessBackground:
      'Blended Customer Acquisition Cost (CAC) inflated from $380 to $690 over two quarters while lead conversion rates plummeted from 3.8% to 1.9%. The CMO needs to know which paid acquisition channels to cut.',
    businessObjective:
      'Reallocate $150,000 in monthly ad budget from failing display channels to high-intent search and organic nurture.',
    businessProblem:
      'Ad spend increased by 40% but total monthly new customers remained static at ~210 acquisitions.',
    availableInformation:
      'Campaign performance logs across Google Search, LinkedIn Ads, Display Retargeting, and Tech Webinars.',
    datasetName: 'campaign_funnel_attribution.csv',
    datasetDescription: 'Spend, clicks, conversions, and CAC across marketing channels.',
    datasetRows: [
      { channel: 'Paid Search', spend: 45000, clicks: 12000, conversions: 90, cac: 500, ltv_est: 2800 },
      { channel: 'LinkedIn Ads', spend: 60000, clicks: 6500, conversions: 75, cac: 800, ltv_est: 3400 },
      { channel: 'Display Retargeting', spend: 35000, clicks: 28000, conversions: 12, cac: 2916, ltv_est: 1800 },
      { channel: 'Tech Webinars', spend: 10000, clicks: 1800, conversions: 33, cac: 303, ltv_est: 3200 },
    ],
    metricsSummary: {
      'Total Monthly Ad Spend': '$150,000',
      'New Customers': '210',
      'Blended CAC': '$714.28',
      'Display Retargeting CAC': '$2,916.67 (exceeds $1,800 LTV!)',
      'Webinar CAC': '$303.03 (10.5x LTV:CAC)',
    },
    investigationTasks: [
      'Compare unit economics (CAC vs LTV) across all 4 acquisition channels.',
      'Isolate the negative-ROI channel responsible for CAC inflation.',
      'Calculate potential customer volume gain by shifting display budget into webinars and search.',
    ],
    decisionQuestions: [
      {
        id: 'q3-1',
        question: 'Which channel exhibits severely underwater unit economics where CAC exceeds customer LTV?',
        objective: 'Identify capital-destructive marketing spend.',
        options: [
          'Tech Webinars (CAC $303, LTV $3,200)',
          'Paid Search (CAC $500, LTV $2,800)',
          'Display Retargeting (CAC $2,916 exceeds LTV $1,800)',
          'LinkedIn Ads (CAC $800, LTV $3,400)',
        ],
        correctOptionIndex: 2,
        rationale: 'Display Retargeting spent $35,000 for only 12 conversions (CAC $2,916), resulting in an immediate -$1,116 loss per customer acquired.',
      },
    ],
    recommendationPrompt:
      'Draft a budget reallocation proposal recommending eliminating Display Retargeting and redirecting funds toward Webinars and Search.',
    rubricCriteria: {
      analyticalAccuracy: 'Identify Display Retargeting CAC of $2,916 exceeding the $1,800 LTV.',
      evidenceInterpretation: 'Highlight Tech Webinars as the most efficient channel ($303 CAC, 10.5x LTV).',
      actionableFeasibility: 'Provide exact budget reallocation dollar amounts to increase acquisitions within current spend.',
      essentialKeywords: ['display retargeting', 'cac', 'ltv', 'webinars', 'paid search', 'reallocation', 'unit economics'],
    },
    solutionExplanation:
      'Display Retargeting burned $35,000/month for 12 low-intent conversions, heavily inflating blended CAC. Eliminating Display and shifting $20k to Search and $15k to Webinars increases monthly acquisitions from 210 to 325 at no additional cost.',
  },

  // ============================================================================
  // 4. RETAIL WAREHOUSE EXCESS INVENTORY & BOTTLENECKS
  // ============================================================================
  {
    id: 'sim-04',
    slug: 'warehouse-excess-inventory-bottlenecks',
    title: 'Warehouse Capital Lockup & Stockout Optimization',
    category: 'Supply Chain & Operations',
    difficulty: 'intermediate',
    xpReward: 135,
    estimatedMinutes: 45,
    businessBackground:
      'OmniLogistics has $4.2M in capital trapped in stagnant slow-moving inventory, while fast-moving SKUs experience a 14% stockout rate, causing $320,000 in lost weekly orders.',
    businessObjective:
      'Formulate an inventory liquidation schedule and recalculate reorder points (ROP) and safety stock to achieve 98% on-time fulfillment.',
    businessProblem:
      'Carrying costs rose 22% due to excess pallet storage fees in third-party warehouses.',
    availableInformation:
      'SKU-level inventory logs: forward days on hand, lead times, daily demand, holding cost per pallet, and historical stockout frequency.',
    datasetName: 'inventory_sku_velocity.csv',
    datasetDescription: 'Velocity, stock levels, and supplier lead times for top inventory clusters.',
    datasetRows: [
      { cluster: 'High-Demand Electronics', sku_count: 85, days_on_hand: 8, stockout_rate: 0.14, holding_cost_mo: 12000 },
      { cluster: 'Seasonal Home Decor', sku_count: 320, days_on_hand: 145, stockout_rate: 0.01, holding_cost_mo: 68000 },
      { cluster: 'Core Office Furniture', sku_count: 140, days_on_hand: 32, stockout_rate: 0.03, holding_cost_mo: 24000 },
    ],
    metricsSummary: {
      'Total Trapped Capital': '$4,200,000',
      'Seasonal Home Decor Days on Hand': '145 days (Ideal: 35 days)',
      'Lost Weekly Orders from Electronics Stockouts': '$320,000',
      'Monthly Excess Holding Fees': '$68,000',
    },
    investigationTasks: [
      'Contrast days on hand between Seasonal Decor and High-Demand Electronics.',
      'Quantify the holding cost penalty of the 145-day inventory glut.',
      'Formulate a clearance markdown plan to liquidate 60% of seasonal decor within 30 days.',
    ],
    decisionQuestions: [
      {
        id: 'q4-1',
        question: 'What is the immediate priority to resolve the warehouse cash flow bottleneck?',
        objective: 'Prioritize inventory capital recovery.',
        options: [
          'Build another warehouse building at a cost of $5M',
          'Execute a 25-35% clearance markdown on Seasonal Decor to free up warehouse space and cash, while expediting reorders for Electronics',
          'Stop selling High-Demand Electronics completely',
          'Increase minimum order quantities on slow-moving decor items',
        ],
        correctOptionIndex: 1,
        rationale: 'Liquidating 145-day decor clears storage fees and unlocks capital to fund safety stock for High-Demand Electronics.',
      },
    ],
    recommendationPrompt:
      'Outline an operational turnaround memo balancing promotional markdown liquidation with dynamic safety stock replenishment.',
    rubricCriteria: {
      analyticalAccuracy: 'Identify the 145 days on hand in decor vs 8 days in electronics.',
      evidenceInterpretation: 'Quantify the $68k monthly holding fee waste vs $320k lost weekly stockout orders.',
      actionableFeasibility: 'Specify markdown percentage and target replenishment cadence.',
      essentialKeywords: ['days on hand', 'holding cost', 'stockout', 'clearance', 'safety stock', 'reorder point', 'electronics'],
    },
    solutionExplanation:
      'Warehouse bottlenecks stem from asymmetric inventory velocity: seasonal decor occupies 65% of pallet racks with 145 days on hand, starving fast-moving electronics of working capital. Aggressive clearance markdowns resolve both warehouse congestion and stockouts.',
  },

  // ============================================================================
  // 5. REVENUE & PROFITABILITY MARGIN SQUEEZE
  // ============================================================================
  {
    id: 'sim-05',
    slug: 'revenue-profitability-margin-squeeze',
    title: 'Top-Line Expansion vs Bottom-Line Margin Squeeze',
    category: 'Corporate Finance & Strategy',
    difficulty: 'advanced',
    xpReward: 150,
    estimatedMinutes: 50,
    businessBackground:
      'Q3 corporate earnings showed a celebratory +22% year-over-year revenue growth. However, Net Operating Margin collapsed from +11% to -2.5%, triggering board scrutiny.',
    businessObjective:
      'Deconstruct the cost of goods sold (COGS), expedited freight subsidies, and volume rebate tiers that inverted profitability despite top-line growth.',
    businessProblem:
      'Each incremental dollar of revenue in Q3 cost $1.14 to deliver, generating negative unit economics.',
    availableInformation:
      'Quarterly P&L breakdowns, customer discount schedules, third-party logistics freight invoices, and wholesale component supplier price trends.',
    datasetName: 'corporate_p_and_l_breakdown.csv',
    datasetDescription: 'Expense lines and revenue trends over the last 4 quarters.',
    datasetRows: [
      { quarter: 'Q1 Baseline', revenue: 10000000, cogs: 5200000, freight: 800000, opex: 2900000, net_profit: 1100000 },
      { quarter: 'Q2 Growth', revenue: 11200000, cogs: 6100000, freight: 1200000, opex: 3000000, net_profit: 900000 },
      { quarter: 'Q3 Squeeze', revenue: 12200000, cogs: 7500000, freight: 2100000, opex: 2900000, net_profit: -300000 },
    ],
    metricsSummary: {
      'Q3 Revenue': '$12,200,000 (+22%)',
      'Q3 Net Operating Profit': '-$300,000 (-2.5% margin)',
      'Freight Cost Explosion': '$2,100,000 (17.2% of revenue vs 8.0% baseline)',
      'COGS Ratio': '61.5% of revenue (up from 52.0%)',
    },
    investigationTasks: [
      'Calculate the surge in freight expense as a percentage of revenue across Q1, Q2, and Q3.',
      'Determine why promotional commitments to "guaranteed 2-day delivery" crushed contribution margins.',
      'Propose shipping threshold policies to restore double-digit net operating profit.',
    ],
    decisionQuestions: [
      {
        id: 'q5-1',
        question: 'Which expense category experienced the most severe relative inflation between Q1 and Q3?',
        objective: 'Isolate root driver of the bottom-line loss.',
        options: [
          'Operating Expenses (OPEX stayed flat at $2.9M)',
          'Freight & Logistics costs surged 162% from $800k to $2.1M due to subsidized 2-day expedited air freight',
          'Corporate tax rates',
          'Marketing ad spend',
        ],
        correctOptionIndex: 1,
        rationale: 'Freight increased from 8% of revenue ($800k) to 17.2% ($2.1M) as sales teams promised unconstrained 2-day air delivery on low-margin items.',
      },
    ],
    recommendationPrompt:
      'Draft an executive board memorandum detailing a minimum order value (MOV) for expedited shipping and renegotiating supplier component contracts.',
    rubricCriteria: {
      analyticalAccuracy: 'Identify freight rising to $2.1M (17.2% of sales) as the key margin destroyer.',
      evidenceInterpretation: 'Explain why top-line growth (+22%) masked a -$1.4M operational profit drop.',
      actionableFeasibility: 'Set a $75 MOV threshold for free expedited shipping and restrict promos on low-margin SKUs.',
      essentialKeywords: ['freight', 'cogs', 'expedited shipping', 'minimum order value', 'operating margin', 'net profit'],
    },
    solutionExplanation:
      'The company pursued vanity top-line growth by subsidizing guaranteed 2-day shipping without order thresholds. Customers placed split orders for $15 items that cost $22 to ship via air. Instituting a $75 MOV threshold immediately eliminates the freight bleed and restores positive net margin.',
  },

  // ============================================================================
  // 6. CUSTOMER BEHAVIORAL SEGMENTATION & VALUE MIGRATION
  // ============================================================================
  {
    id: 'sim-06',
    slug: 'customer-segmentation-value-migration',
    title: 'Customer RFM Segmentation & High-Value Account Migration',
    category: 'Customer Intelligence',
    difficulty: 'intermediate',
    xpReward: 140,
    estimatedMinutes: 45,
    businessBackground:
      'NovaMart customer analytics reports that while overall customer count grew +14%, top decile "VIP Champions" decreased by 18%, migrating into lower-spending tiers.',
    businessObjective:
      'Perform Recency, Frequency, and Monetary (RFM) segmentation to identify churn risk among enterprise high-value accounts.',
    businessProblem:
      'Top-tier accounts historically generated 52% of total corporate profits. Their silent contraction threatens next year\'s revenue baseline.',
    availableInformation:
      'Customer order history covering recency of last purchase, 12-month order frequency, cumulative monetary spend, and loyalty tier migration.',
    datasetName: 'customer_rfm_clusters.csv',
    datasetDescription: 'RFM clusters and value migration tracking.',
    datasetRows: [
      { cluster: 'Champions (VIP)', customer_count: 420, avg_annual_spend: 18500, recency_days: 12, churn_risk: 'Low' },
      { cluster: 'At-Risk High Value', customer_count: 180, avg_annual_spend: 14200, recency_days: 78, churn_risk: 'Critical' },
      { cluster: 'Recent Casual Buyers', customer_count: 2400, avg_annual_spend: 650, recency_days: 18, churn_risk: 'Medium' },
      { cluster: 'Dormant Lost Accounts', customer_count: 1100, avg_annual_spend: 420, recency_days: 240, churn_risk: 'High' },
    ],
    metricsSummary: {
      'At-Risk High-Value Accounts': '180 customers',
      'Trapped Revenue at Risk': '$2,556,000',
      'Average Inactivity Period': '78 days without purchase (vs 12-day VIP norm)',
      'Primary Departure Cause': 'Unresolved customer support escalations (64%)',
    },
    investigationTasks: [
      'Quantify the dollar exposure represented by the 180 "At-Risk High Value" customers.',
      'Analyze the recency gap (78 days vs 12 days) as an early warning churn signal.',
      'Develop an account-based concierge outreach campaign to reactivate slipping accounts.',
    ],
    decisionQuestions: [
      {
        id: 'q6-1',
        question: 'What is the financial risk if the 180 At-Risk High Value accounts fully lapse into Dormant status?',
        objective: 'Calculate value at risk.',
        options: [
          'Under $100,000',
          'Approximately $2.55 Million in annual high-margin revenue (180 × $14,200)',
          'Zero risk because new casual buyers replace them dollar for dollar',
          '$500,000 in shipping fees',
        ],
        correctOptionIndex: 1,
        rationale: '180 accounts spending an average of $14,200 represents $2,556,000 in top-tier revenue at immediate risk of churn.',
      },
    ],
    recommendationPrompt:
      'Formulate an account-based win-back strategy detailing executive contact points and proactive incentive offers for the 180 at-risk accounts.',
    rubricCriteria: {
      analyticalAccuracy: 'Accurately compute the $2.55M revenue exposure of the 180 accounts.',
      evidenceInterpretation: 'Emphasize the 78-day recency lapse as a precursor to permanent churn.',
      actionableFeasibility: 'Design high-touch outreach (assigned account managers, tailored incentives) rather than generic email marketing.',
      essentialKeywords: ['rfm', 'at-risk', 'champions', 'recency', 'monetary', 'concierge', 'account manager'],
    },
    solutionExplanation:
      'Customer acquisition numbers masked value migration: 2,400 casual buyers spending $650 ($1.56M) cannot offset the loss of 180 VIPs spending $14,200 ($2.55M). Deploying proactive account-management triage for customers crossing 45 days of inactivity salvages $2.5M in high-margin revenue.',
  },

  // ============================================================================
  // 7. OPERATIONAL LOGISTICS & DELIVERY EFFICIENCY
  // ============================================================================
  {
    id: 'sim-07',
    slug: 'operational-logistics-delivery-efficiency',
    title: 'Fleet Dispatch Routing & Last-Mile Delivery Bottlenecks',
    category: 'Logistics & Operations',
    difficulty: 'advanced',
    xpReward: 145,
    estimatedMinutes: 45,
    businessBackground:
      'MetroExpress courier network failed its 95% on-time delivery service level agreement (SLA) in Q1, dropping to 82.4% and incurring $450,000 in enterprise contract SLA penalty rebates.',
    businessObjective:
      'Deconstruct fleet delivery logs to identify routing bottlenecks, driver dwell times at loading docks, and late-dispatch triggers.',
    businessProblem:
      'Dispatchers blame urban traffic congestion, while depot managers argue sorting facility delays hold trucks at the dock beyond scheduled departure windows.',
    availableInformation:
      '15,000 truck telematics records: sorting clearance timestamps, depot departure times, route stops, dwell minutes per stop, and delivery timestamps.',
    datasetName: 'metroexpress_fleet_dispatch.csv',
    datasetDescription: 'Depot departure times and delivery delay breakdown.',
    datasetRows: [
      { depot: 'Metro North', on_time_departure_pct: 0.94, on_time_delivery_pct: 0.96, avg_dock_dwell_min: 14, sla_penalties: 12000 },
      { depot: 'Metro Central', on_time_departure_pct: 0.62, on_time_delivery_pct: 0.74, avg_dock_dwell_min: 48, sla_penalties: 380000 },
      { depot: 'Metro South', on_time_departure_pct: 0.91, on_time_delivery_pct: 0.93, avg_dock_dwell_min: 16, sla_penalties: 58000 },
    ],
    metricsSummary: {
      'Total Q1 SLA Penalties': '$450,000',
      'Metro Central Penalty Share': '$380,000 (84.4% of total)',
      'Metro Central On-Time Departure': '62% (vs 94% North)',
      'Metro Central Dock Dwell Time': '48 minutes (3.4x higher than standard)',
    },
    investigationTasks: [
      'Compare on-time departure vs on-time delivery across the three depots.',
      'Quantify Metro Central\'s share of overall company SLA penalty expenses.',
      'Determine whether delivery delays originate on the road or at the loading dock.',
    ],
    decisionQuestions: [
      {
        id: 'q7-1',
        question: 'Where is the actual root cause of MetroExpress SLA delivery failures located?',
        objective: 'Disprove the urban traffic hypothesis with operational telemetry.',
        options: [
          'Uncontrollable downtown road construction and weather',
          'Metro Central internal dock congestion: trucks suffer 48-minute dwell times and only 62% on-time departures',
          'Driver vehicle mechanical breakdowns',
          'Customer absence at residential drop-off locations',
        ],
        correctOptionIndex: 1,
        rationale: 'Telemetry proves delays occur before wheels turn: Metro Central trucks depart late 38% of the time due to 48-minute dock dwell bottlenecks, accounting for 84.4% of all penalties.',
      },
    ],
    recommendationPrompt:
      'Author an operational overhaul directive for Metro Central Depot establishing pre-sorted pallet staging, strict dock departure windows, and cross-docking workflows.',
    rubricCriteria: {
      analyticalAccuracy: 'Isolate Metro Central as the source of $380,000 (84.4%) of SLA penalties.',
      evidenceInterpretation: 'Highlight the 48-minute dock dwell time and 62% on-time departure rate.',
      actionableFeasibility: 'Implement pre-sorted staging and staggered dock assignments to cut dwell time under 20 minutes.',
      essentialKeywords: ['metro central', 'dock dwell', 'departure', 'sla penalties', 'staging', 'turnaround', 'on-time'],
    },
    solutionExplanation:
      'The "urban traffic" narrative was a red herring. Telemetry reveals that 84% of SLA failures originated inside Metro Central depot, where trucks waited 48 minutes at congested loading docks and departed late. Restructuring pallet staging to guarantee on-time morning departure eliminates $380,000 in penalty fees.',
  },
];
