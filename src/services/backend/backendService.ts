import { IBackendService, BackendProviderType } from './types';
import { LocalDemoBackendAdapter } from './localBackendAdapter';
import { SupabaseBackendAdapter } from './supabaseBackendAdapter';

/**
 * Backend Service Manager
 * Auto-selects the appropriate backend adapter based on environment variables.
 * Defaults to 100% Free, Offline LocalDemoBackendAdapter if no cloud credentials exist.
 */
class BackendServiceManager {
  private activeAdapter: IBackendService;

  constructor() {
    const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
    const hasSupabaseUrl = !!env?.VITE_SUPABASE_URL;
    const hasSupabaseKey = !!env?.VITE_SUPABASE_ANON_KEY;

    if (hasSupabaseUrl && hasSupabaseKey) {
      this.activeAdapter = new SupabaseBackendAdapter();
    } else {
      this.activeAdapter = new LocalDemoBackendAdapter();
    }
  }

  get adapter(): IBackendService {
    return this.activeAdapter;
  }

  get providerName(): BackendProviderType {
    return this.activeAdapter.providerName;
  }

  get isCloudConnected(): boolean {
    return this.activeAdapter.isCloudConnected;
  }

  // Force provider switch (e.g. for testing or user toggling demo vs cloud)
  setProvider(provider: BackendProviderType): void {
    if (provider === 'supabase') {
      this.activeAdapter = new SupabaseBackendAdapter();
    } else {
      this.activeAdapter = new LocalDemoBackendAdapter();
    }
  }
}

export const backendService = new BackendServiceManager();
