import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigationSections = [
    {
      title: 'LEARNING ENGINE',
      items: [
        { name: 'Dashboard', path: '/platform/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'My Journey', path: '/platform/journey', icon: <Milestone className="w-4 h-4" /> },
        { name: 'Academies (15)', path: '/platform/academies', icon: <GraduationCap className="w-4 h-4" /> },
        { name: 'Learning Lab', path: '/platform/lab', icon: <Terminal className="w-4 h-4" />, badge: 'Studio' },
      ],
    },
    {
      title: 'PRACTICE & EXPERIMENTATION',
      items: [
        { name: 'Practice Arena', path: '/platform/practice', icon: <Swords className="w-4 h-4" /> },
        { name: 'Dataset Playground', path: '/platform/playground', icon: <Database className="w-4 h-4" /> },
        { name: 'Challenges', path: '/platform/challenges', icon: <Trophy className="w-4 h-4" /> },
        { name: 'Business Simulations', path: '/platform/simulations', icon: <Briefcase className="w-4 h-4" />, badge: 'Unique' },
        { name: 'Data Detective', path: '/platform/detective', icon: <Search className="w-4 h-4" /> },
      ],
    },
    {
      title: 'MASTERY & CAREER',
      items: [
        { name: 'Portfolio Builder', path: '/platform/portfolio', icon: <FolderGit2 className="w-4 h-4" /> },
        { name: 'Community', path: '/platform/community', icon: <MessageSquare className="w-4 h-4" /> },
        { name: 'Teams & Squads', path: '/platform/teams', icon: <Users className="w-4 h-4" /> },
        { name: 'Progress Analytics', path: '/platform/progress', icon: <LineChart className="w-4 h-4" /> },
        { name: 'Achievements', path: '/platform/achievements', icon: <Award className="w-4 h-4" /> },
        { name: 'Mistake Journal', path: '/platform/mistakes', icon: <AlertCircle className="w-4 h-4" /> },
        { name: 'Learning Calendar', path: '/platform/calendar', icon: <Calendar className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={`relative hidden md:flex flex-col bg-charcoal border-r border-charcoal-border transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-charcoal-border">
        {!isCollapsed ? (
          <Link to="/platform/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-midnight border border-charcoal-border flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse-subtle" />
            </div>
            <div className="truncate">
              <span className="font-heading font-bold text-sm tracking-tight text-white block">
                THE DATA MASTER
              </span>
              <span className="text-[10px] font-mono text-lime tracking-widest uppercase block">
                Observatory
              </span>
            </div>
          </Link>
        ) : (
          <Link to="/platform/dashboard" className="mx-auto" title="The Data Master">
            <div className="w-8 h-8 rounded-md bg-midnight border border-charcoal-border flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-lime" />
            </div>
          </Link>
        )}

        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-surface transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 scrollbar-thin">
        {navigationSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none ${
                      isActive
                        ? 'bg-lime/10 text-lime font-semibold border border-lime/30 shadow-[0_0_15px_rgba(198,243,107,0.1)]'
                        : 'text-slate-300 hover:text-white hover:bg-charcoal-surface border border-transparent'
                    }`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="truncate flex-1 font-heading tracking-wide">
                      {item.name}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-lime/20 text-lime font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Settings Section */}
      <div className="p-2 border-t border-charcoal-border space-y-1">
        <NavLink
          to="/platform/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'bg-lime/10 text-lime border border-lime/30'
                : 'text-slate-300 hover:text-white hover:bg-charcoal-surface'
            }`
          }
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="font-heading">Settings & Preferences</span>}
        </NavLink>

        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-surface transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
