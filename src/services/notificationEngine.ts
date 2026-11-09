import { UserProfile } from '../types/user';
import { AppNotification } from '../types/notification';
import { calculateLevelInfo } from './gamification';

/**
 * Evaluates user profile state and generates non-duplicate in-app notifications
 */
export const syncInAppNotifications = (user: UserProfile): AppNotification[] => {
  const existingNotifications = user.notifications || [];
  const existingIds = new Set(existingNotifications.map(n => n.id));
  const newNotifications: AppNotification[] = [...existingNotifications];
  const now = new Date().toISOString();

  const prefs = user.notificationPreferences || {
    streakReminders: true,
    revisionAlerts: true,
    challengeUpdates: true,
    teamNotifications: true,
    achievementPops: true,
  };

  // 1. Streak Preservation Alert
  if (prefs.streakReminders && user.currentStreak > 0) {
    const streakNotifId = `notif-streak-${user.currentStreak}`;
    if (!existingIds.has(streakNotifId)) {
      newNotifications.unshift({
        id: streakNotifId,
        type: 'learning_reminder',
        title: `${user.currentStreak}-Day Streak Active!`,
        message: `Complete a 15-minute practice session or lesson today to defend your ${user.currentStreak}-day learning momentum.`,
        timestamp: now,
        read: false,
        actionUrl: '/platform/practice',
        actionLabel: 'Practice Now',
        priority: 'high',
      });
      existingIds.add(streakNotifId);
    }
  }

  // 2. Unresolved Mistake Revision Alerts
  if (prefs.revisionAlerts) {
    const unresolved = (user.mistakeRecords || []).filter(m => m.reviewStatus !== 'resolved');
    if (unresolved.length > 0) {
      const mistakeNotifId = `notif-revision-${unresolved.length}`;
      if (!existingIds.has(mistakeNotifId)) {
        newNotifications.unshift({
          id: mistakeNotifId,
          type: 'revision_recommendation',
          title: 'Smart Revision Queue Pending',
          message: `You have ${unresolved.length} unresolved mistake${unresolved.length === 1 ? '' : 's'} flagged for revision. Revisit now to reinforce mental models.`,
          timestamp: now,
          read: false,
          actionUrl: '/platform/mistakes',
          actionLabel: 'Review Mistakes',
          priority: 'normal',
        });
        existingIds.add(mistakeNotifId);
      }
    }
  }

  // 3. Level-Up Milestone Proximity
  const levelInfo = calculateLevelInfo(user.xp);
  if (levelInfo.xpNeededForNext <= 80 && levelInfo.xpNeededForNext > 0) {
    const levelNotifId = `notif-levelup-${levelInfo.level + 1}`;
    if (!existingIds.has(levelNotifId)) {
      newNotifications.unshift({
        id: levelNotifId,
        type: 'achievement_unlock',
        title: `Level ${levelInfo.level + 1} Approaching!`,
        message: `You are only ${levelInfo.xpNeededForNext} XP away from reaching Level ${levelInfo.level + 1}.`,
        timestamp: now,
        read: false,
        actionUrl: '/platform/journey',
        actionLabel: 'View Journey',
        priority: 'normal',
      });
      existingIds.add(levelNotifId);
    }
  }

  // 4. Team Task Notification
  if (prefs.teamNotifications && user.teams && user.teams.length > 0) {
    const myTasks = user.teams
      .flatMap(t => t.tasks)
      .filter(task => task.assignedToUserId === user.id && task.status !== 'completed');

    if (myTasks.length > 0) {
      const taskNotifId = `notif-team-tasks-${myTasks.length}`;
      if (!existingIds.has(taskNotifId)) {
        newNotifications.unshift({
          id: taskNotifId,
          type: 'team_activity',
          title: 'Squad Responsibility Assigned',
          message: `You have ${myTasks.length} pending deliverable${myTasks.length === 1 ? '' : 's'} assigned in your collaborative squad matrix.`,
          timestamp: now,
          read: false,
          actionUrl: '/platform/teams',
          actionLabel: 'Open Squad Studio',
          priority: 'normal',
        });
        existingIds.add(taskNotifId);
      }
    }
  }

  // 5. Weekly Challenge Notice
  if (prefs.challengeUpdates) {
    const sprintNotifId = 'notif-weekly-sprint-active';
    if (!existingIds.has(sprintNotifId)) {
      newNotifications.unshift({
        id: sprintNotifId,
        type: 'challenge_deadline',
        title: 'Weekly Analytical Sprint Open',
        message: 'The Rapid SQL Optimization Sprint is active. Submit your benchmark deliverable to place on the verified leaderboard.',
        timestamp: now,
        read: false,
        actionUrl: '/platform/challenges',
        actionLabel: 'View Sprint',
        priority: 'low',
      });
      existingIds.add(sprintNotifId);
    }
  }

  return newNotifications;
};
