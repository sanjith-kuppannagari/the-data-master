import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { calculateLevelInfo } from '../../services/gamification';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { syncInAppNotifications } from '../../services/notificationEngine';
import {
  Menu,
  Sun,
  Moon,
  Flame,
  Zap,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from 'lucide-react';

interface TopHeaderProps {
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, logout, updateProfile } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Sync notifications on mount if needed
  React.useEffect(() => {
    const synced = syncInAppNotifications(user);
    if (!user.notifications || user.notifications.length !== synced.length) {
      updateProfile({ notifications: synced });
    }
  }, [user.currentStreak, user.xp, user.mistakeRecords?.length]);

  const levelInfo = calculateLevelInfo(user.xp);
  const unreadNotifs = (user.notifications || []).filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 h-16 bg-charcoal/90 backdrop-blur-md border-b border-charcoal-border px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Mobile hamburger & Context breadcrumb/indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-surface"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Observatory Station Active
          </span>
        </div>
      </div>

      {/* Right: Gamified Stats + Actions + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Streak Counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange/10 border border-orange/30 text-orange"
          title={`${user.currentStreak} day learning streak!`}
        >
          <Flame className="w-4 h-4 fill-orange animate-bounce-subtle shrink-0" />
          <span className="text-xs font-mono font-bold tracking-tight">
            {user.currentStreak}
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-orange/80">
            {user.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* XP Counter */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime/10 border border-lime/30 text-lime"
          title={`${user.xp} XP total • ${levelInfo.xpNeededForNext} XP to Level ${levelInfo.level + 1}`}
        >
          <Zap className="w-4 h-4 fill-lime shrink-0" />
          <span className="text-xs font-mono font-bold tracking-tight">
            {user.xp}
          </span>
          <span className="text-[11px] font-mono text-lime/80">XP</span>
        </div>

        {/* Level Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-elevated border border-charcoal-border">
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-lime/20 text-lime font-bold">
            LVL {levelInfo.level}
          </span>
          <span className="text-xs text-slate-200 font-heading font-medium truncate max-w-[140px]">
            {levelInfo.title}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          aria-label={`Observatory Alerts (${unreadNotifs} unread)`}
          aria-expanded={isNotificationDrawerOpen}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-surface transition-colors relative focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-lime animate-pulse ring-2 ring-charcoal" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Toggle theme (current: ${theme} mode)`}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-surface transition-colors focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(prev => !prev)}
            aria-label="User profile menu"
            aria-expanded={profileDropdownOpen}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-charcoal-surface transition-colors focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-charcoal-border"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-charcoal-surface border border-charcoal-border shadow-2xl py-2 z-50 text-xs"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-charcoal-border">
                <p className="font-heading font-semibold text-slate-100 truncate">{user.name}</p>
                <p className="font-mono text-[10px] text-slate-400 truncate">{user.email}</p>
                <p className="text-[10px] text-lime mt-1 font-medium">{user.role}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/platform/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-charcoal-elevated"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile & Goals</span>
                </Link>
                <Link
                  to="/platform/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-charcoal-elevated"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferences</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-charcoal-border">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </header>
  );
};
