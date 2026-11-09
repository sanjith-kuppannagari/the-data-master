export interface PlannedSession {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  domainId: string;
  domainName: string;
  targetMinutes: number;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface CalendarDayActivity {
  date: string; // YYYY-MM-DD
  hasActivity: boolean;
  lessonsCompleted: number;
  exercisesAttempted: number;
  challengesCompleted: number;
  projectsWorked: number;
  minutesSpent: number;
  plannedSessions: PlannedSession[];
  revisionReminders: string[];
}
