import { UserProfile } from '../../types/user';
import { storage } from '../storage';
import {
  IBackendService,
  BackendProviderType,
  UserSession,
  AuthResult,
  SyncResult,
  ConflictStrategy,
  DatasetUploadResult,
} from './types';

const SESSION_STORAGE_KEY = 'auth_session';
const BACKUP_PREFIX = 'tdm_backup_';

/**
 * Local-First / Demo Backend Adapter
 * 100% Free, Private, and Offline. Requires zero external accounts or API keys.
 */
export class LocalDemoBackendAdapter implements IBackendService {
  readonly providerName: BackendProviderType = 'local_demo';
  readonly isCloudConnected: boolean = false;

  async signUp(email: string, _password: string, displayName?: string): Promise<AuthResult> {
    const userId = `usr_local_${Date.now()}`;
    const session: UserSession = {
      userId,
      email,
      displayName: displayName || email.split('@')[0],
      isDemo: false,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    storage.set(SESSION_STORAGE_KEY, session);
    return { success: true, session };
  }

  async signIn(email: string, _password: string): Promise<AuthResult> {
    const existing = storage.get<UserSession | null>(SESSION_STORAGE_KEY, null);
    const session: UserSession = {
      userId: existing?.userId || `usr_local_${Date.now()}`,
      email,
      displayName: existing?.displayName || email.split('@')[0],
      isDemo: email.includes('demo') || email.includes('alex.rivera'),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    storage.set(SESSION_STORAGE_KEY, session);
    return { success: true, session };
  }

  async signOut(): Promise<void> {
    storage.remove(SESSION_STORAGE_KEY);
  }

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Local Mode: In offline demo mode, passwords are stored only on your device. You can sign in directly with ${email}.`,
    };
  }

  async getSession(): Promise<UserSession | null> {
    return storage.get<UserSession | null>(SESSION_STORAGE_KEY, null);
  }

  async syncProfile(user: UserProfile): Promise<SyncResult> {
    // In local mode, saving to localStorage is the persistent state
    const success = storage.set('user_profile', user);
    return {
      success,
      status: 'offline',
      lastSyncedAt: new Date().toISOString(),
      conflictsDetected: false,
    };
  }

  async pullRemoteProfile(_userId: string): Promise<UserProfile | null> {
    // Local-only provider does not pull from a remote server
    return null;
  }

  resolveConflict(local: UserProfile, remote: UserProfile, strategy: ConflictStrategy): UserProfile {
    if (strategy === 'client_wins') return local;
    if (strategy === 'server_wins') return remote;

    // 'merge' strategy: Take the best of both
    const mergedCompletedTopics = Array.from(
      new Set([...(local.completedTopicIds || []), ...(remote.completedTopicIds || [])])
    );
    const mergedCompletedLessons = Array.from(
      new Set([...(local.completedLessonIds || []), ...(remote.completedLessonIds || [])])
    );
    const mergedChallenges = Array.from(
      new Set([...(local.completedChallengeIds || []), ...(remote.completedChallengeIds || [])])
    );

    // Merge practice attempts by ID
    const attemptsMap = new Map();
    [...(remote.practiceAttempts || []), ...(local.practiceAttempts || [])].forEach(att => {
      attemptsMap.set(att.id, att);
    });

    // Merge mistake records by ID
    const mistakesMap = new Map();
    [...(remote.mistakeRecords || []), ...(local.mistakeRecords || [])].forEach(m => {
      mistakesMap.set(m.id, m);
    });

    // Highest XP and streak
    const highestXP = Math.max(local.xp || 0, remote.xp || 0);
    const longestStreak = Math.max(local.longestStreak || 0, remote.longestStreak || 0);
    const currentStreak = Math.max(local.currentStreak || 0, remote.currentStreak || 0);

    return {
      ...remote,
      ...local,
      xp: highestXP,
      currentStreak,
      longestStreak,
      completedTopicIds: mergedCompletedTopics,
      completedLessonIds: mergedCompletedLessons,
      completedChallengeIds: mergedChallenges,
      practiceAttempts: Array.from(attemptsMap.values()),
      mistakeRecords: Array.from(mistakesMap.values()),
      portfolioProjects: local.portfolioProjects || remote.portfolioProjects || [],
      updatedAt: new Date().toISOString(),
    } as UserProfile;
  }

  async uploadDataset(file: File, _userId: string): Promise<DatasetUploadResult> {
    // Enforce size constraint (Max 10MB in local browser mode)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return {
        success: false,
        fileUrl: '',
        fileName: file.name,
        fileSizeBytes: file.size,
        error: `File size exceeds 10MB limit (File is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }

    // Check MIME type / extension
    const validExtensions = ['.csv', '.json', '.txt'];
    const isSupported = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isSupported) {
      return {
        success: false,
        fileUrl: '',
        fileName: file.name,
        fileSizeBytes: file.size,
        error: 'Unsupported file format. Please upload a standard CSV or JSON file.',
      };
    }

    // In local mode, create an in-browser Object URL
    const fileUrl = URL.createObjectURL(file);
    return {
      success: true,
      fileUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
    };
  }

  async deleteDataset(_filePath: string): Promise<boolean> {
    return true;
  }

  exportBackupJSON(user: UserProfile): string {
    const backupPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'THE DATA MASTER',
      userProfile: user,
    };
    return JSON.stringify(backupPayload, null, 2);
  }

  importBackupJSON(jsonString: string): { success: boolean; user?: UserProfile; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.userProfile || !parsed.userProfile.id || !parsed.userProfile.email) {
        return {
          success: false,
          error: 'Invalid backup file structure. Missing required user profile fields.',
        };
      }

      // Auto-archive current state before overwrite
      const current = storage.get<UserProfile | null>('user_profile', null);
      if (current) {
        storage.set(`${BACKUP_PREFIX}${Date.now()}`, current);
      }

      // Persist imported state
      storage.set('user_profile', parsed.userProfile);
      return {
        success: true,
        user: parsed.userProfile,
      };
    } catch (err: any) {
      return {
        success: false,
        error: `JSON parse error: ${err.message || 'Corrupted file'}`,
      };
    }
  }
}
