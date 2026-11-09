import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { AppNotification } from '../../types/notification';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Flame,
  AlertCircle,
  Trophy,
  Users,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    user,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
    updateNotificationPreferences,
  } = useUser();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [showPreferences, setShowPreferences] = useState(false);

  if (!isOpen) return null;

  const notifications = user.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  const prefs = user.notificationPreferences || {
    streakReminders: true,
    revisionAlerts: true,
    challengeUpdates: true,
    teamNotifications: true,
    achievementPops: true,
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'learning_reminder':
        return <Flame className="w-4 h-4 text-orange" />;
      case 'revision_recommendation':
        return <AlertCircle className="w-4 h-4 text-orange" />;
      case 'achievement_unlock':
        return <Trophy className="w-4 h-4 text-lime" />;
      case 'team_activity':
        return <Users className="w-4 h-4 text-cyan" />;
      case 'challenge_deadline':
        return <Clock className="w-4 h-4 text-cyan" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-midnight/60 backdrop-blur-sm select-none font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Observatory Alerts Drawer"
    >
      <div className="w-full max-w-md bg-charcoal border-l border-charcoal-border h-full flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-charcoal-border flex items-center justify-between bg-charcoal-muted shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-lime/10 border border-lime/30 text-lime">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-soft-ivory">Observatory Alerts</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-lime text-midnight text-[10px] font-bold font-mono">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Curriculum & revision telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreferences(prev => !prev)}
              aria-label="Toggle notification preferences"
              className={`p-1.5 rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none ${
                showPreferences
                  ? 'bg-lime/10 border-lime text-lime'
                  : 'bg-midnight border-charcoal-border text-slate-400 hover:text-soft-ivory'
              }`}
              title="Notification Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close alerts drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-soft-ivory hover:bg-midnight transition-colors focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preferences Drawer Section (Expandable) */}
        {showPreferences && (
          <div className="p-4 bg-midnight border-b border-charcoal-border space-y-3 text-xs shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                Alert Preferences
              </span>
              <span className="text-[10px] text-slate-500 font-mono">In-App Only</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Streak Preservation Warnings</span>
                <input
                  type="checkbox"
                  checked={prefs.streakReminders}
                  onChange={e => updateNotificationPreferences({ streakReminders: e.target.checked })}
                  className="accent-lime"
                />
              </label>
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Smart Revision Reminders</span>
                <input
                  type="checkbox"
                  checked={prefs.revisionAlerts}
                  onChange={e => updateNotificationPreferences({ revisionAlerts: e.target.checked })}
                  className="accent-lime"
                />
              </label>
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Weekly Challenge & Sprint Deadlines</span>
                <input
                  type="checkbox"
                  checked={prefs.challengeUpdates}
                  onChange={e => updateNotificationPreferences({ challengeUpdates: e.target.checked })}
                  className="accent-lime"
                />
              </label>
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Collaborative Squad Tasks</span>
                <input
                  type="checkbox"
                  checked={prefs.teamNotifications}
                  onChange={e => updateNotificationPreferences({ teamNotifications: e.target.checked })}
                  className="accent-lime"
                />
              </label>
            </div>
          </div>
        )}

        {/* Controls: Mark all read & Filter pills */}
        <div className="px-4 py-2.5 border-b border-charcoal-border flex items-center justify-between bg-charcoal text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-midnight text-lime font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeFilter === 'unread'
                  ? 'bg-midnight text-lime font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-lime hover:underline flex items-center gap-1 font-mono"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Notifications List Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 scrollbar-thin">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500 font-mono space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
              <p>No {activeFilter === 'unread' ? 'unread' : ''} notifications at this time.</p>
              <p className="text-[10px] text-slate-600">You're completely up to date!</p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2 ${
                  !notif.read
                    ? 'bg-midnight/80 border-lime/30 shadow-sm'
                    : 'bg-midnight/30 border-charcoal-border opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded-lg bg-charcoal border border-charcoal-border shrink-0 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div>
                      <h4
                        className={`font-semibold ${
                          !notif.read ? 'text-soft-ivory' : 'text-slate-300'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationRead(notif.id)}
                        className="p-1 rounded text-slate-400 hover:text-lime"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="p-1 rounded text-slate-500 hover:text-orange"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Link Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-charcoal-border/40 text-[10px] font-mono text-slate-500">
                  <span>{new Date(notif.timestamp).toLocaleDateString()}</span>
                  {notif.actionUrl && (
                    <button
                      onClick={() => {
                        onClose();
                        navigate(notif.actionUrl!);
                      }}
                      className="text-lime hover:underline flex items-center gap-1 font-bold"
                    >
                      {notif.actionLabel || 'View Details'} →
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-charcoal-border bg-charcoal-muted text-center text-[10px] text-slate-500 font-mono shrink-0">
          Local In-App Stream • Zero External Telemetry
        </div>
      </div>
    </div>
  );
};
