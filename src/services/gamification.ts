import { ActivityType, XPTransaction } from '../types/gamification';

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  currentLevelXP: number;
  xpNeededForNext: number;
  progressPercent: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Data Apprentice', minXP: 0, maxXP: 150 },
  { level: 2, title: 'Query Explorer', minXP: 150, maxXP: 350 },
  { level: 3, title: 'Analytical Practitioner', minXP: 350, maxXP: 650 },
  { level: 4, title: 'Insight Architect', minXP: 650, maxXP: 1050 },
  { level: 5, title: 'Metric Strategist', minXP: 1050, maxXP: 1550 },
  { level: 6, title: 'Senior Data Craftsman', minXP: 1550, maxXP: 2200 },
  { level: 7, title: 'Domain Specialist', minXP: 2200, maxXP: 3000 },
  { level: 8, title: 'Principal Investigator', minXP: 3000, maxXP: 4000 },
  { level: 9, title: 'Observatory Master', minXP: 4000, maxXP: 5500 },
  { level: 10, title: 'The Data Master', minXP: 5500, maxXP: 10000 },
];

export const calculateLevelInfo = (xp: number): LevelInfo => {
  const current = LEVEL_THRESHOLDS.find(t => xp >= t.minXP && xp < t.maxXP) ||
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const range = current.maxXP - current.minXP;
  const currentLevelXP = Math.max(0, xp - current.minXP);
  const xpNeededForNext = Math.max(0, current.maxXP - xp);
  const progressPercent = Math.min(100, Math.round((currentLevelXP / range) * 100));

  return {
    level: current.level,
    title: current.title,
    minXP: current.minXP,
    maxXP: current.maxXP,
    currentLevelXP,
    xpNeededForNext,
    progressPercent,
  };
};

/**
 * Creates a unique deterministic transaction id to prevent duplicate awards.
 */
export const buildTransactionId = (userId: string, activityType: ActivityType, activityId: string): string => {
  return `${userId}:${activityType}:${activityId}`;
};

/**
 * Evaluates whether an activity can grant XP or is a zero-XP duplicate attempt.
 */
export const evaluateXPReward = (
  userId: string,
  activityType: ActivityType,
  activityId: string,
  baseXP: number,
  completedActivityIds: string[],
  repeatable: boolean = false
): { xpAwarded: number; isDuplicate: boolean; transaction: XPTransaction } => {
  const transactionId = buildTransactionId(userId, activityType, activityId);
  const isDuplicate = !repeatable && completedActivityIds.includes(transactionId);
  const xpAwarded = isDuplicate ? 0 : baseXP;

  return {
    xpAwarded,
    isDuplicate,
    transaction: {
      id: transactionId,
      userId,
      activityType,
      activityId,
      xpAwarded,
      timestamp: new Date().toISOString(),
      repeatable,
    },
  };
};

/**
 * Calculates updated streak given the last active date and today's date.
 */
export const calculateUpdatedStreak = (
  lastActiveDateStr: string | null,
  currentStreak: number
): { streak: number; isExtended: boolean } => {
  const today = new Date().toISOString().split('T')[0];
  if (!lastActiveDateStr) {
    return { streak: 1, isExtended: true };
  }

  if (lastActiveDateStr === today) {
    // Already active today; streak remains unchanged
    return { streak: currentStreak, isExtended: false };
  }

  const lastActive = new Date(lastActiveDateStr);
  const currentDate = new Date(today);
  const diffDays = Math.round((currentDate.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return { streak: currentStreak + 1, isExtended: true };
  } else if (diffDays > 1) {
    // Streak broken; reset to 1
    return { streak: 1, isExtended: true };
  }

  return { streak: currentStreak, isExtended: false };
};
