import React from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ObservatoryBackdrop } from '../../components/common/ObservatoryBackdrop';
import {
  Terminal,
  Swords,
  Database,
  Trophy,
  Briefcase,
  Search,
  FolderGit2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const features = [
    {
      title: 'Learning Lab',
      tagline: 'Split-Screen Distraction-Free Workspace',
      desc: 'Bite-sized pedagogical guides on the left, interactive query and code execution editors on the right. Instant feedback with progressive hints and zero fluff.',
      icon: <Terminal className="w-6 h-6 text-lime" />,
      link: '/platform/lab',
      badge: 'Interactive',
    },
    {
      title: 'Practice Arena',
      tagline: 'Independent Multi-Disciplinary Drills',
      desc: 'Hone specific skills: correct broken SQL syntax, debug Excel formulas, identify misleading visualizations, and interpret statistical test results under timed conditions.',
      icon: <Swords className="w-6 h-6 text-cyan" />,
      link: '/platform/practice',
      badge: 'Drills',
    },
    {
      title: 'Dataset Playground',
      tagline: 'Lightweight Analytical Workbench',
      desc: 'Load real-world multi-dimensional datasets into a high-performance browser table. Filter, sort, compute summary distributions, and toggle to reactive visual charts.',
      icon: <Database className="w-6 h-6 text-lime" />,
      link: '/platform/playground',
      badge: 'Exploration',
    },
    {
      title: 'Challenges & Competitions',
      tagline: 'Kaggle-Scale Problem Solving',
      desc: 'Solve authentic analytical dilemmas. Support both code and spreadsheet submissions with transparent evaluation criteria and unmanipulated community leaderboards.',
      icon: <Trophy className="w-6 h-6 text-orange" />,
      link: '/platform/challenges',
      badge: 'Competition',
    },
    {
      title: 'Business Simulations',
      tagline: 'Executive Scenario Investigations',
      desc: 'Investigate realistic corporate scenarios: 20% revenue drops, sudden customer churn spikes, or inventory bottlenecks. Make executive recommendations backed by numbers.',
      icon: <Briefcase className="w-6 h-6 text-orange" />,
      link: '/platform/simulations',
      badge: 'Differentiator',
    },
    {
      title: 'Data Detective',
      tagline: 'Data Mystery Investigations',
      desc: 'Follow statistical clues, audit audit logs, expose anomalies, and piece together the narrative to solve a data mystery.',
      icon: <Search className="w-6 h-6 text-cyan" />,
      link: '/platform/detective',
      badge: 'Gamified',
    },
    {
      title: 'Portfolio Builder',
      tagline: 'Recruiter-Ready Case Studies',
      desc: 'Document your business problem scoping, data extraction, cleaning pipelines, charts, and recommendations into shareable public portfolio pages.',
      icon: <FolderGit2 className="w-6 h-6 text-lime" />,
      link: '/platform/portfolio',
      badge: 'Career',
    },
  ];

  return (
    <div className="min-h-screen bg-midnight text-slate-100 flex flex-col font-sans">
      <PublicHeader />
      <ObservatoryBackdrop intensity="medium" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="cyan">Studio Capabilities</Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Explore the Platform Workspaces
          </h1>
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            Every environment in The Data Master is designed around a distinct mode of thinking, from disciplined foundational practice to high-stakes business simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <Card key={idx} variant="interactive" className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-charcoal-elevated border border-charcoal-border">
                    {item.icon}
                  </div>
                  <Badge variant="neutral">{item.badge}</Badge>
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-lime mb-3">
                  {item.tagline}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-charcoal-border/70 mt-6">
                <Link to={item.link}>
                  <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right" className="w-full justify-between">
                    Launch Environment
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
