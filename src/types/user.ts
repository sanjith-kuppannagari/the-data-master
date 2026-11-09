import { MistakeRecord, PracticeAttempt, SavedFinding } from './practice';
import { ChallengeProgress } from './challenge';
import { PortfolioProject, PortfolioVisibilitySettings } from './portfolio';
import { CommunityDiscussion } from './community';
import { Team } from './team';
import { PlannedSession } from './calendar';
import { AppNotification, NotificationPreferences } from './notification';

export type ExperienceLevel = 'Complete beginner' | 'Basic knowledge' | 'Intermediate' | 'Advanced';

export type LearningStyle =
  | 'Short lessons'
  | 'Hands-on exercises'
  | 'Real-world datasets'
  | 'Business case studies'
  | 'Projects'
  | 'Competitions'
  | 'A combination of everything';

export interface UserPreferences {
  theme: 'dark' | 'light';
  enableAIAssistant: boolean;
  soundEffects: boolean;
  weeklyGoalMinutes: number;
  isPortfolioPublic: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  dailyCommitmentMinutes: number;
  learningStyles: LearningStyle[];
  primaryGoals: string[];
  intendedOutcomes?: string[];
  selectedDomainIds: string[];
  completedTopicIds: string[];
  completedLessonIds?: string[];
  lessonScores?: Record<string, number>;
  completedActivityIds: string[];
  practiceAttempts?: PracticeAttempt[];
  mistakeRecords?: MistakeRecord[];
  savedFindings?: SavedFinding[];
  challengeProgress?: Record<string, ChallengeProgress>;
  completedChallengeIds?: string[];
  simulationSubmissions?: Record<
    string,
    {
      answers: Record<string, any>;
      recommendation: string;
      score: number;
      feedback: string;
      completedAt: string;
    }
  >;
  detectiveProgress?: Record<
    string,
    {
      discoveredClueIds: number[];
      answers: Record<string, any>;
      verdictSubmitted: string;
      isSolved: boolean;
      completedAt?: string;
    }
  >;
  competitionSubmissions?: Record<
    string,
    {
      submissionText: string;
      score: number;
      rank?: number;
      submittedAt: string;
    }
  >;
  portfolioProjects?: PortfolioProject[];
  portfolioVisibility?: PortfolioVisibilitySettings;
  teams?: Team[];
  discussions?: CommunityDiscussion[];
  plannedSessions?: PlannedSession[];
  notifications?: AppNotification[];
  notificationPreferences?: NotificationPreferences;
  claimedMissionIds?: string[];
  unlockedAchievementIds?: string[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  xp: number;
  level: number;
  onboardingCompleted?: boolean;
  preferences: UserPreferences;
  createdAt: string;
}
