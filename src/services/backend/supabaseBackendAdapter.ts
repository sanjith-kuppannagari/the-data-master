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

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const SUPABASE_SESSION_KEY = 'sb_auth_session';

/**
 * Supabase Cloud Backend Adapter
 * Connects to Supabase PostgreSQL, GoTrue Auth, and Storage via direct REST endpoints.
 * Operates gracefully if credentials are not configured.
 */
export class SupabaseBackendAdapter implements IBackendService {
  readonly providerName: BackendProviderType = 'supabase';
  private config: SupabaseConfig | null = null;

  constructor() {
    const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
    const url = env?.VITE_SUPABASE_URL || '';
    const anonKey = env?.VITE_SUPABASE_ANON_KEY || '';

    if (url && anonKey) {
      this.config = {
        url: url.replace(/\/$/, ''),
        anonKey,
      };
    }
  }

  get isCloudConnected(): boolean {
    return this.config !== null;
  }

  private getHeaders(token?: string): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: this.config?.anonKey || '',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async signUp(email: string, password: string, displayName?: string): Promise<AuthResult> {
    if (!this.config) {
      return {
        success: false,
        error: 'Supabase credentials not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const response = await fetch(`${this.config.url}/auth/v1/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          password,
          data: { display_name: displayName || email.split('@')[0] },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.msg || data.error_description || 'Signup failed' };
      }

      const session: UserSession = {
        userId: data.user?.id || `usr_${Date.now()}`,
        email: data.user?.email || email,
        displayName: displayName || email.split('@')[0],
        token: data.access_token,
        isDemo: false,
        expiresAt: new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString(),
      };

      storage.set(SUPABASE_SESSION_KEY, session);
      return { success: true, session };
    } catch (err: any) {
      return { success: false, error: `Network error during signup: ${err.message}` };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!this.config) {
      return {
        success: false,
        error: 'Supabase credentials not configured. Using local demo fallback.',
      };
    }

    try {
      const response = await fetch(`${this.config.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error_description || data.msg || 'Authentication failed' };
      }

      const session: UserSession = {
        userId: data.user?.id || `usr_${Date.now()}`,
        email: data.user?.email || email,
        displayName: data.user?.user_metadata?.display_name || email.split('@')[0],
        token: data.access_token,
        isDemo: false,
        expiresAt: new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString(),
      };

      storage.set(SUPABASE_SESSION_KEY, session);
      return { success: true, session };
    } catch (err: any) {
      return { success: false, error: `Network error during signin: ${err.message}` };
    }
  }

  async signOut(): Promise<void> {
    const session = storage.get<UserSession | null>(SUPABASE_SESSION_KEY, null);
    if (this.config && session?.token) {
      try {
        await fetch(`${this.config.url}/auth/v1/logout`, {
          method: 'POST',
          headers: this.getHeaders(session.token),
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    storage.remove(SUPABASE_SESSION_KEY);
  }

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return {
        success: false,
        message: 'Supabase backend not connected. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const response = await fetch(`${this.config.url}/auth/v1/recover`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        return { success: false, message: data.msg || 'Password recovery request failed' };
      }

      return { success: true, message: `Password recovery email sent to ${email}. Check your inbox.` };
    } catch (err: any) {
      return { success: false, message: `Recovery failed: ${err.message}` };
    }
  }

  async getSession(): Promise<UserSession | null> {
    return storage.get<UserSession | null>(SUPABASE_SESSION_KEY, null);
  }

  async syncProfile(user: UserProfile): Promise<SyncResult> {
    if (!this.config) {
      return {
        success: false,
        status: 'offline',
        error: 'Supabase cloud sync is not configured.',
      };
    }

    const session = await this.getSession();
    if (!session?.token) {
      return {
        success: false,
        status: 'error',
        error: 'Authentication token required for cloud sync. Please sign in.',
      };
    }

    try {
      // 1. Sync User Profile Row
      const profilePayload = {
        id: session.userId,
        email: user.email,
        display_name: user.name,
        target_role: user.targetRole,
        experience_level: user.experienceLevel,
        xp: user.xp,
        level: user.level,
        current_streak: user.currentStreak,
        longest_streak: user.longestStreak,
        daily_commitment_minutes: user.dailyCommitmentMinutes,
        selected_domains: user.selectedDomainIds,
        completed_topics: user.completedTopicIds,
        completed_lessons: user.completedLessonIds || [],
        preferences: user.preferences,
        updated_at: new Date().toISOString(),
      };

      const response = await fetch(`${this.config.url}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(session.token),
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(profilePayload),
      });

      if (!response.ok) {
        const err = await response.json();
        return {
          success: false,
          status: 'error',
          error: err.message || 'Failed to sync profile to cloud',
        };
      }

