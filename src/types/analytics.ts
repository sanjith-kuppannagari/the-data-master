export interface DomainSkillAnalytics {
  domainId: string;
  domainName: string;
  classification: string;
  priorityLevel: string;
  topicsTotal: number;
  topicsCompleted: number;
  exercisesAttempted: number;
  exercisesCorrect: number;
  accuracyRate: number; // 0 - 100
  timeSpentSeconds: number;
  masteryScore: number; // 0 - 100 derived from completion, accuracy, and challenges
  areasOfDifficulty: string[];
  nextRecommendedStep: string;
}

export interface ActivityTimelineItem {
  id: string;
  type: 'lesson' | 'exercise' | 'challenge' | 'simulation' | 'project' | 'revision' | 'competition';
  title: string;
  domainName: string;
  timestamp: string;
  details: string;
  score?: number;
  timeSpentSeconds?: number;
  status: 'completed' | 'in_progress' | 'failed';
}

export interface UserAnalyticsSummary {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompletedCount: number;
  exercisesAttemptedCount: number;
  exercisesSolvedCount: number;
  overallAccuracyRate: number; // 0 - 100
  challengesCompletedCount: number;
  projectsPublishedCount: number;
  projectsTotalCount: number;
  totalTimeTrackedSeconds: number;
  mistakesLoggedCount: number;
  mistakesResolvedCount: number;
  mistakeResolutionRate: number; // 0 - 100
  domainAnalytics: DomainSkillAnalytics[];
  recentActivity: ActivityTimelineItem[];
  weeklyActivityDistribution: { day: string; date: string; activitiesCount: number; minutesTracked: number }[];
  accuracyTrends: { date: string; cumulativeAccuracy: number; rollingAttempts: number }[];
}

export interface AnalyticsFilterOptions {
  dateRange: 'all_time' | 'last_30_days' | 'last_7_days';
  domainId?: string;
  activityType?: 'all' | 'lesson' | 'exercise' | 'challenge' | 'project';
}
