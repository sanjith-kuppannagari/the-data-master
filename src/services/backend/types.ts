import { UserProfile } from '../../types/user';

export type BackendProviderType = 'local_demo' | 'supabase';

export type CloudSyncStatus = 'offline' | 'synced' | 'syncing' | 'conflict' | 'error';

export type ConflictStrategy = 'merge' | 'client_wins' | 'server_wins';

export interface UserSession {
  userId: string;
  email: string;
  displayName: string;
  token?: string;
  isDemo: boolean;
  expiresAt?: string;
}

export interface AuthResult {
  success: boolean;
  session?: UserSession;
  error?: string;
}

export interface SyncResult {
  success: boolean;
  status: CloudSyncStatus;
  lastSyncedAt?: string;
  conflictsDetected?: boolean;
  error?: string;
}

export interface DatasetUploadResult {
  success: boolean;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  rowCount?: number;
  error?: string;
}

export interface IBackendService {
  readonly providerName: BackendProviderType;
  readonly isCloudConnected: boolean;

  // Authentication
  signUp(email: string, password: string, displayName?: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<{ success: boolean; message: string }>;
  getSession(): Promise<UserSession | null>;

  // Data Synchronization
  syncProfile(user: UserProfile): Promise<SyncResult>;
  pullRemoteProfile(userId: string): Promise<UserProfile | null>;
  resolveConflict(local: UserProfile, remote: UserProfile, strategy: ConflictStrategy): UserProfile;

  // File & Asset Storage
  uploadDataset(file: File, userId: string): Promise<DatasetUploadResult>;
  deleteDataset(filePath: string): Promise<boolean>;

  // Data Portability & Safety
  exportBackupJSON(user: UserProfile): string;
  importBackupJSON(jsonString: string): { success: boolean; user?: UserProfile; error?: string };
}
