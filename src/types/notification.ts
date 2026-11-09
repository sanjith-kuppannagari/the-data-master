export type NotificationType =
  | 'learning_reminder'
  | 'incomplete_lesson'
  | 'revision_recommendation'
  | 'challenge_deadline'
  | 'achievement_unlock'
  | 'team_activity'
  | 'platform_update';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationPreferences {
  streakReminders: boolean;
  revisionAlerts: boolean;
  challengeUpdates: boolean;
  teamNotifications: boolean;
  achievementPops: boolean;
}
