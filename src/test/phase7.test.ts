import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LocalDemoBackendAdapter } from '../services/backend/localBackendAdapter';
import { SupabaseBackendAdapter } from '../services/backend/supabaseBackendAdapter';
import { backendService } from '../services/backend/backendService';
import { UserProfile } from '../types/user';

function createMockUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'usr_phase7_test',
    email: 'ada.lovelace@datamaster.io',
    name: 'Ada Lovelace',
    role: 'Analytics Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio: 'Pioneering analytical architectures',
    targetRole: 'Analytics Engineer',
    experienceLevel: 'Intermediate',
    dailyCommitmentMinutes: 30,
    learningStyles: ['Hands-on exercises', 'Real-world datasets'],
    primaryGoals: ['Master SQL & Python'],
    selectedDomainIds: ['domain-1', 'domain-2'],
    completedTopicIds: ['d1-t1', 'd2-t1'],
    completedLessonIds: ['lesson-sql-01'],
    completedActivityIds: [],
    xp: 500,
    level: 3,
    currentStreak: 7,
    longestStreak: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      enableAIAssistant: true,
      soundEffects: true,
      weeklyGoalMinutes: 180,
      isPortfolioPublic: true,
    },
    practiceAttempts: [
      {
        id: 'att-p7-1',
        exerciseId: 'ex-p7-sql',
        domainId: 'domain-2',
        topicId: 'd2-t1',
        exerciseType: 'sql',
        isCorrect: true,
        submittedAnswer: 'SELECT 1;',
        timestamp: new Date().toISOString(),
        timeSpentSeconds: 45,
      },
    ],
    mistakeRecords: [
      {
        id: 'mistake-p7-1',
        exerciseId: 'ex-p7-sql',
        exerciseTitle: 'SQL Window Frame',
        domainId: 'domain-2',
        domainName: 'SQL & Database Management',
        topicId: 'd2-t1',
        topicTitle: 'Window Functions',
        exerciseType: 'sql',
        submittedAnswer: 'SELECT OVER()',
        expectedAnswer: 'SELECT OVER (PARTITION BY id)',
        errorCategory: 'SQL Query & Syntax',
        explanation: 'Missing window partition clause',
        attemptDate: new Date().toISOString(),
        attemptCount: 1,
        reviewStatus: 'needs_review',
      },
    ],
    ...overrides,
  };
}

