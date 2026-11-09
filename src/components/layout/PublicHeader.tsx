import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sparkles, Compass, BookOpen, LogIn } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { label: 'Explore Platform', path: '/explore', icon: <Compass className="w-4 h-4" /> },
    { label: 'Curriculum (15 Domains)', path: '/academies', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Philosophy & About', path: '/about', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-midnight/80 border-b border-charcoal-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-charcoal-surface border border-charcoal-border group-hover:border-lime/60 flex items-center justify-center transition-colors">
            <div className="w-4 h-4 relative">
              <span className="absolute inset-0 rounded-full border border-lime animate-ping opacity-40" />
              <span className="absolute inset-1 rounded-full bg-lime" />
            </div>
          </div>
          <div>
            <span className="font-heading font-bold text-lg tracking-tight text-white group-hover:text-lime transition-colors">
              THE DATA MASTER
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Observatory
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'text-lime bg-lime/10 border border-lime/20'
                    : 'text-slate-300 hover:text-white hover:bg-charcoal-surface'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions: Theme toggle + Sign In / Register */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-surface transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link to="/login">
            <Button variant="ghost" size="sm" icon={<LogIn className="w-4 h-4" />}>
              Sign In
            </Button>
          </Link>

          <Link to="/platform/dashboard">
            <Button variant="primary" size="sm">
              Enter Studio
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
