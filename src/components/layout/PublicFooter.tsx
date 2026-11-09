import React from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-charcoal border-t border-charcoal-border pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-charcoal-border/70">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-midnight border border-charcoal-border flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-lime" />
              </div>
              <span className="font-heading font-bold text-white text-lg tracking-tight">
                THE DATA MASTER
              </span>
            </Link>
            <p className="text-sm text-slate-300 font-heading font-medium mb-2">
              Learn. Analyse. Master Data.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              A personalised digital exploration studio synthesizing gamified engagement, rigorous browser practice, and Kaggle-scale real-world analytical challenges.
            </p>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lime/10 text-lime border border-lime/20">
                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                Observatory v1.0
              </span>
              <span className="text-slate-500">15 Domains Active</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-lime transition-colors">
                  Platform Tour
                </Link>
              </li>
              <li>
                <Link to="/academies" className="hover:text-lime transition-colors">
                  15 Skill Academies
                </Link>
              </li>
              <li>
                <Link to="/platform/lab" className="hover:text-lime transition-colors">
                  Learning Lab
                </Link>
              </li>
              <li>
                <Link to="/platform/practice" className="hover:text-lime transition-colors">
                  Practice Arena
                </Link>
              </li>
              <li>
                <Link to="/platform/playground" className="hover:text-lime transition-colors">
                  Dataset Playground
                </Link>
              </li>
              <li>
                <Link to="/platform/challenges" className="hover:text-lime transition-colors">
                  Challenges & Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Pillars & Method */}
          <div>
            <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-200 mb-4">
              Pedagogy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-lime transition-colors">
                  Core Philosophy
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Pillar 1: Gamified Learning</span>
              </li>
              <li>
                <span className="text-slate-500">Pillar 2: Interactive Practice</span>
              </li>
              <li>
                <span className="text-slate-500">Pillar 3: Real Challenges</span>
              </li>
              <li>
                <span className="text-slate-500">5 Priority Levels</span>
              </li>
              <li>
                <Link to="/platform/simulations" className="hover:text-lime transition-colors">
                  Business Simulations
                </Link>
              </li>
            </ul>
          </div>

          {/* Curricula sample */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-200 mb-4">
              Core Academies Directory
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
              {CURRICULUM_DOMAINS.slice(0, 10).map(domain => (
                <Link
                  key={domain.id}
                  to={`/academies/${domain.slug}`}
                  className="hover:text-lime truncate transition-colors text-slate-400"
                >
                  {domain.number}. {domain.name}
                </Link>
              ))}
              <Link to="/academies" className="text-lime hover:underline font-mono text-[11px] mt-1">
                View all 15 domains →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} THE DATA MASTER. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#governance" className="hover:text-slate-300 transition-colors">
              DPDP & GDPR Framework
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
