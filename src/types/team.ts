export type TeamRole = 'lead' | 'analyst' | 'reviewer';

export interface TeamMember {
  userId: string;
  name: string;
  role: TeamRole;
  avatar?: string;
  email?: string;
  joinedAt: string;
}

export type TeamTaskStatus = 'todo' | 'in_progress' | 'completed';

export interface TeamTask {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  assignedToUserId?: string;
  assignedToName?: string;
  status: TeamTaskStatus;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TeamMessage {
  id: string;
  teamId: string;
  authorId: string;
  authorName: string;
  authorRole: TeamRole;
  content: string;
  createdAt: string;
}

export interface TeamChallengeAssignment {
  challengeId: string;
  challengeTitle: string;
  assignedAt: string;
  status: 'active' | 'submitted' | 'reviewed';
  score?: number;
  teamDeliverableText?: string;
  submittedAt?: string;
  feedback?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  inviteCode: string; // 6-character code
  creatorId: string;
  focusDomain: string;
  members: TeamMember[];
  tasks: TeamTask[];
  messages: TeamMessage[];
  activeChallenge?: TeamChallengeAssignment;
  createdAt: string;
  updatedAt: string;
}
