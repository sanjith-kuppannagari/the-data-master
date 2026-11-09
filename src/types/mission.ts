export type MissionCadence = 'daily' | 'weekly';

export interface MissionGoal {
  id: string;
  title: string;
  description: string;
  cadence: MissionCadence;
  domainId?: string;
  domainName?: string;
  category: 'lesson' | 'exercise' | 'revision' | 'challenge' | 'playground' | 'project';
  targetCount: number;
  currentCount: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  expiresAt: string; // ISO date
  actionUrl: string;
  actionLabel: string;
}