      return {
        success: true,
        status: 'synced',
        lastSyncedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'error',
        error: `Cloud sync interrupted: ${err.message}`,
      };
    }
  }

  async pullRemoteProfile(userId: string): Promise<UserProfile | null> {
    if (!this.config) return null;
    const session = await this.getSession();
    if (!session?.token) return null;

    try {
      const response = await fetch(
        `${this.config.url}/rest/v1/profiles?id=eq.${userId}&select=*`,
        {
          headers: this.getHeaders(session.token),
        }
      );

      if (!response.ok) return null;
      const rows = await response.json();
      if (!rows || rows.length === 0) return null;

      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        name: row.display_name,
        role: row.role || 'Analytics Practitioner',
        avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        bio: row.bio || 'Data Master explorer',
        targetRole: row.target_role || 'Data Analyst',
        experienceLevel: row.experience_level || 'Intermediate',
        dailyCommitmentMinutes: row.daily_commitment_minutes || 30,
        learningStyles: ['Hands-on exercises', 'Real-world datasets'],
        primaryGoals: ['Master SQL & Python'],
        selectedDomainIds: row.selected_domains || [],
        completedTopicIds: row.completed_topics || [],
        completedLessonIds: row.completed_lessons || [],
        completedActivityIds: [],
        xp: row.xp || 0,
        level: row.level || 1,
        currentStreak: row.current_streak || 0,
        longestStreak: row.longest_streak || 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        preferences: row.preferences || {
          theme: 'dark',
          enableAIAssistant: true,
          soundEffects: true,
          weeklyGoalMinutes: 180,
          isPortfolioPublic: true,
        },
        createdAt: row.created_at || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }

  resolveConflict(local: UserProfile, remote: UserProfile, strategy: ConflictStrategy): UserProfile {
    if (strategy === 'client_wins') return local;
    if (strategy === 'server_wins') return remote;

    // Merge strategy
    const mergedTopics = Array.from(new Set([...local.completedTopicIds, ...remote.completedTopicIds]));
    const mergedLessons = Array.from(
      new Set([...(local.completedLessonIds || []), ...(remote.completedLessonIds || [])])
    );

    return {
      ...remote,
      ...local,
      xp: Math.max(local.xp, remote.xp),
      currentStreak: Math.max(local.currentStreak, remote.currentStreak),
      longestStreak: Math.max(local.longestStreak, remote.longestStreak),
      completedTopicIds: mergedTopics,
      completedLessonIds: mergedLessons,
    };
  }

  async uploadDataset(file: File, userId: string): Promise<DatasetUploadResult> {
    if (!this.config) {
      return {
        success: false,
        fileUrl: '',
        fileName: file.name,
        fileSizeBytes: file.size,
        error: 'Supabase storage is not configured. Falling back to local browser mode.',
      };
    }

    const session = await this.getSession();
    if (!session?.token) {
      return {
        success: false,
        fileUrl: '',
        fileName: file.name,
        fileSizeBytes: file.size,
        error: 'Authentication required to upload dataset to cloud storage.',
      };
    }

    const filePath = `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;

    try {
      const response = await fetch(
        `${this.config.url}/storage/v1/object/datasets/${filePath}`,
        {
          method: 'POST',
          headers: {
            apikey: this.config.anonKey,
            Authorization: `Bearer ${session.token}`,
            'Content-Type': file.type || 'text/csv',
          },
          body: file,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        return {
          success: false,
          fileUrl: '',
          fileName: file.name,
          fileSizeBytes: file.size,
          error: err.message || 'File upload failed',
        };
      }

      return {
        success: true,
        fileUrl: `${this.config.url}/storage/v1/object/authenticated/datasets/${filePath}`,
        fileName: file.name,
        fileSizeBytes: file.size,
      };
    } catch (err: any) {
      return {
        success: false,
        fileUrl: '',
        fileName: file.name,
        fileSizeBytes: file.size,
        error: `Upload network error: ${err.message}`,
      };
    }
  }

  async deleteDataset(filePath: string): Promise<boolean> {
    if (!this.config) return true;
    const session = await this.getSession();
    if (!session?.token) return false;

    try {
      const response = await fetch(`${this.config.url}/storage/v1/object/datasets/${filePath}`, {
        method: 'DELETE',
        headers: this.getHeaders(session.token),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  exportBackupJSON(user: UserProfile): string {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        provider: 'supabase',
        userProfile: user,
      },
      null,
      2
    );
  }

  importBackupJSON(jsonString: string): { success: boolean; user?: UserProfile; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.userProfile || !parsed.userProfile.id) {
        return { success: false, error: 'Malformed backup data structure' };
      }
      return { success: true, user: parsed.userProfile };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
