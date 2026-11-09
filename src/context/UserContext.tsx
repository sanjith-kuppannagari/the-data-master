import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/user';
import { ActivityType } from '../types/gamification';
import { ErrorCategory, ExerciseType, MistakeRecord, PracticeAttempt, SavedFinding } from '../types/practice';
import { PortfolioProject, PortfolioVisibilitySettings } from '../types/portfolio';
import { CommunityDiscussion, CommunityReply, DiscussionCategory } from '../types/community';
import { Team, TeamTask, TeamMessage, TeamTaskStatus } from '../types/team';
import { PlannedSession } from '../types/calendar';
import { AppNotification, NotificationPreferences } from '../types/notification';
import { INITIAL_DEMO_USER } from '../data/sampleData';
import { storage } from '../services/storage';
import { calculateLevelInfo, evaluateXPReward, calculateUpdatedStreak } from '../services/gamification';
import { backendService } from '../services/backend/backendService';
import { CloudSyncStatus } from '../services/backend/types';
import confetti from 'canvas-confetti';

export interface RecordPracticeAttemptInput {
  exerciseId: string;
  exerciseTitle: string;
  domainId: string;
  domainName: string;
  topicId: string;
  topicTitle: string;
  exerciseType: ExerciseType;
  isCorrect: boolean;
  submittedAnswer: string;
  expectedAnswer: string;
  errorCategory: ErrorCategory;
  explanation: string;
  xpReward: number;
  timeSpentSeconds?: number;
}

