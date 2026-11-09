import { Competition } from '../types/challenge';

export const COMPETITIONS_DATA: Competition[] = [
  // ============================================================================
  // 1. WEEKLY ANALYTICAL SPRINT (Beginner Tier)
  // ============================================================================
  {
    id: 'comp-weekly-42',
    title: 'Weekly Analytical Sprint: E-Commerce Regional Margin Leakage',
    type: 'weekly',
    tier: 'beginner',
    status: 'active',
    description:
      'Analyze an anonymized weekly sales log to isolate the single product category responsible for margin erosion and propose a pricing threshold.',
    domainName: 'Excel & Spreadsheet Analytics',
    deadlineIso: '2026-11-16T23:59:59Z',
    xpReward: 150,
    datasetContext: 'ecommerce_weekly_snapshot.csv (12,000 transaction records with wholesale costs, shipping, and promotional discounts).',
    problemStatement:
      'Evaluate total revenue, contribution margin percentage, and discount frequency across product categories. Identify the loss-making category and formulate a minimum order value (MOV) policy.',
    scoringCriteria: [
      'Analytical Accuracy (40%): Correct category and margin calculation.',
      'Evidence Grounding (30%): Specific metric citations from the dataset.',
      'Actionable Feasibility (30%): A concrete, practical business recommendation.',
    ],
    requiredDeliverables: [
      'Identification of the loss-making merchandise category.',
      'Calculated net margin percentage after returns and discounts.',
      'A structured executive recommendation (minimum 30 words).',
    ],
    leaderboard: [
      {
        rank: 1,
        participantName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        score: 96,
        submittedAt: '2026-11-08T14:12:00Z',
        badge: 'Top Analyst',
        isCurrentUser: false,
      },
      {
        rank: 2,
        participantName: 'David Nwachukwu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        score: 93,
        submittedAt: '2026-11-08T18:45:00Z',
        badge: 'Gold Contender',
        isCurrentUser: false,
      },
      {
        rank: 3,
        participantName: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        score: 89,
        submittedAt: '2026-11-09T08:30:00Z',
        badge: 'Silver Analyst',
        isCurrentUser: false,
      },
      {
        rank: 4,
        participantName: 'Lucas Lindqvist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        score: 84,
        submittedAt: '2026-11-09T11:20:00Z',
        badge: 'Finalist',
        isCurrentUser: false,
      },
    ],
  },

  // ============================================================================
  // 2. MONTHLY COMMUNITY CUP (Advanced Tier)
  // ============================================================================
  {
    id: 'comp-monthly-q4',
    title: 'Monthly Community Cup: Enterprise B2B SaaS Net Retention Cup',
    type: 'monthly',
    tier: 'advanced',
    status: 'active',
    description:
      'Deconstruct customer cohort retention telemetry across 2,500 subscription accounts. Model expansion vs contraction trajectories and deliver a board-level retention strategy.',
    domainName: 'Product & SaaS Analytics',
    deadlineIso: '2026-11-30T23:59:59Z',
    xpReward: 250,
    datasetContext: 'saas_telemetry_billing_cohorts.csv (120,000 monthly usage events and customer tier transitions).',
    problemStatement:
      'Perform cohort retention modeling to identify feature activation thresholds that prevent year-1 churn. Reconcile Net Revenue Retention (NRR) and propose an account-tier expansion playbook.',
    scoringCriteria: [
      'Quantitative Modeling (40%): Correct cohort NRR calculation and feature adoption correlations.',
      'Commercial Rigor (30%): Unit-economics evaluation (CAC payback, ARPU expansion).',
      'Strategic Feasibility (30%): Executive-ready intervention plan with clear KPIs.',
    ],
    requiredDeliverables: [
      'Cohort retention curve analysis (Months 1–12).',
      'Key feature adoption threshold identifying high-retention accounts.',
      'Comprehensive executive recommendation memo.',
    ],
    leaderboard: [
      {
        rank: 1,
        participantName: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        score: 98,
        submittedAt: '2026-11-05T19:20:00Z',
        badge: 'Grandmaster',
        isCurrentUser: false,
      },
      {
        rank: 2,
        participantName: 'Arjun Sen',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        score: 95,
        submittedAt: '2026-11-06T12:15:00Z',
        badge: 'Master Analyst',
        isCurrentUser: false,
      },
      {
        rank: 3,
        participantName: 'Klara Becker',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        score: 91,
        submittedAt: '2026-11-07T16:40:00Z',
        badge: 'Gold Contender',
        isCurrentUser: false,
      },
    ],
  },
];
