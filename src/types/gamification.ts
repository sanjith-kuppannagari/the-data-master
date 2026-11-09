export type ActivityType =
  | 'lesson'
  | 'exercise'
  | 'revision'
  | 'assessment'
  | 'mission'
  | 'challenge'
  | 'project'
  | 'simulation';

export interface XPTransaction {
  id: string; // Deterministic format: `${userId}:${activityType}:${activityId}`
  userId: string;
  activityType: ActivityType;
  activityId: string;
  xpAwarded: number;
  timestamp: string;
  repeatable: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'streak' | 'challenge' | 'mastery';
  icon: string;
  xpReward: number;
  unlockedAt: string | null;
  progress: number; // 0 - 100
  criteria: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  domainId: string;
  estimatedMinutes: number;
  xpReward: number;
  completed: boolean;
  actionUrl: string;
}