interface UserContextValue {
  user: UserProfile;
  isAuthenticated: boolean;
  isDemoSession: boolean;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: string | null;
  syncError: string | null;
  isCloudConnected: boolean;
  login: (email: string, name?: string, password?: string) => Promise<void> | void;
  logout: () => Promise<void> | void;
  syncWithCloud: () => Promise<{ success: boolean; error?: string }>;
  exportUserData: () => string;
  importUserData: (jsonString: string) => { success: boolean; error?: string };
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeActivity: (
    activityType: ActivityType,
    activityId: string,
    baseXP: number,
    repeatable?: boolean
  ) => { xpAwarded: number; isDuplicate: boolean };
  completeTopic: (topicId: string, xpReward?: number) => void;
  recordPracticeAttempt: (
    input: RecordPracticeAttemptInput
  ) => { xpAwarded: number; isDuplicate: boolean; mistakeResolved: boolean };
  updateMistakeStatus: (
    mistakeId: string,
    status: 'needs_review' | 'marked_for_revision' | 'resolved'
  ) => void;
  saveDatasetFinding: (finding: Omit<SavedFinding, 'id' | 'createdAt'>) => SavedFinding;
  deleteDatasetFinding: (findingId: string) => void;
  saveChallengeDraft: (
    challengeId: string,
    draftCode?: string,
    draftWritten?: string,
    taskAnswers?: Record<string, any>,
    timeSpentSeconds?: number
  ) => void;
  submitChallenge: (
    challengeId: string,
    score: number,
    feedback: string,
    xpReward: number,
    taskAnswers?: Record<string, any>,
    timeSpentSeconds?: number
  ) => { xpAwarded: number; isDuplicate: boolean };
  submitSimulation: (
    simulationId: string,
    answers: Record<string, any>,
    recommendation: string,
    score: number,
    feedback: string,
    xpReward: number
  ) => { xpAwarded: number; isDuplicate: boolean };
  submitDetectiveVerdict: (
    mysteryId: string,
    discoveredClueIds: number[],
    answers: Record<string, any>,
    verdictSubmitted: string,
    isSolved: boolean,
    xpReward: number
  ) => { xpAwarded: number; isDuplicate: boolean };
  submitCompetitionEntry: (
    competitionId: string,
    submissionText: string,
    score: number,
    xpReward: number
  ) => { xpAwarded: number; isDuplicate: boolean };
  // Phase 5 Portfolio
  saveProject: (project: PortfolioProject) => PortfolioProject;
  deleteProject: (projectId: string) => void;
  publishProject: (projectId: string) => { xpAwarded: number; isDuplicate: boolean };
  unpublishProject: (projectId: string) => void;
  updatePortfolioVisibility: (settings: Partial<PortfolioVisibilitySettings>) => void;
  // Phase 5 Community
  createDiscussion: (input: {
    title: string;
    category: DiscussionCategory;
    content: string;
    tags: string[];
    domainId?: string;
  }) => CommunityDiscussion;
  updateDiscussion: (discussionId: string, content: string) => void;
  deleteDiscussion: (discussionId: string) => void;
  addReply: (discussionId: string, content: string) => CommunityReply;
  deleteReply: (discussionId: string, replyId: string) => void;
  toggleUpvoteDiscussion: (discussionId: string) => void;
  reportDiscussion: (discussionId: string, reason: string) => void;
  // Phase 5 Collaboration & Teams
  createTeam: (name: string, description: string, focusDomain: string) => Team;
  joinTeam: (inviteCode: string) => { success: boolean; message: string; team?: Team };
  leaveTeam: (teamId: string) => void;
  assignTeamTask: (teamId: string, task: Omit<TeamTask, 'id' | 'createdAt' | 'teamId'>) => TeamTask;
  updateTeamTaskStatus: (teamId: string, taskId: string, status: TeamTaskStatus) => void;
  postTeamMessage: (teamId: string, message: string) => TeamMessage;
  assignTeamChallenge: (teamId: string, challengeId: string, challengeTitle: string) => void;
  submitTeamChallenge: (
    teamId: string,
    challengeId: string,
    deliverableText: string
  ) => { xpAwarded: number; isDuplicate: boolean };
  // Phase 6 Calendar
  addPlannedSession: (session: Omit<PlannedSession, 'id' | 'createdAt'>) => PlannedSession;
  updatePlannedSession: (sessionId: string, updates: Partial<PlannedSession>) => void;
  deletePlannedSession: (sessionId: string) => void;
  // Phase 6 Notifications
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  // Phase 6 Missions & Achievements
  claimMissionReward: (missionId: string, xpReward: number) => { xpAwarded: number; isDuplicate: boolean };
  unlockAchievement: (achievementId: string, xpReward: number) => { xpAwarded: number; isDuplicate: boolean };
  toggleDomainSelection: (domainId: string) => void;
  resetProgress: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const stored = storage.get<UserProfile>('user_profile', INITIAL_DEMO_USER);
    return {
      ...INITIAL_DEMO_USER,
      ...stored,
      practiceAttempts: stored.practiceAttempts ?? INITIAL_DEMO_USER.practiceAttempts ?? [],
      mistakeRecords: stored.mistakeRecords ?? INITIAL_DEMO_USER.mistakeRecords ?? [],
      savedFindings: stored.savedFindings ?? INITIAL_DEMO_USER.savedFindings ?? [],
      challengeProgress: stored.challengeProgress ?? INITIAL_DEMO_USER.challengeProgress ?? {},
      completedChallengeIds: stored.completedChallengeIds ?? INITIAL_DEMO_USER.completedChallengeIds ?? [],
      simulationSubmissions: stored.simulationSubmissions ?? INITIAL_DEMO_USER.simulationSubmissions ?? {},
      detectiveProgress: stored.detectiveProgress ?? INITIAL_DEMO_USER.detectiveProgress ?? {},
      competitionSubmissions: stored.competitionSubmissions ?? INITIAL_DEMO_USER.competitionSubmissions ?? {},
      portfolioProjects: stored.portfolioProjects ?? INITIAL_DEMO_USER.portfolioProjects ?? [],
      portfolioVisibility: stored.portfolioVisibility ?? INITIAL_DEMO_USER.portfolioVisibility,
      teams: stored.teams ?? INITIAL_DEMO_USER.teams ?? [],
      discussions: stored.discussions ?? INITIAL_DEMO_USER.discussions ?? [],
      plannedSessions: stored.plannedSessions ?? INITIAL_DEMO_USER.plannedSessions ?? [],
      notifications: stored.notifications ?? INITIAL_DEMO_USER.notifications ?? [],
      notificationPreferences: stored.notificationPreferences ?? INITIAL_DEMO_USER.notificationPreferences ?? {
        streakReminders: true,
        revisionAlerts: true,
        challengeUpdates: true,
        teamNotifications: true,
        achievementPops: true,
      },
      claimedMissionIds: stored.claimedMissionIds ?? INITIAL_DEMO_USER.claimedMissionIds ?? [],
      unlockedAchievementIds: stored.unlockedAchievementIds ?? INITIAL_DEMO_USER.unlockedAchievementIds ?? [],
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return storage.get<boolean>('is_authenticated', true);
  });

  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>(() => {
    return backendService.isCloudConnected ? 'synced' : 'offline';
  });

  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    return storage.get<string | null>('last_synced_at', null);
  });

  const [syncError, setSyncError] = useState<string | null>(null);

  const isDemoSession = user.email.includes('demo') || user.email.includes('alex.rivera') || !backendService.isCloudConnected;

  // Sync to storage on change
  useEffect(() => {
    storage.set('user_profile', user);
  }, [user]);

  useEffect(() => {
    storage.set('is_authenticated', isAuthenticated);
  }, [isAuthenticated]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      if (updates.xp !== undefined) {
        const { level } = calculateLevelInfo(updated.xp);
        updated.level = level;
      }
      return updated;
    });
  }, []);

  const login = useCallback(async (email: string, name: string = 'Analytical Explorer', password?: string) => {
    if (password) {
      await backendService.adapter.signIn(email, password);
    }
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      email,
      name,
    }));
  }, []);

  const logout = useCallback(async () => {
    await backendService.adapter.signOut();
    setIsAuthenticated(false);
  }, []);

  const syncWithCloud = useCallback(async () => {
    setSyncStatus('syncing');
    setSyncError(null);
    try {
      const result = await backendService.adapter.syncProfile(user);
      setSyncStatus(result.status);
      if (result.success && result.lastSyncedAt) {
        setLastSyncedAt(result.lastSyncedAt);
        storage.set('last_synced_at', result.lastSyncedAt);
      }
      if (!result.success && result.error) {
        setSyncError(result.error);
      }
      return { success: result.success, error: result.error };
    } catch (err: any) {
      setSyncStatus('error');
      setSyncError(err.message || 'Cloud sync failed');
      return { success: false, error: err.message };
    }
  }, [user]);

  const exportUserData = useCallback(() => {
    return backendService.adapter.exportBackupJSON(user);
  }, [user]);

  const importUserData = useCallback((jsonString: string) => {
    const res = backendService.adapter.importBackupJSON(jsonString);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to import data' };
  }, []);

  const completeActivity = useCallback(
    (
      activityType: ActivityType,
      activityId: string,
      baseXP: number,
      repeatable: boolean = false
    ) => {
      let awardedXP = 0;
      let duplicate = false;

      setUser(prev => {
        const { xpAwarded, isDuplicate, transaction } = evaluateXPReward(
          prev.id,
          activityType,
          activityId,
          baseXP,
          prev.completedActivityIds,
          repeatable
        );

        awardedXP = xpAwarded;
        duplicate = isDuplicate;

        const newXP = prev.xp + xpAwarded;
        const { level: newLevel } = calculateLevelInfo(newXP);
        const { streak: updatedStreak } = calculateUpdatedStreak(prev.lastActiveDate, prev.currentStreak);

        if (xpAwarded > 0 && typeof window !== 'undefined') {
          try {
            confetti({
              particleCount: 25,
              spread: 50,
              origin: { y: 0.8 },
              colors: ['#C6F36B', '#75D6D0', '#FFAA73'],
            });
          } catch {
            // Ignore in headless/non-canvas environments
          }
        }

        const newCompletedActivityIds = prev.completedActivityIds.includes(transaction.id)
          ? prev.completedActivityIds
          : [...prev.completedActivityIds, transaction.id];

        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          currentStreak: updatedStreak,
          longestStreak: Math.max(prev.longestStreak, updatedStreak),
          lastActiveDate: new Date().toISOString().split('T')[0],
          completedActivityIds: newCompletedActivityIds,
        };
      });

      return { xpAwarded: awardedXP, isDuplicate: duplicate };
    },
    []
  );

  const completeTopic = useCallback((topicId: string, xpReward: number = 50) => {
    setUser(prev => {
      if (prev.completedTopicIds.includes(topicId)) {
        return prev;
      }
      const newTopics = [...prev.completedTopicIds, topicId];
      const newXP = prev.xp + xpReward;
      const { level: newLevel } = calculateLevelInfo(newXP);

      return {
        ...prev,
        completedTopicIds: newTopics,
        xp: newXP,
        level: newLevel,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
    });
  }, []);

  const recordPracticeAttempt = useCallback((input: RecordPracticeAttemptInput) => {
    let awardedXP = 0;
    let duplicate = false;
    let mistakeResolved = false;

    setUser(prev => {
      const nowIso = new Date().toISOString();
      const newAttempt: PracticeAttempt = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        exerciseId: input.exerciseId,
        domainId: input.domainId,
        topicId: input.topicId,
        exerciseType: input.exerciseType,
        isCorrect: input.isCorrect,
        submittedAnswer: input.submittedAnswer,
        timestamp: nowIso,
        timeSpentSeconds: input.timeSpentSeconds,
      };

      const existingAttempts = prev.practiceAttempts || [];
      const existingMistakes = prev.mistakeRecords || [];
      let updatedMistakes = [...existingMistakes];
      let updatedCompletedActivityIds = [...prev.completedActivityIds];
      let newXP = prev.xp;

      if (input.isCorrect) {
        const { xpAwarded, isDuplicate, transaction } = evaluateXPReward(
          prev.id,
          'exercise',
          input.exerciseId,
          input.xpReward,
          prev.completedActivityIds,
          false
        );
        awardedXP = xpAwarded;
        duplicate = isDuplicate;
        newXP += xpAwarded;

        if (!updatedCompletedActivityIds.includes(transaction.id)) {
          updatedCompletedActivityIds.push(transaction.id);
        }

        // Check if this resolves an existing mistake
        const existingMistakeIdx = updatedMistakes.findIndex(
          m => m.exerciseId === input.exerciseId && m.reviewStatus !== 'resolved'
        );
        if (existingMistakeIdx >= 0) {
          mistakeResolved = true;
          // Award 5 revision XP if resolving a mistake for the first time
          const revEval = evaluateXPReward(
            prev.id,
            'revision',
            `resolve-${input.exerciseId}`,
            5,
            updatedCompletedActivityIds,
            false
          );
          if (revEval.xpAwarded > 0) {
            awardedXP += revEval.xpAwarded;
            newXP += revEval.xpAwarded;
            updatedCompletedActivityIds.push(revEval.transaction.id);
          }
          updatedMistakes[existingMistakeIdx] = {
            ...updatedMistakes[existingMistakeIdx],
            reviewStatus: 'resolved',
            resolvedAt: nowIso,
          };
        }

        if (awardedXP > 0 && typeof window !== 'undefined') {
          try {
            confetti({
              particleCount: 25,
              spread: 50,
              origin: { y: 0.8 },
              colors: ['#C6F36B', '#75D6D0', '#FFAA73'],
            });
          } catch {
            // Ignore in headless environments
          }
        }
      } else {
        // Incorrect attempt: log or update MistakeRecord
        const existingIdx = updatedMistakes.findIndex(m => m.exerciseId === input.exerciseId);
        if (existingIdx >= 0) {
          const current = updatedMistakes[existingIdx];
          updatedMistakes[existingIdx] = {
            ...current,
            submittedAnswer: input.submittedAnswer,
            expectedAnswer: input.expectedAnswer,
            errorCategory: input.errorCategory,
            explanation: input.explanation,
            attemptDate: nowIso,
            attemptCount: current.attemptCount + 1,
            reviewStatus:
              current.reviewStatus === 'resolved' ? 'needs_review' : current.reviewStatus,
          };
        } else {
          const newMistake: MistakeRecord = {
            id: `mstk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            exerciseId: input.exerciseId,
            exerciseTitle: input.exerciseTitle,
            domainId: input.domainId,
            domainName: input.domainName,
            topicId: input.topicId,
            topicTitle: input.topicTitle,
            exerciseType: input.exerciseType,
            submittedAnswer: input.submittedAnswer,
            expectedAnswer: input.expectedAnswer,
            errorCategory: input.errorCategory,
            explanation: input.explanation,
            attemptDate: nowIso,
            attemptCount: 1,
            reviewStatus: 'needs_review',
          };
          updatedMistakes = [newMistake, ...updatedMistakes];
        }
      }

      const { level: newLevel } = calculateLevelInfo(newXP);
      const { streak: updatedStreak } = calculateUpdatedStreak(prev.lastActiveDate, prev.currentStreak);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        currentStreak: updatedStreak,
        longestStreak: Math.max(prev.longestStreak, updatedStreak),
        lastActiveDate: nowIso.split('T')[0],
        completedActivityIds: updatedCompletedActivityIds,
        practiceAttempts: [newAttempt, ...existingAttempts],
        mistakeRecords: updatedMistakes,
      };
    });

    return { xpAwarded: awardedXP, isDuplicate: duplicate, mistakeResolved };
  }, []);

  const updateMistakeStatus = useCallback(
    (mistakeId: string, status: 'needs_review' | 'marked_for_revision' | 'resolved') => {
      setUser(prev => ({
        ...prev,
        mistakeRecords: (prev.mistakeRecords || []).map(m =>
          m.id === mistakeId
            ? {
                ...m,
                reviewStatus: status,
                resolvedAt: status === 'resolved' ? new Date().toISOString() : m.resolvedAt,
              }
            : m
        ),
      }));
    },
    []
  );

  const saveDatasetFinding = useCallback((findingInput: Omit<SavedFinding, 'id' | 'createdAt'>) => {
    const newFinding: SavedFinding = {
      ...findingInput,
      id: `find-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUser(prev => ({
      ...prev,
      savedFindings: [newFinding, ...(prev.savedFindings || [])],
    }));
    return newFinding;
  }, []);

  const deleteDatasetFinding = useCallback((findingId: string) => {
    setUser(prev => ({
      ...prev,
      savedFindings: (prev.savedFindings || []).filter(f => f.id !== findingId),
    }));
  }, []);

  const saveChallengeDraft = useCallback(
    (
      challengeId: string,
      draftCode?: string,
      draftWritten?: string,
      taskAnswers?: Record<string, any>,
      timeSpentSeconds?: number
    ) => {
      setUser(prev => {
        const existing = prev.challengeProgress?.[challengeId];
        const updated = {
          ...prev.challengeProgress,
          [challengeId]: {
            challengeId,
            status: existing?.status || 'in_progress',
            draftCode: draftCode !== undefined ? draftCode : existing?.draftCode,
            draftWrittenResponse: draftWritten !== undefined ? draftWritten : existing?.draftWrittenResponse,
            taskAnswers: taskAnswers !== undefined ? taskAnswers : existing?.taskAnswers || {},
            timeSpentSeconds: (existing?.timeSpentSeconds || 0) + (timeSpentSeconds || 0),
          },
        };
        return {
          ...prev,
          challengeProgress: updated,
        };
      });
    },
    []
  );

  const submitChallenge = useCallback(
    (
      challengeId: string,
      score: number,
      feedback: string,
      xpReward: number,
      taskAnswers?: Record<string, any>,
      timeSpentSeconds?: number
    ) => {
      let awardedXP = 0;
      let duplicate = false;

      setUser(prev => {
        const { xpAwarded, isDuplicate, transaction } = evaluateXPReward(
          prev.id,
          'challenge',
          challengeId,
          xpReward,
          prev.completedActivityIds,
          false
        );

        awardedXP = xpAwarded;
        duplicate = isDuplicate;

        const newXP = prev.xp + xpAwarded;
        const { level: newLevel } = calculateLevelInfo(newXP);
        const { streak: updatedStreak } = calculateUpdatedStreak(prev.lastActiveDate, prev.currentStreak);

        if (xpAwarded > 0 && typeof window !== 'undefined') {
          try {
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.75 },
              colors: ['#FFAA73', '#C6F36B', '#75D6D0'],
            });
          } catch {
            // Ignore in headless environment
          }
        }

        const newCompletedActivityIds = prev.completedActivityIds.includes(transaction.id)
          ? prev.completedActivityIds
          : [...prev.completedActivityIds, transaction.id];

        const newCompletedChallengeIds = prev.completedChallengeIds?.includes(challengeId)
          ? prev.completedChallengeIds
          : [...(prev.completedChallengeIds || []), challengeId];

        const existingProg = prev.challengeProgress?.[challengeId];
        const newChallengeProgress = {
          ...prev.challengeProgress,
          [challengeId]: {
            challengeId,
            status: 'completed' as const,
            score,
            feedback,
            taskAnswers: taskAnswers || existingProg?.taskAnswers || {},
            draftCode: existingProg?.draftCode,
            draftWrittenResponse: existingProg?.draftWrittenResponse,
            timeSpentSeconds: (existingProg?.timeSpentSeconds || 0) + (timeSpentSeconds || 0),
            completedAt: new Date().toISOString(),
          },
        };

        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          currentStreak: updatedStreak,
          longestStreak: Math.max(prev.longestStreak, updatedStreak),
          lastActiveDate: new Date().toISOString().split('T')[0],
          completedActivityIds: newCompletedActivityIds,
          completedChallengeIds: newCompletedChallengeIds,
          challengeProgress: newChallengeProgress,
        };
      });

      return { xpAwarded: awardedXP, isDuplicate: duplicate };
    },
    []
  );

  const submitSimulation = useCallback(
    (
      simulationId: string,
      answers: Record<string, any>,
      recommendation: string,
      score: number,
      feedback: string,
      xpReward: number
    ) => {
      let awardedXP = 0;
      let duplicate = false;

      setUser(prev => {
        const { xpAwarded, isDuplicate, transaction } = evaluateXPReward(
          prev.id,
          'simulation',
          simulationId,
          xpReward,
          prev.completedActivityIds,
          false
        );

        awardedXP = xpAwarded;
        duplicate = isDuplicate;

        const newXP = prev.xp + xpAwarded;
        const { level: newLevel } = calculateLevelInfo(newXP);
        const { streak: updatedStreak } = calculateUpdatedStreak(prev.lastActiveDate, prev.currentStreak);

        if (xpAwarded > 0 && typeof window !== 'undefined') {
          try {
            confetti({
              particleCount: 35,
              spread: 70,
              origin: { y: 0.75 },
              colors: ['#75D6D0', '#C6F36B', '#FFAA73'],
            });
          } catch {
            // Ignore
          }
        }

        const newCompletedActivityIds = prev.completedActivityIds.includes(transaction.id)
          ? prev.completedActivityIds
          : [...prev.completedActivityIds, transaction.id];

        const updatedSimSubmissions = {
          ...prev.simulationSubmissions,
          [simulationId]: {
            answers,
            recommendation,
            score,
            feedback,
            completedAt: new Date().toISOString(),
          },
        };

        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          currentStreak: updatedStreak,
          longestStreak: Math.max(prev.longestStreak, updatedStreak),
          lastActiveDate: new Date().toISOString().split('T')[0],
          completedActivityIds: newCompletedActivityIds,
          simulationSubmissions: updatedSimSubmissions,
        };
      });

      return { xpAwarded: awardedXP, isDuplicate: duplicate };
    },
    []
  );

  const submitDetectiveVerdict = useCallback(
    (
      mysteryId: string,
      discoveredClueIds: number[],
      answers: Record<string, any>,
      verdictSubmitted: string,
      isSolved: boolean,
      xpReward: number
    ) => {
      let awardedXP = 0;
      let duplicate = false;

      setUser(prev => {
        let earnedXP = 0;
        let isDup = false;
        let updatedActivities = [...prev.completedActivityIds];

        if (isSolved) {
          const evalRes = evaluateXPReward(
            prev.id,
            'challenge',
            `detective-${mysteryId}`,
            xpReward,
            prev.completedActivityIds,
            false
          );
          earnedXP = evalRes.xpAwarded;
          isDup = evalRes.isDuplicate;
          if (!updatedActivities.includes(evalRes.transaction.id)) {
            updatedActivities.push(evalRes.transaction.id);
          }
        }

        awardedXP = earnedXP;
        duplicate = isDup;

        const newXP = prev.xp + earnedXP;
        const { level: newLevel } = calculateLevelInfo(newXP);
        const { streak: updatedStreak } = calculateUpdatedStreak(prev.lastActiveDate, prev.currentStreak);

        if (earnedXP > 0 && typeof window !== 'undefined') {
          try {
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.75 },
              colors: ['#75D6D0', '#C6F36B'],
            });
          } catch {
            // Ignore
          }
        }

        const updatedDetective = {
          ...prev.detectiveProgress,
          [mysteryId]: {
            discoveredClueIds,
            answers,
            verdictSubmitted,
            isSolved,
            completedAt: isSolved ? new Date().toISOString() : undefined,
          },
        };

        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          currentStreak: updatedStreak,
          longestStreak: Math.max(prev.longestStreak, updatedStreak),
          lastActiveDate: new Date().toISOString().split('T')[0],
          completedActivityIds: updatedActivities,
          detectiveProgress: updatedDetective,
        };
      });

      return { xpAwarded: awardedXP, isDuplicate: duplicate };
    },
    []
  );

  const submitCompetitionEntry = useCallback(
    (
      competitionId: string,
      submissionText: string,
      score: number,
      xpReward: number
    ) => {
      let awardedXP = 0;
      let duplicate = false;

      setUser(prev => {
        const { xpAwarded, isDuplicate, transaction } = evaluateXPReward(
          prev.id,
          'challenge',
          `comp-${competitionId}`,
          xpReward,
          prev.completedActivityIds,
          false
        );

        awardedXP = xpAwarded;
        duplicate = isDuplicate;

        const newXP = prev.xp + xpAwarded;
        const { level: newLevel } = calculateLevelInfo(newXP);
        const { streak: updatedStreak } = calculateUpdatedStreak(prev.lastActiveDate, prev.currentStreak);

        const updatedComps = {
          ...prev.competitionSubmissions,
          [competitionId]: {
            submissionText,
            score,
            submittedAt: new Date().toISOString(),
          },
        };

        const updatedActivities = prev.completedActivityIds.includes(transaction.id)
          ? prev.completedActivityIds
          : [...prev.completedActivityIds, transaction.id];

        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          currentStreak: updatedStreak,
          longestStreak: Math.max(prev.longestStreak, updatedStreak),
          lastActiveDate: new Date().toISOString().split('T')[0],
          completedActivityIds: updatedActivities,
          competitionSubmissions: updatedComps,
        };
      });

      return { xpAwarded: awardedXP, isDuplicate: duplicate };
    },
    []
  );

  // --- Portfolio Management ---
  const saveProject = useCallback((project: PortfolioProject): PortfolioProject => {
    let savedProject: PortfolioProject = { ...project };
    const now = new Date().toISOString();

    setUser(prev => {
      const existingProjects = prev.portfolioProjects || [];
      const index = existingProjects.findIndex(p => p.id === project.id);

      if (index >= 0) {
        savedProject = {
          ...project,
          userId: project.userId || prev.id,
          authorName: project.authorName || prev.name,
          updatedAt: now,
        };
        const updated = [...existingProjects];
        updated[index] = savedProject;
        return { ...prev, portfolioProjects: updated };
      } else {
        savedProject = {
          ...project,
          id: project.id || `proj-${Date.now()}`,
          userId: prev.id,
          authorName: prev.name,
          status: project.status || 'draft',
          isPublic: project.isPublic ?? false,
          createdAt: project.createdAt || now,
          updatedAt: now,
        };
        return { ...prev, portfolioProjects: [savedProject, ...existingProjects] };
      }
    });

    return savedProject;
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setUser(prev => ({
      ...prev,
      portfolioProjects: (prev.portfolioProjects || []).filter(p => p.id !== projectId),
    }));
  }, []);

  const publishProject = useCallback((projectId: string) => {
    let awardedXP = 0;
    let duplicate = true;

    setUser(prev => {
      const activityKey = `${prev.id}:project_published:${projectId}`;
      duplicate = prev.completedActivityIds.includes(activityKey);
      awardedXP = duplicate ? 0 : 150;

      const updatedProjects = (prev.portfolioProjects || []).map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'published' as const,
            isPublic: true,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      if (!duplicate) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C6F36B', '#75D6D0', '#FFAA73'],
        });
      }

      const newXP = prev.xp + awardedXP;
      const { level: newLevel } = calculateLevelInfo(newXP);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedActivityIds: duplicate ? prev.completedActivityIds : [...prev.completedActivityIds, activityKey],
        portfolioProjects: updatedProjects,
      };
    });

    return { xpAwarded: awardedXP, isDuplicate: duplicate };
  }, []);

  const unpublishProject = useCallback((projectId: string) => {
    setUser(prev => ({
      ...prev,
      portfolioProjects: (prev.portfolioProjects || []).map(p =>
        p.id === projectId
          ? { ...p, status: 'draft' as const, isPublic: false, updatedAt: new Date().toISOString() }
          : p
      ),
    }));
  }, []);

  const updatePortfolioVisibility = useCallback((settings: Partial<PortfolioVisibilitySettings>) => {
    setUser(prev => ({
      ...prev,
      portfolioVisibility: {
        ...(prev.portfolioVisibility || {
          isPublic: true,
          highlightProjectIds: [],
          showContactEmail: true,
          showAchievements: true,
          allowComments: true,
        }),
        ...settings,
      },
    }));
  }, []);

  // --- Community Management ---
  const createDiscussion = useCallback((input: {
    title: string;
    category: DiscussionCategory;
    content: string;
    tags: string[];
    domainId?: string;
  }): CommunityDiscussion => {
    const now = new Date().toISOString();
    const newDiscussion: CommunityDiscussion = {
      id: `disc-${Date.now()}`,
      title: input.title,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      category: input.category,
      domainId: input.domainId,
      content: input.content,
      tags: input.tags,
      replies: [],
      upvotes: 1,
      upvotedByUser: true,
      views: 1,
      createdAt: now,
      updatedAt: now,
    };

    setUser(prev => {
      const activityKey = `${prev.id}:create_discussion:${newDiscussion.id}`;
      const duplicate = prev.completedActivityIds.includes(activityKey);
      const awardedXP = duplicate ? 0 : 25;
      const newXP = prev.xp + awardedXP;
      const { level: newLevel } = calculateLevelInfo(newXP);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedActivityIds: duplicate ? prev.completedActivityIds : [...prev.completedActivityIds, activityKey],
        discussions: [newDiscussion, ...(prev.discussions || [])],
      };
    });

    return newDiscussion;
  }, [user.id, user.name, user.role, user.avatar]);

  const updateDiscussion = useCallback((discussionId: string, content: string) => {
    setUser(prev => ({
      ...prev,
      discussions: (prev.discussions || []).map(d =>
        d.id === discussionId && d.authorId === prev.id
          ? { ...d, content, updatedAt: new Date().toISOString() }
          : d
      ),
    }));
  }, []);

  const deleteDiscussion = useCallback((discussionId: string) => {
    setUser(prev => ({
      ...prev,
      discussions: (prev.discussions || []).filter(d => d.id !== discussionId || d.authorId !== prev.id),
    }));
  }, []);

  const addReply = useCallback((discussionId: string, content: string): CommunityReply => {
    const now = new Date().toISOString();
    let createdReply: CommunityReply = {
      id: `rep-${Date.now()}`,
      discussionId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      content,
      upvotes: 0,
      createdAt: now,
    };

    setUser(prev => {
      const activityKey = `${prev.id}:community_reply:${createdReply.id}`;
      const duplicate = prev.completedActivityIds.includes(activityKey);
      const awardedXP = duplicate ? 0 : 15;
      const newXP = prev.xp + awardedXP;
      const { level: newLevel } = calculateLevelInfo(newXP);

      const updatedDiscussions = (prev.discussions || []).map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            replies: [...d.replies, createdReply],
            updatedAt: now,
          };
        }
        return d;
      });

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedActivityIds: duplicate ? prev.completedActivityIds : [...prev.completedActivityIds, activityKey],
        discussions: updatedDiscussions,
      };
    });

    return createdReply;
  }, [user.id, user.name, user.role, user.avatar]);

  const deleteReply = useCallback((discussionId: string, replyId: string) => {
    setUser(prev => ({
      ...prev,
      discussions: (prev.discussions || []).map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            replies: d.replies.filter(r => r.id !== replyId || r.authorId !== prev.id),
          };
        }
        return d;
      }),
    }));
  }, []);

  const toggleUpvoteDiscussion = useCallback((discussionId: string) => {
    setUser(prev => ({
      ...prev,
      discussions: (prev.discussions || []).map(d => {
        if (d.id === discussionId) {
          const isUpvoted = !!d.upvotedByUser;
          return {
            ...d,
            upvotedByUser: !isUpvoted,
            upvotes: isUpvoted ? Math.max(0, d.upvotes - 1) : d.upvotes + 1,
          };
        }
        return d;
      }),
    }));
  }, []);

  const reportDiscussion = useCallback((discussionId: string, reason: string) => {
    setUser(prev => ({
      ...prev,
      discussions: (prev.discussions || []).map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            isReported: true,
            reportReason: reason,
          };
        }
        return d;
      }),
    }));
  }, []);

  // --- Collaboration & Teams Management ---
  const createTeam = useCallback((name: string, description: string, focusDomain: string): Team => {
    const now = new Date().toISOString();
    const code = 'TM' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      description,
      inviteCode: code,
      creatorId: user.id,
      focusDomain,
      members: [
        {
          userId: user.id,
          name: user.name,
          role: 'lead',
          avatar: user.avatar,
          email: user.email,
          joinedAt: now,
        },
      ],
      tasks: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          teamId: `team-${Date.now()}`,
          authorId: user.id,
          authorName: user.name,
          authorRole: 'lead',
          content: `Welcome to ${name}! Ready to collaborate on analytical challenges.`,
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    setUser(prev => {
      const activityKey = `${prev.id}:create_team:${newTeam.id}`;
      const duplicate = prev.completedActivityIds.includes(activityKey);
      const awardedXP = duplicate ? 0 : 50;
      const newXP = prev.xp + awardedXP;
      const { level: newLevel } = calculateLevelInfo(newXP);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedActivityIds: duplicate ? prev.completedActivityIds : [...prev.completedActivityIds, activityKey],
        teams: [newTeam, ...(prev.teams || [])],
      };
    });

    return newTeam;
  }, [user.id, user.name, user.avatar, user.email]);

  const joinTeam = useCallback((inviteCode: string): { success: boolean; message: string; team?: Team } => {
    const trimmed = inviteCode.trim().toUpperCase();
    let result: { success: boolean; message: string; team?: Team } = {
      success: false,
      message: 'Invalid invite code or team not found.',
    };

    setUser(prev => {
      const existingTeams = prev.teams || [];
      const team = existingTeams.find(t => t.inviteCode.toUpperCase() === trimmed);

      if (!team) {
        result = { success: false, message: `Team with code "${trimmed}" not found.` };
        return prev;
      }

      if (team.members.some(m => m.userId === prev.id)) {
        result = { success: false, message: 'You are already a member of this team.', team };
        return prev;
      }

      const updatedMembers = [
        ...team.members,
        {
          userId: prev.id,
          name: prev.name,
          role: 'analyst' as const,
          avatar: prev.avatar,
          email: prev.email,
          joinedAt: new Date().toISOString(),
        },
      ];

      const updatedTeam = {
        ...team,
        members: updatedMembers,
        updatedAt: new Date().toISOString(),
      };

      result = { success: true, message: `Successfully joined "${team.name}"!`, team: updatedTeam };

      return {
        ...prev,
        teams: existingTeams.map(t => (t.id === team.id ? updatedTeam : t)),
      };
    });

    return result;
  }, []);

  const leaveTeam = useCallback((teamId: string) => {
    setUser(prev => ({
      ...prev,
      teams: (prev.teams || [])
        .map(t => {
          if (t.id === teamId) {
            return {
              ...t,
              members: t.members.filter(m => m.userId !== prev.id),
            };
          }
          return t;
        })
        .filter(t => t.members.length > 0),
    }));
  }, []);

  const assignTeamTask = useCallback((teamId: string, task: Omit<TeamTask, 'id' | 'createdAt' | 'teamId'>): TeamTask => {
    const now = new Date().toISOString();
    const newTask: TeamTask = {
      id: `task-${Date.now()}`,
      teamId,
      title: task.title,
      description: task.description,
      assignedToUserId: task.assignedToUserId,
      assignedToName: task.assignedToName,
      status: task.status || 'todo',
      dueDate: task.dueDate,
      createdAt: now,
    };

    setUser(prev => ({
      ...prev,
      teams: (prev.teams || []).map(t =>
        t.id === teamId
          ? { ...t, tasks: [...t.tasks, newTask], updatedAt: now }
          : t
      ),
    }));

    return newTask;
  }, []);

  const updateTeamTaskStatus = useCallback((teamId: string, taskId: string, status: TeamTaskStatus) => {
    const now = new Date().toISOString();
    setUser(prev => ({
      ...prev,
      teams: (prev.teams || []).map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            tasks: t.tasks.map(task =>
              task.id === taskId
                ? { ...task, status, completedAt: status === 'completed' ? now : undefined }
                : task
            ),
            updatedAt: now,
          };
        }
        return t;
      }),
    }));
  }, []);

  const postTeamMessage = useCallback((teamId: string, message: string): TeamMessage => {
    const now = new Date().toISOString();
    let newMessage: TeamMessage = {
      id: `msg-${Date.now()}`,
      teamId,
      authorId: user.id,
      authorName: user.name,
      authorRole: 'analyst',
      content: message,
      createdAt: now,
    };

    setUser(prev => {
      const currentTeam = (prev.teams || []).find(t => t.id === teamId);
      const userMember = currentTeam?.members.find(m => m.userId === prev.id);
      newMessage.authorRole = userMember?.role || 'analyst';

      return {
        ...prev,
        teams: (prev.teams || []).map(t =>
          t.id === teamId
            ? { ...t, messages: [...t.messages, newMessage], updatedAt: now }
            : t
        ),
      };
    });

    return newMessage;
  }, [user.id, user.name]);

  const assignTeamChallenge = useCallback((teamId: string, challengeId: string, challengeTitle: string) => {
    const now = new Date().toISOString();
    setUser(prev => ({
      ...prev,
      teams: (prev.teams || []).map(t =>
        t.id === teamId
          ? {
              ...t,
              activeChallenge: {
                challengeId,
                challengeTitle,
                assignedAt: now,
                status: 'active' as const,
              },
              updatedAt: now,
            }
          : t
      ),
    }));
  }, []);

  const submitTeamChallenge = useCallback((
    teamId: string,
    challengeId: string,
    deliverableText: string
  ): { xpAwarded: number; isDuplicate: boolean } => {
    let awardedXP = 0;
    let duplicate = true;
    const now = new Date().toISOString();

    setUser(prev => {
      const activityKey = `${prev.id}:team_challenge_submit:${teamId}:${challengeId}`;
      duplicate = prev.completedActivityIds.includes(activityKey);
      awardedXP = duplicate ? 0 : 100;

      const newXP = prev.xp + awardedXP;
      const { level: newLevel } = calculateLevelInfo(newXP);

      const updatedTeams = (prev.teams || []).map(t => {
        if (t.id === teamId && t.activeChallenge) {
          return {
            ...t,
            activeChallenge: {
              ...t.activeChallenge,
              status: 'submitted' as const,
              teamDeliverableText: deliverableText,
              score: 94,
              submittedAt: now,
              feedback: 'Team deliverable demonstrated rigorous collaborative analysis, clear schema joins, and quantified commercial business impact.',
            },
            updatedAt: now,
          };
        }
        return t;
      });

      if (!duplicate) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C6F36B', '#75D6D0', '#FFAA73'],
        });
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedActivityIds: duplicate ? prev.completedActivityIds : [...prev.completedActivityIds, activityKey],
        teams: updatedTeams,
      };
    });

    return { xpAwarded: awardedXP, isDuplicate: duplicate };
  }, []);

  // --- Phase 6 Planned Sessions & Calendar ---
  const addPlannedSession = useCallback((session: Omit<PlannedSession, 'id' | 'createdAt'>): PlannedSession => {
    const now = new Date().toISOString();
    const newSession: PlannedSession = {
      ...session,
      id: `plan-${Date.now()}`,
      createdAt: now,
    };
    setUser(prev => ({
      ...prev,
      plannedSessions: [...(prev.plannedSessions || []), newSession],
    }));
    return newSession;
  }, []);

  const updatePlannedSession = useCallback((sessionId: string, updates: Partial<PlannedSession>) => {
    setUser(prev => ({
      ...prev,
      plannedSessions: (prev.plannedSessions || []).map(s =>
        s.id === sessionId ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const deletePlannedSession = useCallback((sessionId: string) => {
    setUser(prev => ({
      ...prev,
      plannedSessions: (prev.plannedSessions || []).filter(s => s.id !== sessionId),
    }));
  }, []);

  // --- Phase 6 Notifications ---
  const markNotificationRead = useCallback((notificationId: string) => {
    setUser(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setUser(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => ({ ...n, read: true })),
    }));
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    setUser(prev => ({
      ...prev,
      notifications: (prev.notifications || []).filter(n => n.id !== notificationId),
    }));
  }, []);

  const updateNotificationPreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setUser(prev => ({
      ...prev,
      notificationPreferences: {
        ...(prev.notificationPreferences || {
          streakReminders: true,
          revisionAlerts: true,
          challengeUpdates: true,
          teamNotifications: true,
          achievementPops: true,
        }),
        ...prefs,
      },
    }));
  }, []);

  // --- Phase 6 Missions & Achievements ---
  const claimMissionReward = useCallback((missionId: string, xpReward: number): { xpAwarded: number; isDuplicate: boolean } => {
    let awardedXP = 0;
    let duplicate = true;

    setUser(prev => {
      const activityKey = `${prev.id}:mission_claim:${missionId}`;
      duplicate = prev.completedActivityIds.includes(activityKey);
      awardedXP = duplicate ? 0 : xpReward;

      if (!duplicate) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#C6F36B', '#75D6D0'],
        });
      }

      const newXP = prev.xp + awardedXP;
      const { level: newLevel } = calculateLevelInfo(newXP);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedActivityIds: duplicate ? prev.completedActivityIds : [...prev.completedActivityIds, activityKey],
        claimedMissionIds: Array.from(new Set([...(prev.claimedMissionIds || []), missionId])),
      };
    });

    return { xpAwarded: awardedXP, isDuplicate: duplicate };
  }, []);

  const unlockAchievement = useCallback((achievementId: string, xpReward: number): { xpAwarded: number; isDuplicate: boolean } => {
    let awardedXP = 0;
    let duplicate = true;

    setUser(prev => {
      const activityKey = `${prev.id}:achievement_unlock:${achievementId}`;
      duplicate = prev.completedActivityIds.includes(activityKey);
      awardedXP = duplicate ? 0 : xpReward;

      if (!duplicate) {
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#FFAA73', '#C6F36B', '#75D6D0'],
        });
      }

      const newXP = prev.xp + awardedXP;
      const { level: newLevel } = calculateLevelInfo(newXP);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedActivityIds: duplicate ? prev.completedActivityIds : [...prev.completedActivityIds, activityKey],
        unlockedAchievementIds: Array.from(new Set([...(prev.unlockedAchievementIds || []), achievementId])),
      };
    });

    return { xpAwarded: awardedXP, isDuplicate: duplicate };
  }, []);

  const toggleDomainSelection = useCallback((domainId: string) => {
    setUser(prev => {
      const exists = prev.selectedDomainIds.includes(domainId);
      const newSelection = exists
        ? prev.selectedDomainIds.filter(id => id !== domainId)
        : [...prev.selectedDomainIds, domainId];

      return {
        ...prev,
        selectedDomainIds: newSelection,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setUser(INITIAL_DEMO_USER);
    storage.set('user_profile', INITIAL_DEMO_USER);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isDemoSession,
        syncStatus,
        lastSyncedAt,
        syncError,
        isCloudConnected: backendService.isCloudConnected,
        login,
        logout,
        syncWithCloud,
        exportUserData,
        importUserData,
        updateProfile,
        completeActivity,
        completeTopic,
        recordPracticeAttempt,
        updateMistakeStatus,
        saveDatasetFinding,
        deleteDatasetFinding,
        saveChallengeDraft,
        submitChallenge,
        submitSimulation,
        submitDetectiveVerdict,
        submitCompetitionEntry,
        saveProject,
        deleteProject,
        publishProject,
        unpublishProject,
        updatePortfolioVisibility,
        createDiscussion,
        updateDiscussion,
        deleteDiscussion,
        addReply,
        deleteReply,
        toggleUpvoteDiscussion,
        reportDiscussion,
        createTeam,
        joinTeam,
        leaveTeam,
        assignTeamTask,
        updateTeamTaskStatus,
        postTeamMessage,
        assignTeamChallenge,
        submitTeamChallenge,
        addPlannedSession,
        updatePlannedSession,
        deletePlannedSession,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        updateNotificationPreferences,
        claimMissionReward,
        unlockAchievement,
        toggleDomainSelection,
        resetProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
