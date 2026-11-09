import { PortfolioProject } from '../types/portfolio';

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-01',
    userId: 'user-demo-001',
    authorName: 'Alex Mercer',
    title: 'E-Commerce Omnichannel Customer Churn & Cohort Investigation',
    shortDescription: 'Longitudinal cohort retention analysis and telemetry audit identifying payment gateway latency as the primary driver of international customer drop-off.',
    domainId: 'sql-relational-databases',
    domainName: 'SQL & Relational Databases',
    projectType: 'coding',
    problemStatement: 'Following a major storefront redesign in Q3, month-2 customer retention plunged from 64.8% to 41.2% in international markets, creating a projected $1.8M ARR deficit if left unaddressed.',
    businessContext: 'The executive committee tasked the analytics team with evaluating customer behavior logs to isolate whether the churn was driven by marketing channel changes, catalog pricing, or platform technical friction.',
    datasetInfo: {
      name: 'Omnichannel_Customer_Telemetry_2025.db',
      source: 'Internal Data Warehouse & Event Streams',
      rowCount: 142000,
      description: 'Contains normalized tables for users, order transactions, telemetry events, and payment gateway response timestamps.',
      linkedPlaygroundDatasetId: 'ecommerce-cohorts'
    },
    tools: ['SQL (DuckDB / PostgreSQL)', 'Python (Pandas, Seaborn)', 'Tableau', 'Git & Markdown'],
    methodology: `### Investigation Methodology
1. **Relational Cohort Construction**: Wrote parameterized SQL window queries using CTEs, partitioning customer first-purchase dates into monthly cohorts from Jan 2025 to Oct 2025.
2. **Behavioral Step Funnel Analysis**: Profiled micro-conversion velocity from cart creation, shipping address confirmation, to payment token authorization.
3. **Multivariate Regression**: Modeled churn probability as a function of checkout load latency, discount rate, payment method, and geographic region.`,
    analysisAndFindings: `### Key Analytical Findings
- **The Latency Chokepoint**: Android checkout latency in non-US territories spiked by 3.4 seconds post-redesign due to redundant third-party tracking scripts loaded synchronously.
- **Cart Abandonment Elasticity**: For every 1.0-second increase in checkout screen latency, international cart abandonment increased by 11.2% ($R^2 = 0.88$).
- **US vs International Divergence**: US customers experienced minimal latency impact (0.3s) due to localized CDN nodes, masking the severity of international degradation during domestic QA testing.`,
    visualizations: [
      {
        id: 'viz-01',
        title: 'Monthly Cohort Retention Heatmap (Month 0 to Month 6)',
        caption: 'Noticeable divergence starting in August cohort coinciding with storefront v2 deployment.',
        chartType: 'kpi_metric',
        dataSnapshot: '| Cohort | Size | M0 | M1 | M2 | M3 |\n| --- | --- | --- | --- | --- | --- |\n| May 2025 | 12,400 | 100% | 78% | 66% | 61% |\n| Jun 2025 | 13,100 | 100% | 79% | 65% | 60% |\n| Jul 2025 | 14,200 | 100% | 77% | 64% | 59% |\n| Aug 2025 (v2) | 15,800 | 100% | 68% | 41% | 34% |'
      },
      {
        id: 'viz-02',
        title: 'Checkout Screen Latency vs International Abandonment Rate',
        caption: 'Strong positive correlation between payment SDK handshake latency and checkout drop-off.',
        chartType: 'bar',
        dataSnapshot: '| Region | Median Latency | Drop-off Rate |\n| --- | --- | --- |\n| North America | 1.1s | 14.2% |\n| Western Europe | 2.4s | 22.8% |\n| Latin America | 4.8s | 46.5% |\n| Southeast Asia | 5.2s | 51.1% |'
      }
    ],
    conclusionsAndRecommendations: `### Strategic Recommendations & Business Impact
1. **Asynchronous Script Loading**: Immediately convert all marketing pixels on the checkout step to asynchronous web workers, recovering 2.8 seconds of client-side render time.
2. **Deploy Regional Edge Gateways**: Provision local payment tokenization endpoints in Singapore and São Paulo.
3. **Impact Verification**: A 14-day canary patch restored Latin America checkout conversion by 28%, preserving an estimated $1.2M in annualized recurring gross merchandise value.`,
    skillsDemonstrated: [
      'Relational SQL (CTEs, Window Functions)',
      'Cohort Retention Analysis',
      'Funnel Conversion Diagnostics',
      'Executive Business Storytelling',
      'Root-Cause Attribution'
    ],
    learningOutcomes: [
      'Mastered multi-table event joins across high-volume telemetry schemas.',
      'Developed executive-grade diagnostic visualizations highlighting commercial impact over raw data.'
    ],
    linkedChallengeId: 'ch-01',
    status: 'published',
    isPublic: true,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-28T14:30:00Z',
    upvotes: 24
  },
  {
    id: 'proj-02',
    userId: 'user-demo-001',
    authorName: 'Alex Mercer',
    title: 'SaaS Unit Economics & LTV/CAC Predictive Cashflow Model',
    shortDescription: 'Financial sensitivity model evaluating enterprise tier sales expansion feasibility, payback period velocity, and working capital requirements.',
    domainId: 'business-analytics-kpis',
    domainName: 'Business Analytics & Commercial KPIs',
    projectType: 'spreadsheet',
    problemStatement: 'Marketing is requesting a 60% budget increase to acquire enterprise accounts ($50K+ ACV). Finance needs verification that enterprise customer economics can sustain a 3.0x LTV:CAC ratio and sub-12-month payback.',
    businessContext: 'The Chief Financial Officer requires a comprehensive spreadsheet sensitivity analysis modeling sales rep quotas, enterprise sales cycle latency, gross margin overhead, and churn thresholds.',
    datasetInfo: {
      name: 'B2B_SaaS_Historical_Unit_Economics.xlsx',
      source: 'Finance & CRM ERP',
      rowCount: 4500,
      description: 'Historical lead-to-opportunity conversions, sales cycle duration, contract values, and churn events.'
    },
    tools: ['Microsoft Excel (Power Pivot)', 'DAX & Dynamic Arrays', 'Financial Sensitivity Modeling'],
    methodology: `### Financial Modeling Framework
- Audited 3 years of CRM deal logs across SMB, Mid-Market, and Enterprise tiers.
- Formulated Net LTV equation incorporating gross margin and net revenue retention (NRR):
  $$LTV = \\frac{ARPU \\times \\text{Gross Margin}\\%}{\\text{Monthly Churn}\\% - \\text{Expansion}\\%}$$
- Built dynamic 2-way sensitivity data tables evaluating LTV:CAC against variations in enterprise churn ($0.5\\% - 2.0\\%$) and sales cycle length ($60 - 150\\text{ days}$).`,
    analysisAndFindings: `### Key Financial Takeaways
1. **Working Capital Gap**: Enterprise sales cycles averaged 114 days versus 21 days for self-serve SMB, creating a 5-month cashflow trough before first contract payment.
2. **True Payback Period**: While Enterprise ACV was 12x higher, the fully-loaded CAC (sales engineering + executive sponsorship travel + marketing) pushed payback to 14.8 months.
3. **Break-Even Threshold**: To achieve the target 3.0x LTV:CAC ratio, enterprise annual net churn cannot exceed 7.5% per year.`,
    visualizations: [
      {
        id: 'viz-03',
        title: 'Sensitivity Table: LTV:CAC Ratio vs Churn Rate and Gross Margin',
        caption: 'Green cells highlight regions where LTV:CAC exceeds 3.0x threshold.',
        chartType: 'table',
        dataSnapshot: '| Annual Churn | 70% Margin | 75% Margin | 80% Margin |\n| --- | --- | --- | --- |\n| 5% Churn | 3.4x | 3.7x | 4.0x |\n| 8% Churn | 2.8x | 3.0x | 3.3x |\n| 12% Churn | 2.1x | 2.3x | 2.5x |'
      }
    ],
    conclusionsAndRecommendations: `### Recommendations for Finance & Executive Leadership
1. **Mandate Upfront Annual Billing**: Eliminate monthly invoicing on contracts > $25K, requiring 100% upfront payment to neutralize the 5-month working capital deficit.
2. **Implement Enterprise Sales SLA Gates**: Disqualify unqualified leads after day 30 if technical requirements document (TRD) is not approved.
3. **Cap Enterprise Ad Spend at 35%**: Restrict marketing allocation to $40K monthly until enterprise payback compresses under 12 months.`,
    skillsDemonstrated: [
      'SaaS Unit Economics & KPI Modeling',
      'Advanced Excel & Financial Sensitivity',
      'Capital Allocation & Risk Assessment'
    ],
    learningOutcomes: [
      'Gained deep understanding of how sales velocity and customer payment terms impact cashflow.',
      'Formulated institutional-quality financial memos for executive decision makers.'
    ],
    status: 'draft',
    isPublic: false,
    createdAt: '2026-10-10T11:20:00Z',
    updatedAt: '2026-11-02T16:45:00Z'
  }
];
