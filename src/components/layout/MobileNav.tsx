import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Milestone,
  GraduationCap,
  Terminal,
  Swords,
  Database,
  Trophy,
  Briefcase,
  Search,
  FolderGit2,
  Users,
  MessageSquare,
  LineChart,
  Award,
  AlertCircle,
  Calendar,
  Settings,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const links = [
    { name: 'Dashboard', path: '/platform/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'My Learning Journey', path: '/platform/journey', icon: <Milestone className="w-4 h-4" /> },
    { name: '15 Academies', path: '/platform/academies', icon: <GraduationCap className="w-4 h-4" /> },
    { name: 'Learning Lab', path: '/platform/lab', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Practice Arena', path: '/platform/practice', icon: <Swords className="w-4 h-4" /> },
    { name: 'Dataset Playground', path: '/platform/playground', icon: <Database className="w-4 h-4" /> },
    { name: 'Challenges', path: '/platform/challenges', icon: <Trophy className="w-4 h-4" /> },
    { name: 'Business Simulations', path: '/platform/simulations', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Data Detective', path: '/platform/detective', icon: <Search className="w-4 h-4" /> },
    { name: 'Portfolio Builder', path: '/platform/portfolio', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Community', path: '/platform/community', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Teams & Squads', path: '/platform/teams', icon: <Users className="w-4 h-4" /> },
    { name: 'Progress & Analytics', path: '/platform/progress', icon: <LineChart className="w-4 h-4" /> },
    { name: 'Achievements', path: '/platform/achievements', icon: <Award className="w-4 h-4" /> },
    { name: 'Mistake Journal', path: '/platform/mistakes', icon: <AlertCircle className="w-4 h-4" /> },
    { name: 'Learning Calendar', path: '/platform/calendar', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Settings', path: '/platform/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-50 md:hidden flex select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-charcoal border-r border-charcoal-border flex flex-col h-full z-10 shadow-2xl">
        <div className="h-16 px-4 flex items-center justify-between border-b border-charcoal-border">
          <Link to="/platform/dashboard" onClick={onClose} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-midnight border border-charcoal-border flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-lime" />
            </div>
            <span className="font-heading font-bold text-sm tracking-tight text-white">
              THE DATA MASTER
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-surface min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Mobile menu links">
          {links.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-medium transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none ${
                  isActive
                    ? 'bg-lime/10 text-lime font-semibold border border-lime/30'
                    : 'text-slate-300 hover:text-white hover:bg-charcoal-surface'
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="font-heading tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
