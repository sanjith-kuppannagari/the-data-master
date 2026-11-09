import React, { useState, useRef } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Settings,
  User,
  Sun,
  Moon,
  Shield,
  Sparkles,
  LogOut,
  Check,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  HardDrive,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    updateProfile,
    resetProgress,
    logout,
    syncStatus,
    lastSyncedAt,
    syncError,
    isCloudConnected,
    isDemoSession,
    syncWithCloud,
    exportUserData,
    importUserData,
  } = useUser();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const [dailyCommitment, setDailyCommitment] = useState(user.dailyCommitmentMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      role,
      targetRole,
      dailyCommitmentMinutes: dailyCommitment,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await syncWithCloud();
    setIsSyncing(false);
    if (res.success) {
      setSyncFeedback('Cloud sync completed successfully!');
    } else {
      setSyncFeedback(res.error || 'Cloud sync could not connect (Local fallback active).');
    }
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleExportBackup = () => {
    const dataStr = exportUserData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_master_backup_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const result = importUserData(content);
      if (result.success) {
        setImportStatus({ success: true, message: 'Learning data successfully restored!' });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus({ success: false, message: result.error || 'Failed to parse backup JSON.' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 pb-16 font-sans max-w-4xl">
      <Breadcrumb items={[{ label: 'Profile & Settings' }]} />

      <div className="border-b border-charcoal-border pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/30">
            <Settings className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-lime font-bold">
            Account Preferences
          </span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Profile & Platform Settings
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Manage your personal goals, daily time commitment, theme preferences, and data portability.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card variant="bordered" className="p-6 bg-charcoal-surface border-charcoal-border space-y-4">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-lime" />
            Profile Details
          </h2>

          <div className="flex items-center gap-4 pb-4 border-b border-charcoal-border">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-lime/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-heading font-semibold text-white">{user.name}</p>
                {isDemoSession ? (
                  <Badge variant="lime">Prototype Demo</Badge>
                ) : (
                  <Badge variant="cyan">Authenticated Explorer</Badge>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{user.email}</p>
              <p className="text-xs font-mono text-lime mt-1 font-semibold">{user.xp} XP Earned • Level {user.level}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="display-name-input" className="block font-mono uppercase text-slate-400 mb-1">
                Display Name
              </label>
              <input
                id="display-name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-midnight border border-charcoal-border text-slate-100 text-xs focus:outline-none focus:border-lime/60 font-sans"
              />
            </div>

            <div>
              <label htmlFor="role-input" className="block font-mono uppercase text-slate-400 mb-1">
                Current Title / Focus
              </label>
              <input
                id="role-input"
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-midnight border border-charcoal-border text-slate-100 text-xs focus:outline-none focus:border-lime/60 font-sans"
              />
            </div>

            <div>
              <label htmlFor="target-role-select" className="block font-mono uppercase text-slate-400 mb-1">
                Target Role
              </label>
              <select
                id="target-role-select"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-midnight border border-charcoal-border text-slate-100 text-xs focus:outline-none focus:border-lime/60 font-sans"
              >
                <option value="Data Analyst">Data Analyst</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="BI Analyst">BI Analyst</option>
                <option value="Product Analyst">Product Analyst</option>
                <option value="Analytics Engineer">Analytics Engineer</option>
              </select>
            </div>

            <div>
              <label htmlFor="daily-commitment-select" className="block font-mono uppercase text-slate-400 mb-1">
                Daily Study Commitment
              </label>
              <select
                id="daily-commitment-select"
                value={dailyCommitment}
                onChange={e => setDailyCommitment(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-midnight border border-charcoal-border text-slate-100 text-xs focus:outline-none focus:border-lime/60 font-sans"
              >
                <option value={15}>15 minutes / day</option>
                <option value={30}>30 minutes / day</option>
                <option value={60}>1 hour / day</option>
                <option value={120}>2 hours / day</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Cloud Synchronization & Data Portability */}
        <Card variant="bordered" className="p-6 bg-charcoal-surface border-charcoal-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan" />
              Cloud Synchronisation & Data Portability
            </h2>
            <Badge variant={isCloudConnected ? 'cyan' : 'lime'}>
              {isCloudConnected ? 'Cloud Synced' : 'Local-First Mode'}
            </Badge>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            THE DATA MASTER employs a <strong>Free-First Architecture</strong>. Your progress, custom queries,
            case studies, and mistake history are securely persisted in your browser without requiring any paid subscriptions.
          </p>

          <div className="p-4 rounded-xl bg-midnight border border-charcoal-border space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isCloudConnected ? (
                  <Cloud className="w-4 h-4 text-cyan" />
                ) : (
                  <HardDrive className="w-4 h-4 text-lime" />
                )}
                <div>
                  <p className="font-heading font-semibold text-white">
                    {isCloudConnected ? 'Supabase PostgreSQL Cloud DB' : 'Local Browser Engine (Active)'}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    Status: <span className="text-lime uppercase font-bold">{syncStatus}</span>
                    {lastSyncedAt && ` • Last synced: ${new Date(lastSyncedAt).toLocaleTimeString()}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-lg bg-charcoal-elevated border border-charcoal-border hover:border-cyan/50 text-slate-200 hover:text-white flex items-center gap-1.5 font-mono text-xs shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan' : ''}`} />
                {isSyncing ? 'Synchronising...' : 'Trigger Sync'}
              </button>
            </div>

            {syncFeedback && (
              <div className="p-2.5 rounded-lg bg-charcoal border border-cyan/40 text-cyan text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncFeedback}</span>
              </div>
            )}

            {syncError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{syncError}</span>
              </div>
            )}
          </div>

          {/* Data Backup & Restore */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-midnight border border-charcoal-border flex flex-col justify-between space-y-2">
              <div>
                <p className="text-xs font-heading font-semibold text-white flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-lime" /> Export Learning Backup (JSON)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Download a comprehensive JSON snapshot of your learning path, practice attempts, projects, and Mistake Journal.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full justify-center font-mono text-xs"
                onClick={handleExportBackup}
              >
                Export Learning Data (.json)
              </Button>
            </div>

            <div className="p-3.5 rounded-xl bg-midnight border border-charcoal-border flex flex-col justify-between space-y-2">
              <div>
                <p className="text-xs font-heading font-semibold text-white flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-cyan" /> Restore From Backup (JSON)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Restore previously exported learning data on any browser or machine without losing completed milestones.
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
                id="restore-file-input"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full justify-center font-mono text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Backup File (.json)
              </Button>
            </div>
          </div>

          {importStatus && (
            <div
              className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                importStatus.success
                  ? 'bg-lime/10 border border-lime/40 text-lime'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {importStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{importStatus.message}</span>
            </div>
          )}
        </Card>

        {/* Theme and Display Preferences */}
        <Card variant="bordered" className="p-6 bg-charcoal-surface border-charcoal-border space-y-4">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan" />
            Display & Studio Preferences
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-midnight border border-charcoal-border text-xs">
            <div>
              <p className="font-heading font-semibold text-white">Visual Theme</p>
              <p className="text-slate-400 text-[11px]">
                Toggle between Digital Observatory Dark (default) and Soft Ivory Light.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle visual theme mode"
              className="px-3 py-1.5 rounded-lg bg-charcoal-elevated border border-charcoal-border text-slate-200 hover:text-white flex items-center gap-2 font-mono text-xs focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-lime" /> : <Sun className="w-3.5 h-3.5 text-orange" />}
              <span className="capitalize">{theme} Mode</span>
            </button>
          </div>
        </Card>

        {/* Data Persistence and Reset */}
        <Card variant="bordered" className="p-6 bg-charcoal-surface border-charcoal-border space-y-4">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange" />
            Session & Data Control
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-midnight border border-charcoal-border text-xs">
            <div>
              <p className="font-heading font-semibold text-white">Reset Local Progress</p>
              <p className="text-slate-400 text-[11px]">
                Restore initial demo state and reset completed topics and activity history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to reset all progress back to initial demo state?')) {
                  resetProgress();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-mono shrink-0 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
            >
              Reset Progress
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={logout}
              className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out of Session
            </button>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs font-mono text-lime flex items-center gap-1">
                  <Check className="w-4 h-4" /> Preferences saved!
                </span>
              )}
              <Button type="submit" variant="primary" size="md">
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
