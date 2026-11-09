import { UserProfile } from '../types/user';
import { Achievement, DailyMission } from '../types/gamification';
import { INITIAL_PORTFOLIO_PROJECTS } from './portfolioData';
import { INITIAL_COMMUNITY_DISCUSSIONS } from './communityData';
import { INITIAL_TEAMS } from './teamsData';

export const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr_demo_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@datamaster.io',
  role: 'Aspiring Data Analyst',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Transitioning from operations to data analytics. Passionate about SQL performance, cohort retention, and exploratory visualization.',
  githubUrl: 'https://github.com/alexrivera-data',
  linkedinUrl: 'https://linkedin.com/in/alexrivera-data',
  targetRole: 'Data Analyst',
  experienceLevel: 'Basic knowledge',
  dailyCommitmentMinutes: 30,
  learningStyles: ['Hands-on exercises', 'Real-world datasets', 'Business case studies'],
  primaryGoals: ['Become a Data Analyst', 'Build a portfolio', 'Prepare for technical interviews'],
  selectedDomainIds: [
    'domain-1', // Excel
    'domain-2', // SQL
    'domain-3', // Python
    'domain-4', // Statistics
    'domain-5', // BI & Viz
    'domain-6', // Data Cleaning & EDA
    'domain-7', // Business Understanding
    'domain-9', // Portfolio Projects
  ],
  completedTopicIds: ['d1-t1', 'd2-t1', 'd2-t2'],
  completedActivityIds: ['usr_demo_01:lesson:d1-t1', 'usr_demo_01:lesson:d2-t1', 'usr_demo_01:exercise:ex-sql-01'],
  practiceAttempts: [
    {
      id: 'att-init-1',
      exerciseId: 'ex-sql-01',
      domainId: 'domain-2',
      topicId: 'd2-t2',
      exerciseType: 'sql',
      isCorrect: true,
      submittedAnswer: "SELECT customer_id, full_name, country, tier FROM customers WHERE country = 'USA' AND tier = 'Enterprise' ORDER BY customer_id ASC;",
      timestamp: '2026-11-07T10:15:00Z',
      timeSpentSeconds: 95,
    },
    {
      id: 'att-init-2',
      exerciseId: 'ex-sql-03',
      domainId: 'domain-2',
      topicId: 'd2-t3',
      exerciseType: 'sql',
      isCorrect: false,
      submittedAnswer: 'SELECT category, SUM(unit_price * quantity) AS total_revenue FROM products JOIN order_items ON products.product_id = order_items.product_id WHERE SUM(unit_price * quantity) > 1000 GROUP BY category;',
      timestamp: '2026-11-08T16:40:00Z',
      timeSpentSeconds: 140,
    },
    {
      id: 'att-init-3',
      exerciseId: 'ex-stats-01',
      domainId: 'domain-4',
      topicId: 'd4-t1',
      exerciseType: 'statistics',
      isCorrect: false,
      submittedAnswer: 'Mean ($238,000)',
      timestamp: '2026-11-08T18:10:00Z',
      timeSpentSeconds: 60,
    },
  ],
  mistakeRecords: [
    {
      id: 'mstk-init-1',
      exerciseId: 'ex-sql-03',
      exerciseTitle: 'Category Revenue Rollup with HAVING',
      domainId: 'domain-2',
      domainName: 'SQL & Database Management',
      topicId: 'd2-t3',
      topicTitle: 'Aggregations, Grouping & Multi-Table Joins',
      exerciseType: 'sql',
      submittedAnswer: 'WHERE SUM(unit_price * quantity) > 1000 GROUP BY category',
      expectedAnswer: 'GROUP BY p.category HAVING SUM(oi.unit_price * oi.quantity) > 1000',
      errorCategory: 'SQL Query & Syntax',
      explanation: 'Aggregate functions like SUM() cannot be placed inside a WHERE clause because WHERE filters individual rows before grouping. Use HAVING after GROUP BY to filter aggregated totals.',
      attemptDate: '2026-11-08T16:40:00Z',
      attemptCount: 2,
      reviewStatus: 'needs_review',
    },
    {
      id: 'mstk-init-2',
      exerciseId: 'ex-stats-01',
      exerciseTitle: 'Central Tendency Under Extreme Skewness',
      domainId: 'domain-4',
      domainName: 'Mathematics & Statistics',
      topicId: 'd4-t1',
      topicTitle: 'Descriptive Statistics & Data Distributions',
      exerciseType: 'statistics',
      submittedAnswer: 'Mean ($238,000)',
      expectedAnswer: 'Median ($52,000)',
      errorCategory: 'Statistical Calculation',
      explanation: 'When a dataset contains extreme right-skewed outliers (such as a $1,000,000 executive compensation package among entry-level salaries), the Arithmetic Mean is heavily distorted upward. The Median (50th percentile) is outlier-resistant.',
      attemptDate: '2026-11-08T18:10:00Z',
      attemptCount: 1,
      reviewStatus: 'marked_for_revision',
    },
  ],
  savedFindings: [
    {
      id: 'find-init-1',
      datasetId: 'ds-ecommerce-2026',
      datasetName: 'Global E-Commerce Orders (2026)',
      title: 'B2B Enterprise Orders Drive Margin Variance',
      observation: 'Orders in the Electronics category from Enterprise accounts exhibit 2.4x higher average order value ($1,840 vs $760) but have 16% missing discount code attribution.',
      metricSummary: 'Mean Order: $842.50 | Missing Discount Codes: 4 rows (16%)',
      createdAt: '2026-11-08T12:00:00Z',
    },
  ],
  challengeProgress: {
    'ch-01': {
      challengeId: 'ch-01',
      status: 'in_progress',
      draftCode: `-- Work in progress draft for Fintech Fraud Detection
SELECT customer_id, COUNT(order_id) AS velocity_1h
FROM orders
GROUP BY customer_id;`,
      taskAnswers: {},
      timeSpentSeconds: 180,
    },
  },
  completedChallengeIds: [],
  simulationSubmissions: {},
  detectiveProgress: {},
  competitionSubmissions: {},
  portfolioProjects: INITIAL_PORTFOLIO_PROJECTS,
  portfolioVisibility: {
    isPublic: true,
    headline: 'Aspiring Analytics Engineer & Business Intelligence Specialist',
    customBio: 'Passionate about translating relational event telemetry and financial data into clear, actionable executive strategy.',
    highlightProjectIds: ['proj-01'],
    showContactEmail: true,
    showAchievements: true,
    allowComments: true,
  },
  teams: INITIAL_TEAMS,
  discussions: INITIAL_COMMUNITY_DISCUSSIONS,
  currentStreak: 6,
  longestStreak: 14,
  lastActiveDate: new Date().toISOString().split('T')[0],
  xp: 420,
  level: 3,
  preferences: {
    theme: 'dark',
    enableAIAssistant: true,
    soundEffects: true,
    weeklyGoalMinutes: 180,
    isPortfolioPublic: true,
  },
  createdAt: '2026-10-01T09:00:00Z',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-query',
    title: 'First Query Written',
    description: 'Execute your first verified SQL statement without syntax errors.',
    category: 'learning',
    icon: 'Terminal',
    xpReward: 25,
    unlockedAt: '2026-10-02T14:22:00Z',
    progress: 100,
    criteria: 'Complete 1 SQL practice query'
  },
  {
    id: 'ach-streak-week',
    title: 'Consistency Sentinel',
    description: 'Maintain a consecutive 7-day daily learning streak.',
    category: 'streak',
    icon: 'Flame',
    xpReward: 50,
    unlockedAt: null,
    progress: 85, // 6/7 days
    criteria: '7 continuous active days'
  },
  {
    id: 'ach-data-wrangler',
    title: 'Data Sanitizer',
    description: 'Successfully clean a raw dataset with nulls, outliers, and type mismatches.',
    category: 'mastery',
    icon: 'Sparkles',
    xpReward: 75,
    unlockedAt: null,
    progress: 40,
    criteria: 'Complete Data Cleaning Domain assessments'
  },
  {
    id: 'ach-first-challenge',
    title: 'The Real World Awaits',
    description: 'Submit an analytical solution to a community business challenge.',
    category: 'challenge',
    icon: 'Trophy',
    xpReward: 100,
    unlockedAt: null,
    progress: 0,
    criteria: 'Submit 1 challenge solution'
  },
  {
    id: 'ach-portfolio-ready',
    title: 'Public Master',
    description: 'Publish your first verified project to your public portfolio.',
    category: 'mastery',
    icon: 'FolderGit2',
    xpReward: 150,
    unlockedAt: null,
    progress: 0,
    criteria: 'Create and publish 1 portfolio case study'
  }
];

export const INITIAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'msn-sql-filter',
    title: 'Master the Filter Context',
    description: 'Filter customer transactions using CASE and COALESCE expressions in SQL.',
    domainId: 'domain-2',
    estimatedMinutes: 15,
    xpReward: 35,
    completed: true,
    actionUrl: '/platform/academies/sql-database-management'
  },
  {
    id: 'msn-eda-profiling',
    title: 'Detect E-Commerce Outliers',
    description: 'Inspect IQR distribution fences on order total amounts in the Dataset Playground.',
    domainId: 'domain-6',
    estimatedMinutes: 20,
    xpReward: 40,
    completed: false,
    actionUrl: '/platform/playground'
  },
  {
    id: 'msn-viz-chart-select',
    title: 'Chart Selection Drill',
    description: 'Identify the misleading visual representation in a stakeholder executive report.',
    domainId: 'domain-5',
    estimatedMinutes: 10,
    xpReward: 25,
    completed: false,
    actionUrl: '/platform/practice'
  }
];