async function runPhase7Tests() {
  console.log('=============================================================');
  console.log('RUNNING PHASE 7 AUTOMATED VERIFICATION SUITE');
  console.log('Finalisation, Backend Architecture, Security & a11y');
  console.log('=============================================================\n');

  // Mock in-memory localStorage for Node test runner
  const memoryStorage: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (key: string) => memoryStorage[key] || null,
    setItem: (key: string, value: string) => { memoryStorage[key] = value; },
    removeItem: (key: string) => { delete memoryStorage[key]; },
    clear: () => { Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]); },
    key: (index: number) => Object.keys(memoryStorage)[index] || null,
    length: 0,
  };
  Object.defineProperty(globalThis.localStorage, 'length', {
    get: () => Object.keys(memoryStorage).length,
  });

  // Mock URL.createObjectURL for dataset upload test
  if (!globalThis.URL.createObjectURL) {
    globalThis.URL.createObjectURL = () => 'blob:http://localhost:5173/mock-object-url';
  }

  // ---------------------------------------------------------------------------
  // 1. Local-First / Demo Backend Adapter (Free-First Zero-Config Core)
  // ---------------------------------------------------------------------------
  console.log('1. Testing LocalDemoBackendAdapter...');
  const localAdapter = new LocalDemoBackendAdapter();
  assert.equal(localAdapter.providerName, 'local_demo');
  assert.equal(localAdapter.isCloudConnected, false, 'Local adapter must report isCloudConnected: false');

  // Test sign in and session handling
  const signInRes = await localAdapter.signIn('alex.rivera@datamaster.io', 'demo123');
  assert.equal(signInRes.success, true);
  assert.ok(signInRes.session);
  assert.equal(signInRes.session.isDemo, true, 'alex.rivera must be identified as demo session');

  const session = await localAdapter.getSession();
  assert.ok(session);
  assert.equal(session.email, 'alex.rivera@datamaster.io');

  // Test sign up with custom profile
  const signUpRes = await localAdapter.signUp('custom.analyst@domain.com', 'password', 'Jordan Analyst');
  assert.equal(signUpRes.success, true);
  assert.ok(signUpRes.session);
  assert.equal(signUpRes.session.displayName, 'Jordan Analyst');
  assert.equal(signUpRes.session.isDemo, false, 'Custom registration is not a demo session');

  // Test sign out
  await localAdapter.signOut();
  const sessionAfterSignOut = await localAdapter.getSession();
  assert.equal(sessionAfterSignOut, null, 'Session must be cleared on logout');

  // Test Profile Sync
  const user = createMockUser();
  const syncResult = await localAdapter.syncProfile(user);
  assert.equal(syncResult.success, true);
  assert.equal(syncResult.status, 'offline', 'Local sync status must be offline');

  // Test Data Export (JSON Backup)
  const backupJSON = localAdapter.exportBackupJSON(user);
  assert.ok(backupJSON.includes('THE DATA MASTER'), 'Backup JSON must contain platform header');
  assert.ok(backupJSON.includes('ada.lovelace@datamaster.io'), 'Backup must contain user email');

  // Test Data Import (JSON Restore)
  const importResult = localAdapter.importBackupJSON(backupJSON);
  assert.equal(importResult.success, true, 'Valid backup JSON must import cleanly');
  assert.equal(importResult.user?.id, user.id);

  // Test Data Import Malformed Payload Rejection
  const malformedResult = localAdapter.importBackupJSON('{"corrupted": true}');
  assert.equal(malformedResult.success, false, 'Malformed backup must be safely rejected');

  // Test Dataset Upload Validation & Size Constraints
  const validFile = new File(['col1,col2\n1,2'], 'sample.csv', { type: 'text/csv' });
  const validUpload = await localAdapter.uploadDataset(validFile, 'usr_test');
  assert.equal(validUpload.success, true);
  assert.ok(validUpload.fileUrl.startsWith('blob:'));

  const invalidExtensionFile = new File(['malicious binary'], 'script.exe', { type: 'application/x-msdownload' });
  const invalidExtUpload = await localAdapter.uploadDataset(invalidExtensionFile, 'usr_test');
  assert.equal(invalidExtUpload.success, false, 'Non CSV/JSON files must be rejected');

  // Large file simulation (>10MB)
  const oversizedFile = {
    name: 'oversized.csv',
    size: 15 * 1024 * 1024, // 15MB
  } as File;
  const oversizedUpload = await localAdapter.uploadDataset(oversizedFile, 'usr_test');
  assert.equal(oversizedUpload.success, false, 'Files > 10MB must be rejected in local mode');

  console.log('   ✓ LocalDemoBackendAdapter passed all auth, session, export/import, and file validation tests.');

  // ---------------------------------------------------------------------------
  // 2. Supabase Cloud Backend Adapter (Unconfigured Guard & Integration Layer)
  // ---------------------------------------------------------------------------
  console.log('2. Testing SupabaseBackendAdapter & Conflict Resolution...');
  const supabaseAdapter = new SupabaseBackendAdapter();
  assert.equal(supabaseAdapter.providerName, 'supabase');
  assert.equal(supabaseAdapter.isCloudConnected, false, 'Without env vars, must safely report isCloudConnected: false');

  // Test graceful unconfigured behavior
  const unconfiguredSignIn = await supabaseAdapter.signIn('user@test.com', 'password');
  assert.equal(unconfiguredSignIn.success, false);
  assert.ok(unconfiguredSignIn.error?.includes('credentials not configured'), 'Must provide clear guidance message');

  const unconfiguredSync = await supabaseAdapter.syncProfile(user);
  assert.equal(unconfiguredSync.success, false);
  assert.equal(unconfiguredSync.status, 'offline');

  // Test Conflict Resolution Strategies
  const localUser = createMockUser({
    xp: 600,
    currentStreak: 5,
    longestStreak: 10,
    completedTopicIds: ['d1-t1', 'd1-t2'],
    completedLessonIds: ['lesson-sql-01'],
  });

  const remoteUser = createMockUser({
    xp: 750,
    currentStreak: 8,
    longestStreak: 12,
    completedTopicIds: ['d1-t1', 'd2-t1'],
    completedLessonIds: ['lesson-py-01'],
  });

  // Client Wins Strategy
  const clientWins = supabaseAdapter.resolveConflict(localUser, remoteUser, 'client_wins');
  assert.equal(clientWins.xp, 600);

  // Server Wins Strategy
  const serverWins = supabaseAdapter.resolveConflict(localUser, remoteUser, 'server_wins');
  assert.equal(serverWins.xp, 750);

  // Merge Strategy (Recommended)
  const merged = supabaseAdapter.resolveConflict(localUser, remoteUser, 'merge');
  assert.equal(merged.xp, 750, 'Merge must take highest XP');
  assert.equal(merged.currentStreak, 8, 'Merge must take highest streak');
  assert.equal(merged.longestStreak, 12, 'Merge must take highest longest streak');
  assert.ok(merged.completedTopicIds.includes('d1-t2'), 'Merge must preserve local topic');
  assert.ok(merged.completedTopicIds.includes('d2-t1'), 'Merge must preserve remote topic');
  assert.ok(merged.completedLessonIds?.includes('lesson-sql-01'), 'Merge must preserve local lesson');
  assert.ok(merged.completedLessonIds?.includes('lesson-py-01'), 'Merge must preserve remote lesson');

  console.log('   ✓ SupabaseBackendAdapter unconfigured guards and multi-strategy conflict resolution verified.');

  // ---------------------------------------------------------------------------
  // 3. Backend Service Manager (Dynamic Provider Switching)
  // ---------------------------------------------------------------------------
  console.log('3. Testing BackendServiceManager Provider Selection...');
  assert.equal(backendService.providerName, 'local_demo', 'Default without env vars must be local_demo');
  assert.equal(backendService.isCloudConnected, false);

  // Force provider toggle
  backendService.setProvider('supabase');
  assert.equal(backendService.providerName, 'supabase');

  backendService.setProvider('local_demo');
  assert.equal(backendService.providerName, 'local_demo');

  console.log('   ✓ BackendServiceManager dynamic provider switching verified.');

  // ---------------------------------------------------------------------------
  // 4. PostgreSQL DDL Migration & Row Level Security (RLS) Verification
  // ---------------------------------------------------------------------------
  console.log('4. Testing PostgreSQL DDL Schema & RLS Policies...');
  const schemaPath = path.resolve(process.cwd(), 'supabase/migrations/20261109000000_init_schema.sql');
  assert.ok(fs.existsSync(schemaPath), 'Migration file must exist at supabase/migrations/20261109000000_init_schema.sql');

  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

  // Verify all essential tables are created
  const requiredTables = [
    'profiles',
    'practice_attempts',
    'mistake_records',
    'challenge_submissions',
    'portfolio_projects',
    'community_discussions',
    'discussion_replies',
    'teams',
    'team_members',
    'team_tasks',
    'planned_sessions',
  ];
  for (const table of requiredTables) {
    assert.ok(
      schemaContent.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
      `Schema must define table public.${table}`
    );
  }

  // Verify Row Level Security is explicitly enabled on all tables
  for (const table of requiredTables) {
    assert.ok(
      schemaContent.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`),
      `RLS must be enabled on public.${table}`
    );
  }

  // Verify RLS security policies
  assert.ok(schemaContent.includes('auth.uid() = id'), 'Profiles must have strict user ownership check');
  assert.ok(schemaContent.includes('auth.uid() = user_id'), 'User tables must have user isolation check');
  assert.ok(schemaContent.includes("status = 'published' AND is_public = true"), 'Portfolio must have selective public read rule');
  assert.ok(schemaContent.includes('datasets'), 'Must define datasets storage bucket');
  assert.ok(schemaContent.includes('portfolio-assets'), 'Must define portfolio-assets storage bucket');

  console.log('   ✓ PostgreSQL DDL schema, all 11 tables, storage buckets, and RLS policies verified.');

  // ---------------------------------------------------------------------------
  // 5. Accessibility (a11y) & Reduced Motion Tokens Verification
  // ---------------------------------------------------------------------------
  console.log('5. Testing Accessibility & Reduced Motion CSS Tokens...');
  const cssPath = path.resolve(process.cwd(), 'src/index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(cssContent.includes('prefers-reduced-motion'), 'Must support @media (prefers-reduced-motion: reduce)');
  assert.ok(cssContent.includes(':focus-visible'), 'Must define visible keyboard focus indicators');
  assert.ok(cssContent.includes('.sr-only'), 'Must include screen reader utility class');

  console.log('   ✓ Accessibility tokens, reduced motion, and focus ring definitions verified.');

  // ---------------------------------------------------------------------------
  // 6. Deployment Configuration & SPA Rewrite Rules
  // ---------------------------------------------------------------------------
  console.log('6. Testing Deployment Configuration...');
  const vercelPath = path.resolve(process.cwd(), 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
  assert.ok(vercelConfig.rewrites.some((r: any) => r.destination === '/index.html'), 'Must configure SPA catch-all rewrite to index.html');

  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  assert.ok(fs.existsSync(envExamplePath), '.env.example must exist');
  const envContent = fs.readFileSync(envExamplePath, 'utf-8');
  assert.ok(envContent.includes('VITE_SUPABASE_URL'), 'Must document VITE_SUPABASE_URL');
  assert.ok(envContent.includes('VITE_SUPABASE_ANON_KEY'), 'Must document VITE_SUPABASE_ANON_KEY');

  console.log('   ✓ Deployment SPA rewrites and environment variable templates verified.');

  console.log('\n=============================================================');
  console.log('ALL PHASE 7 VERIFICATION CHECKS PASSED SUCCESSFULLY (100%)');
  console.log('=============================================================');
}

runPhase7Tests().catch(err => {
  console.error('Phase 7 verification failed:', err);
  process.exit(1);
});
