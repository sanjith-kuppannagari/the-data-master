import { Achievement } from '../types/gamification';

export const ADVANCED_ACHIEVEMENTS: Achievement[] = [
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
    id: 'ach-first-step',
    title: 'The Learning Spark',
    description: 'Complete your first structured bite-sized curriculum lesson.',
    category: 'learning',
    icon: 'BookOpen',
    xpReward: 30,
    unlockedAt: '2026-10-01T10:00:00Z',
    progress: 100,
    criteria: 'Complete 1 lesson'
  },
  {
    id: 'ach-streak-week',
    title: 'Consistency Sentinel',
    description: 'Maintain a consecutive 7-day active daily learning streak.',
    category: 'streak',
    icon: 'Flame',
    xpReward: 50,
    unlockedAt: null,
    progress: 85, // 6/7 days
    criteria: '7 continuous active days'
  },
  {
    id: 'ach-streak-14',
    title: 'Fortress of Habit',
    description: 'Maintain an uninterrupted 14-day daily learning streak.',
    category: 'streak',
    icon: 'Shield',
    xpReward: 100,
    unlockedAt: null,
    progress: 43, // 6/14 days
    criteria: '14 continuous active days'
  },
  {
    id: 'ach-streak-30',
    title: 'Observatory Centurion',
    description: 'Maintain a 30-day streak of daily analytical exploration.',
    category: 'streak',
    icon: 'Trophy',
    xpReward: 250,
    unlockedAt: null,
    progress: 20, // 6/30 days
    criteria: '30 continuous active days'
  },
  {
    id: 'ach-milestone-pioneer',
    title: 'Milestone Pioneer',
    description: 'Complete all prerequisite topics within Milestone 1 of your learning path.',
    category: 'learning',
    icon: 'Milestone',
    xpReward: 75,
    unlockedAt: null,
    progress: 60,
    criteria: 'Complete Milestone 1 topics'
  },
  {
    id: 'ach-flawless-execution',
    title: 'Flawless Execution',
    description: 'Solve 5 practice exercises in a row without a single error.',
    category: 'mastery',
    icon: 'Target',
    xpReward: 50,
    unlockedAt: null,
    progress: 60,
    criteria: '5 consecutive correct practice attempts'
  },
  {
    id: 'ach-precision-analyst',
    title: 'Precision Analyst',
    description: 'Achieve an overall practice accuracy rate of 80% or higher across at least 10 exercises.',
    category: 'mastery',
    icon: 'CheckCircle2',
    xpReward: 100,
    unlockedAt: null,
    progress: 75,
    criteria: '≥80% accuracy across 10+ exercises'
  },
  {
    id: 'ach-multi-disciplinary',
    title: 'Multi-Disciplinary Mind',
    description: 'Complete topics across at least 4 distinct curriculum domains.',
    category: 'mastery',
    icon: 'Layers',
    xpReward: 80,
    unlockedAt: null,
    progress: 75, // 3/4 domains
    criteria: 'Completed topics in 4+ domains'
  },
  {
    id: 'ach-first-challenge',
    title: 'The Real World Awaits',
    description: 'Submit an analytical solution to a community business challenge.',
    category: 'challenge',
    icon: 'Swords',
    xpReward: 50,
    unlockedAt: null,
    progress: 50,
    criteria: 'Submit 1 challenge deliverable'
  },
  {
    id: 'ach-crisis-commander',
    title: 'Crisis Commander',
    description: 'Complete an executive business crisis simulation with a rubric score of 70% or higher.',
    category: 'challenge',
    icon: 'Briefcase',
    xpReward: 100,
    unlockedAt: null,
    progress: 0,
    criteria: 'Score ≥70% in 1 business simulation'
  },
  {
    id: 'ach-forensic-sleuth',
    title: 'Forensic Sleuth',
    description: 'Correctly identify the root cause and solve a Data Detective analytical mystery.',
    category: 'challenge',
    icon: 'Search',
    xpReward: 75,
    unlockedAt: null,
    progress: 0,
    criteria: 'Solve 1 Data Detective mystery case'
  },
  {
    id: 'ach-case-study-architect',
    title: 'Case Study Architect',
    description: 'Author and publish your first verified case study to your analytical portfolio.',
    category: 'mastery',
    icon: 'FolderGit2',
    xpReward: 150,
    unlockedAt: '2026-10-28T14:30:00Z',
    progress: 100,
    criteria: 'Publish 1 portfolio project'
  },
  {
    id: 'ach-mistake-eradicator',
    title: 'Resilient Mindset',
    description: 'Revisit a flagged practice error in your Mistake Journal and resolve it with a correct answer.',
    category: 'learning',
    icon: 'Sparkles',
    xpReward: 50,
    unlockedAt: null,
    progress: 50,
    criteria: 'Resolve 1 mistake in Mistake Journal'
  },
  {
    id: 'ach-podium-contender',
    title: 'Podium Contender',
    description: 'Submit a verified deliverable to a weekly analytical sprint or monthly community cup.',
    category: 'challenge',
    icon: 'Award',
    xpReward: 75,
    unlockedAt: null,
    progress: 0,
    criteria: 'Participate in 1 community competition'
  },
  {
    id: 'ach-squad-collaborator',
    title: 'Squad Collaborator',
    description: 'Create or join a collaborative study squad and assign responsibility matrix tasks.',
    category: 'learning',
    icon: 'Users',
    xpReward: 50,
    unlockedAt: '2026-10-01T08:00:00Z',
    progress: 100,
    criteria: 'Join or create 1 team'
  }
];
