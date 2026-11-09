import { DataDetectiveMystery } from '../types/challenge';

export const DATA_DETECTIVE_MYSTERIES: DataDetectiveMystery[] = [
  // ============================================================================
  // 1. CASE #884: THE CASE OF THE MISSING 14% MARGIN (Beginner)
  // ============================================================================
  {
    id: 'case-884',
    caseFileNumber: 'CASE-884',
    title: 'The Case of the Missing 14% Margin',
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 30,
    caseSummary:
      'Between Oct 12 and Oct 18, Orion Retail recorded an unprecedented $1.2M collapse in reported gross profit across UK and European e-commerce branches, yet total unit sales and customer checkout volumes remained identical to baseline.',
    incidentTimestamp: '2026-10-12 00:03:14 UTC',
    suspectTheories: [
      'Theory A: Malicious warehouse supplier over-billing and fraudulent freight charges.',
      'Theory B: Point-of-Sale terminal firmware rounding errors on local value-added taxes.',
      'Theory C: Database automated exchange rate ETL batch update stored a corrupted currency multiplier.',
    ],
    clues: [
      {
        id: 1,
        title: 'Clue 1: Currency Conversion Multiplier Log',
        sourceType: 'Database Exchange Log (fx_rates_daily)',
        content:
          'Server timestamp 2026-10-12 00:03 UTC showed an automated batch update to the GBP/USD exchange conversion rate. The multiplier was stored as 0.1300 instead of 1.3000 due to a decimal placement shift in the external third-party API response parser.',
        relevance: 'High',
        isRedHerring: false,
        hint: 'Notice that 0.13 is exactly one-tenth of the actual 1.30 exchange rate. This artificially discounted all UK revenue converted into corporate USD by 90%!',
      },
      {
        id: 2,
        title: 'Clue 2: Tier-1 Electronics Supplier Rebates',
        sourceType: 'Procurement Accounts Receivable Ledger',
        content:
          'Tier-1 electronics suppliers applied their quarterly volume rebates on Oct 11. All rebate credits cleared accounts receivable without friction, and wholesale invoice rates remained unchanged at contract pricing.',
        relevance: 'Low / Red Herring',
        isRedHerring: true,
        hint: 'Procurement records confirmed all invoices matched baseline contracts. Supplier billing was not the cause.',
      },
      {
        id: 3,
        title: 'Clue 3: Point-of-Sale Terminal European Patch',
        sourceType: 'POS Terminal Audit Trail (build v4.2)',
        content:
          'European store terminals received a minor UI update on Oct 10 to display local store currency symbols. Receipt VAT calculations were inspected and showed zero variance from historical tax compliance reports.',
        relevance: 'Low / Red Herring',
        isRedHerring: true,
        hint: 'The patch affected only receipt text formatting and did not alter transaction calculations.',
      },
      {
        id: 4,
        title: 'Clue 4: Regional P&L Ledger by Currency',
        sourceType: 'Consolidated General Ledger',
        content:
          'Transactions billed directly in USD showed stable 42% gross margin. Transactions billed in GBP and converted to USD during nightly batch jobs showed an apparent 4.2% gross margin — exactly 10x lower than normal.',
        relevance: 'High',
        isRedHerring: false,
        hint: 'The margin anomaly was isolated exclusively to GBP transactions converted into USD.',
      },
    ],
    evidenceDatasetName: 'fx_transaction_audit_sample.csv',
    evidenceDatasetRows: [
      { order_id: 'UK-701', currency: 'GBP', local_amount: 100.0, stored_rate: 0.13, reported_usd: 13.0, expected_usd: 130.0 },
      { order_id: 'US-702', currency: 'USD', local_amount: 250.0, stored_rate: 1.00, reported_usd: 250.0, expected_usd: 250.0 },
      { order_id: 'UK-703', currency: 'GBP', local_amount: 500.0, stored_rate: 0.13, reported_usd: 65.0, expected_usd: 650.0 },
      { order_id: 'US-704', currency: 'USD', local_amount: 180.0, stored_rate: 1.00, reported_usd: 180.0, expected_usd: 180.0 },
    ],
    investigationQuestions: [
      {
        id: 'det-q1',
        question: 'Which currency transactions exhibited the margin collapse in the general ledger?',
        options: ['US Dollar (USD) transactions', 'British Pound (GBP) transactions converted to USD', 'Euro (EUR) transactions', 'All currencies equally'],
        correctOptionIndex: 1,
        deductionHint: 'Examine Clue 4 and the evidence dataset: USD transactions are normal, but GBP orders are reported at 10% value.',
      },
      {
        id: 'det-q2',
        question: 'What was the specific bug in the currency conversion multiplier log?',
        options: [
          'The multiplier was inverted (USD to GBP instead of GBP to USD)',
          'A decimal shift recorded the GBP/USD exchange rate as 0.13 instead of 1.30 (10x smaller)',
          'The database failed to record exchange rates and defaulted to zero',
          'Currency conversions were duplicated three times',
        ],
        correctOptionIndex: 1,
        deductionHint: 'Clue 1 shows the multiplier was 0.1300 instead of 1.3000.',
      },
    ],
    verdictOptions: [
      'Supplier fraud: Procurement vendors inflated component prices by 14%.',
      'Data pipeline bug: An automated exchange rate batch job parsed GBP/USD as 0.13 instead of 1.30, under-reporting converted UK revenue by 90% and creating a fictitious margin collapse.',
      'Cash register failure: POS terminals failed to collect sales tax across Europe.',
      'Customer returns: High return rates in electronics caused the profit slump.',
    ],
    correctVerdictIndex: 1,
    forensicExplanation:
      'The margin collapse was entirely an accounting data pipeline artifact rather than real business loss. On Oct 12 at 00:03 UTC, an automated currency rate ingestion job parsed the GBP/USD rate as 0.13 instead of 1.30. Actual revenue in bank accounts was completely intact, but corporate reporting recorded converted revenue at 10% of true value. Re-running the batch ledger with the correct 1.30 rate restored the $1.2M margin.',
  },

  // ============================================================================
  // 2. CASE #902: THE PHANTOM REVENUE WEBHOOK RETRIES (Intermediate)
  // ============================================================================
  {
    id: 'case-902',
    caseFileNumber: 'CASE-902',
    title: 'The Phantom Revenue Webhook Retries',
    difficulty: 'intermediate',
    xpReward: 120,
    estimatedMinutes: 35,
    caseSummary:
      'A fast-growing fintech company celebrated an unexpected 24% spike in recorded ARR during the final week of the quarter. Two days later, Finance found that bank account deposits were $420,000 lower than the CRM ledger.',
    incidentTimestamp: '2026-09-28 14:22:00 UTC',
    suspectTheories: [
      'Theory A: Sales representatives forged unauthorized enterprise deals to meet quarterly quotas.',
      'Theory B: Webhook retries from payment processors were ingested multiple times without idempotency keys.',
      'Theory C: The database disk crashed and lost settled customer records.',
    ],
    clues: [
      {
        id: 1,
        title: 'Clue 1: Ingestion API Error Response Spikes',
        sourceType: 'API Gateway Metrics (Kong)',
        content:
          'On Sept 28 between 14:00 and 16:00 UTC, the analytics webhook endpoint experienced intermittent database lock timeouts, returning HTTP 500 errors to Stripe.',
        relevance: 'High',
        isRedHerring: false,
        hint: 'When payment gateways receive HTTP 500, what is their automatic retry behavior?',
      },
      {
        id: 2,
        title: 'Clue 2: Sales Rep Commission Requests',
        sourceType: 'Salesforce Commission Audit',
        content:
          'All closed deals in Salesforce corresponded to verified signed customer contracts. No rep forged new client accounts.',
        relevance: 'Low / Red Herring',
        isRedHerring: true,
        hint: 'Sales contracts were genuine; the problem was duplicated transaction events in telemetry.',
      },
      {
        id: 3,
        title: 'Clue 3: Event ID Frequency Inspection',
        sourceType: 'Staging Database Primary Key Audit',
        content:
          'Inspection of the payment_events staging table revealed that event_id was stored in an unindexed column without a UNIQUE constraint. 48 distinct enterprise transactions appeared 3 to 5 times each.',
        relevance: 'High',
        isRedHerring: false,
        hint: 'Without a UNIQUE constraint, duplicate webhook retries created multiple duplicate revenue records.',
      },
    ],
    evidenceDatasetName: 'payment_webhook_duplicates.csv',
    evidenceDatasetRows: [
      { event_id: 'evt_alpha_1', customer_id: 104, amount: 8500, attempt: 1, http_status: 500, recorded_in_crm: 1 },
      { event_id: 'evt_alpha_1', customer_id: 104, amount: 8500, attempt: 2, http_status: 500, recorded_in_crm: 1 },
      { event_id: 'evt_alpha_1', customer_id: 104, amount: 8500, attempt: 3, http_status: 200, recorded_in_crm: 1 },
      { event_id: 'evt_beta_2', customer_id: 209, amount: 12000, attempt: 1, http_status: 200, recorded_in_crm: 1 },
    ],
    investigationQuestions: [
      {
        id: 'det-q2-1',
        question: 'Why did Stripe send duplicate webhook events to the analytics endpoint?',
        options: [
          'Stripe servers were infected by malware',
          'Internal analytics database timeouts returned HTTP 500, prompting Stripe to automatically retry delivery',
          'Sales reps pressed the resend button in the dashboard',
          'Credit cards expired simultaneously',
        ],
        correctOptionIndex: 1,
        deductionHint: 'HTTP 500 triggers standard exponential backoff retries from payment webhooks.',
      },
      {
        id: 'det-q2-2',
        question: 'What architectural missing check allowed duplicate entries into the CRM ledger?',
        options: [
          'Lack of an SSL certificate',
          'Absence of an idempotency key check and UNIQUE database constraint on event_id',
          'Firewall blocked the server port',
          'Using Postgres instead of MongoDB',
        ],
        correctOptionIndex: 1,
        deductionHint: 'Idempotency ensures an event is recorded once regardless of how many retries arrive.',
      },
    ],
    verdictOptions: [
      'Sales fraud: Reps fabricated fake deals to claim quarterly bonuses.',
      'Architectural idempotency failure: Payment webhook retries were ingested without UNIQUE event_id deduplication, artificially inflating reported ARR by $420,000.',
      'Bank theft: Wire transfer funds were intercepted before clearing the accounts.',
      'Database corruption: Hard drive sectors failed during the month-end batch run.',
    ],
    correctVerdictIndex: 1,
    forensicExplanation:
      'During the Sept 28 database lock contention, the internal API returned HTTP 500 errors to Stripe. As designed, Stripe retried delivery of each event up to 5 times. Because the analytics consumer lacked an idempotency key verification and UNIQUE constraint on event_id, each retry was inserted as an independent new transaction, inflating reported revenue by $420,000 without actual cash deposits.',
  },

  // ============================================================================
  // 3. CASE #941: THE AD SPEND SIPHON & GHOST CONVERSIONS (Advanced)
  // ============================================================================
  {
    id: 'case-941',
    caseFileNumber: 'CASE-941',
    title: 'The Ad Spend Siphon & Ghost Conversions',
    difficulty: 'advanced',
    xpReward: 150,
    estimatedMinutes: 45,
    caseSummary:
      'A mobile gaming studio increased ad spend on an affiliate display network by $600,000 after dashboard analytics reported a surge of 40,000 app installs. However, server telemetry showed zero gameplay activity from these newly acquired players.',
    incidentTimestamp: '2026-08-15 11:00:00 UTC',
    suspectTheories: [
      'Theory A: Game servers crashed, preventing new users from creating player accounts.',
      'Theory B: Device farm bot click-injection hijacked organic installs and claimed fraudulent affiliate attribution bounties.',
      'Theory C: The app was too difficult, so all 40,000 users uninstalled within 60 seconds.',
    ],
    clues: [
      {
        id: 1,
        title: 'Clue 1: Click-to-Install Time Distribution',
        sourceType: 'MMP Attribution Telemetry (Adjust/AppsFlyer)',
        content:
          'Normal organic installs show a click-to-install time (CTIT) of 45 to 180 seconds. Installs attributed to Affiliate Network "ZetaTraffic" showed a CTIT of under 1.2 seconds in 91% of cases.',
        relevance: 'High',
        isRedHerring: false,
        hint: 'A human cannot click an ad, load the Google Play store, download a 150MB game, and install it in 1.2 seconds. This is the classic signature of click-injection!',
      },
      {
        id: 2,
        title: 'Clue 2: Gameplay Server Heartbeat Telemetry',
        sourceType: 'Game Backend WebSocket Logs',
        content:
          'Game servers operated at 99.99% uptime with latency under 35ms. Organic players who downloaded the game played an average of 42 minutes.',
        relevance: 'Low / Red Herring',
        isRedHerring: true,
        hint: 'Server stability rules out server crash hypotheses.',
      },
      {
        id: 3,
        title: 'Clue 3: Battery Level and Sensor Gyroscope Data',
        sourceType: 'Device Sensor Event Stream',
        content:
          'Devices associated with ZetaTraffic installs reported static battery levels of exactly 100% and constant 0.0 accelerometer motion, indicative of headless Android emulators in server racks.',
        relevance: 'High',
        isRedHerring: false,
        hint: 'Real human mobile players have fluctuating battery levels and gyroscope movement.',
      },
    ],
    evidenceDatasetName: 'affiliate_fraud_audit_sample.csv',
    evidenceDatasetRows: [
      { install_id: 'inst_01', affiliate: 'Organic', ctit_seconds: 78.4, battery_pct: 64, minutes_played: 35 },
      { install_id: 'inst_02', affiliate: 'ZetaTraffic', ctit_seconds: 0.8, battery_pct: 100, minutes_played: 0 },
      { install_id: 'inst_03', affiliate: 'ZetaTraffic', ctit_seconds: 1.1, battery_pct: 100, minutes_played: 0 },
      { install_id: 'inst_04', affiliate: 'Paid Search', ctit_seconds: 92.0, battery_pct: 42, minutes_played: 54 },
      { install_id: 'inst_05', affiliate: 'ZetaTraffic', ctit_seconds: 0.9, battery_pct: 100, minutes_played: 0 },
    ],
    investigationQuestions: [
      {
        id: 'det-q3-1',
        question: 'What does a Click-to-Install Time (CTIT) of under 1.2 seconds indicate?',
        options: [
          'Extremely fast 5G residential fiber internet',
          'Click-injection fraud: background malware detects app installations and fires fake ad clicks immediately prior to install completion to steal attribution',
          'Users are enthusiastic gamers',
          'The app download size was compressed to 1 kilobyte',
        ],
        correctOptionIndex: 1,
        deductionHint: 'CTIT under 2 seconds is physically impossible for authentic humans downloading mobile apps.',
      },
      {
        id: 'det-q3-2',
        question: 'What confirmed that the attributed installs were headless emulator bots rather than real users?',
        options: [
          'The players all chose the same username',
          'Device sensor logs showed 100% static battery and zero gyroscope movement combined with 0 minutes played',
          'The players did not make in-app purchases',
          'The ad graphics used the color blue',
        ],
        correctOptionIndex: 1,
        deductionHint: 'Clue 3 reveals headless emulator signatures in server racks.',
      },
    ],
    verdictOptions: [
      'Game server crash: A bug prevented 40,000 real players from entering the game.',
      'Mobile ad attribution fraud: An affiliate bot network executed click-injection and emulator-based fake installs to fraudulently siphon $600,000 in customer acquisition bounties.',
      'User preference shift: Gamers disliked the onboarding tutorial.',
      'Operating system incompatibility with Android 14.',
    ],
    correctVerdictIndex: 1,
    forensicExplanation:
      'The forensic investigation proves systematic mobile ad attribution fraud by affiliate network ZetaTraffic. By deploying background malware that monitored Android PACKAGE_ADDED broadcast intents, the network injected fake click timestamps seconds before authentic installs completed, hijacking attribution. Emulators were then run to trigger install bounties without real gameplay. Clawing back the $600,000 and blacklisting the affiliate network closes the siphon.',
  },
];
