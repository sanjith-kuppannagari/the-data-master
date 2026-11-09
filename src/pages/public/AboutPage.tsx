import React from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ObservatoryBackdrop } from '../../components/common/ObservatoryBackdrop';
import { PRIORITY_LEVELS } from '../../data/priorityLevels';
import { PriorityLevel } from '../../types/curriculum';
import { CheckCircle, Layers, Zap, Terminal, Trophy, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-midnight text-slate-100 flex flex-col font-sans">
      <PublicHeader />
      <ObservatoryBackdrop intensity="medium" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Intro */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="lime">Platform Philosophy</Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            The Digital Exploration Studio
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            The Data Master was created to dismantle the broken passive video-watching model of online education and replace it with an active, rigorous, and personalized exploration workbench.
          </p>
        </section>

        {/* 3 Pillars */}
        <section className="space-y-8">
          <div className="border-b border-charcoal-border pb-4">
            <h2 className="text-2xl font-heading font-bold text-white tracking-tight">
              Three Integrated Pillars
            </h2>
            <p className="text-xs font-mono uppercase text-lime tracking-wider mt-1">
              Synthesized into an original digital experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="bordered" className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">
                Pillar 1: Gamified Learning
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspired by Duolingo's retention and engagement principles: bite-sized progressive lessons, streak tracking, unlockable milestones, and XP progression without childish caricatures.
              </p>
            </Card>

            <Card variant="bordered" className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">
                Pillar 2: Interactive Practice
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspired by DataCamp’s hands-on rigor: split-screen learning lab, live browser execution of SQL queries, Python data wrangling, formula debugging, and instant validation.
              </p>
            </Card>

            <Card variant="bordered" className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-orange/10 border border-orange/30 flex items-center justify-center text-orange">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">
                Pillar 3: Real Challenges
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspired by Kaggle’s real-world experimentation: authentic messy datasets, business simulations, root-cause investigations, portfolio case studies, and optional competitions.
              </p>
            </Card>
          </div>
        </section>

        {/* The 5 Priority Levels */}
        <section className="space-y-6">
          <div className="border-b border-charcoal-border pb-4">
            <h2 className="text-2xl font-heading font-bold text-white tracking-tight">
              The Five Learning Priority Levels
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              An independent sequence describing recommended learning depth without restricting domain exploration.
            </p>
          </div>

          <div className="space-y-4">
            {(Object.keys(PRIORITY_LEVELS) as PriorityLevel[]).map(key => {
              const item = PRIORITY_LEVELS[key];
              return (
                <Card key={key} variant="bordered" className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-white text-base">
                        {item.level}: {item.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400">— {item.tagline}</span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Target audience: {item.recommendedAudience}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-8">
          <Link to="/platform/dashboard">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Enter The Learning Studio
            </Button>
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
