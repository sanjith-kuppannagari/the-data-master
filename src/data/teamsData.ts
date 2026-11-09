import { Team } from '../types/team';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-01',
    name: 'Alpha Analytics Syndicate',
    description: 'Collaborative cohort focused on mastering relational SQL query tuning, executive business simulations, and Kaggle-style case studies.',
    inviteCode: 'AAS701',
    creatorId: 'user-demo-001',
    focusDomain: 'SQL & Business Analytics',
    members: [
      {
        userId: 'user-demo-001',
        name: 'Alex Mercer',
        role: 'lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        email: 'alex.mercer@datamaster.io',
        joinedAt: '2026-10-01T08:00:00Z'
      },
      {
        userId: 'member-elena-02',
        name: 'Elena Rostova',
        role: 'analyst',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        email: 'elena.rostova@analytics.dev',
        joinedAt: '2026-10-02T10:15:00Z'
      },
      {
        userId: 'member-jordan-03',
        name: 'Jordan Smith',
        role: 'reviewer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        email: 'jordan.smith@code.io',
        joinedAt: '2026-10-03T14:30:00Z'
      }
    ],
    tasks: [
      {
        id: 'task-01',
        teamId: 'team-01',
        title: 'Extract raw transaction logs and profile missing value distribution',
        assignedToUserId: 'member-elena-02',
        assignedToName: 'Elena Rostova',
        status: 'completed',
        dueDate: '2026-11-12',
        createdAt: '2026-11-01T09:00:00Z',
        completedAt: '2026-11-04T16:00:00Z'
      },
      {
        id: 'task-02',
        teamId: 'team-01',
        title: 'Develop multi-stage cohort retention CTE queries with window functions',
        assignedToUserId: 'user-demo-001',
        assignedToName: 'Alex Mercer',
        status: 'in_progress',
        dueDate: '2026-11-15',
        createdAt: '2026-11-02T11:00:00Z'
      },
      {
        id: 'task-03',
        teamId: 'team-01',
        title: 'Perform peer review on SQL query execution plan and verify indexes',
        assignedToUserId: 'member-jordan-03',
        assignedToName: 'Jordan Smith',
        status: 'todo',
        dueDate: '2026-11-18',
        createdAt: '2026-11-02T11:30:00Z'
      }
    ],
    messages: [
      {
        id: 'msg-01',
        teamId: 'team-01',
        authorId: 'user-demo-001',
        authorName: 'Alex Mercer',
        authorRole: 'lead',
        content: 'Welcome team! Let\'s tackle the Retail Sales Decline challenge this week. Elena has already sanitized the transaction logs.',
        createdAt: '2026-11-02T12:00:00Z'
      },
      {
        id: 'msg-02',
        teamId: 'team-01',
        authorId: 'member-elena-02',
        authorName: 'Elena Rostova',
        authorRole: 'analyst',
        content: 'Completed the profiling. Note that the non-US customer timestamps were logged in UTC while US was in EST; I normalized everything to UTC.',
        createdAt: '2026-11-04T16:05:00Z'
      }
    ],
    activeChallenge: {
      challengeId: 'ch-01',
      challengeTitle: 'E-Commerce Omnichannel Customer Churn & Cohort Retention',
      assignedAt: '2026-11-01T09:00:00Z',
      status: 'active'
    },
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-11-04T16:05:00Z'
  }
];
