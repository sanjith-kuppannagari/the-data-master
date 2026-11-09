import React from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../../components/layout/PublicHeader';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge, ClassificationBadge, PriorityBadge } from '../../components/common/Badge';
import { ObservatoryBackdrop } from '../../components/common/ObservatoryBackdrop';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Database,
  BarChart3,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-midnight text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <PublicHeader />
      <ObservatoryBackdrop intensity="medium" />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-elevated border border-lime/30 text-lime text-xs font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(198,243,107,0.15)]">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <span>Digital Exploration Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white leading-[1.08]">
            Your Journey to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-cyan to-ivory">
              Mastering Data
            </span>{' '}
            Starts Here.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto font-normal">
            Explore, experiment, solve real-world problems and build practical abilities through an entirely new learning experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" className="w-full">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/explore" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full">
                Explore the Platform
              </Button>
            </Link>
          </div>

          {/* Key Value Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-lg mx-auto border-t border-charcoal-border/80 text-center font-mono">
            <div>
              <div className="text-2xl font-bold font-heading text-white">15</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Skill Domains</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-heading text-lime">5</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Priority Levels</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-heading text-cyan">100%</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Interactive</div>
            </div>
          </div>
        </div>

        {/* Observatory Constellation Interactive Card Preview */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-charcoal/90 border border-charcoal-border p-2 sm:p-4 shadow-2xl relative">
          <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-border/70 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-lime/80" />
              <span className="ml-2 text-slate-300">the-data-master // interactive-learning-lab</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lime font-bold">SQL WORKSPACE</span>
              <span className="text-slate-500">PostgreSQL 16 Engine</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 text-xs font-mono">
            {/* Left Prompt */}
            <div className="lg:col-span-5 bg-midnight rounded-xl p-4 border border-charcoal-border space-y-3 font-sans">
              <Badge variant="lime">Interactive Mission</Badge>
              <h3 className="text-sm font-heading font-bold text-white">
                Calculate Monthly Cohort Retention
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Determine the percentage of active customers from the Jan 2026 acquisition cohort who made a repeat purchase in Month 2 using window functions.
              </p>
              <div className="p-2.5 rounded-lg bg-charcoal-surface border border-charcoal-border text-[11px] text-slate-400 font-mono">
                Hint: Group transactions by <code className="text-lime">user_id</code> and compute <code className="text-cyan">LAG(order_date) OVER(...)</code>.
              </div>
            </div>

            {/* Right Editor */}
            <div className="lg:col-span-7 bg-midnight rounded-xl p-4 border border-charcoal-border flex flex-col justify-between font-mono">
              <div className="text-slate-300 space-y-1 text-xs">
                <div><span className="text-cyan">WITH</span> cohort_base <span className="text-cyan">AS</span> (</div>
                <div className="pl-4">
                  <span className="text-cyan">SELECT</span> user_id, order_date,
                </div>
                <div className="pl-6">
                  <span className="text-lime">DATE_TRUNC</span>(<span className="text-orange">'month'</span>, <span className="text-lime">MIN</span>(order_date) <span className="text-cyan">OVER</span> (<span className="text-cyan">PARTITION BY</span> user_id)) <span className="text-cyan">AS</span> cohort_month
                </div>
                <div className="pl-4">
                  <span className="text-cyan">FROM</span> customer_orders
                </div>
                <div>)</div>
                <div><span className="text-cyan">SELECT</span> cohort_month, <span className="text-lime">COUNT</span>(<span className="text-cyan">DISTINCT</span> user_id) <span className="text-cyan">AS</span> active_users</div>
                <div><span className="text-cyan">FROM</span> cohort_base <span className="text-cyan">GROUP BY</span> 1;</div>
              </div>

              <div className="pt-4 mt-4 border-t border-charcoal-border flex items-center justify-between">
                <span className="text-[11px] text-lime flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime" />
                  Query Executed: 4 rows returned in 24ms
                </span>
                <span className="text-xs font-bold text-lime">+45 XP Earned</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (THE THREE STAGES) */}
      <section className="py-20 bg-charcoal/40 border-y border-charcoal-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-lime font-semibold">
              The Architecture of Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              Learn → Practise → Challenge → Compete → Build.
            </h2>
            <p className="text-sm text-slate-300">
              Not another passive video course. A three-stage pedagogical cycle designed to build real competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered" className="p-8 space-y-4 hover:border-lime/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime font-heading font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-heading font-bold text-white">
                Learn Through Interactive Experiences
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Bite-sized, gamified lessons with instant feedback. Understand foundational concepts in SQL, Python, Excel, and Statistics through structured visual intuition.
              </p>
              <div className="pt-2 text-xs font-mono text-lime font-medium flex items-center gap-1">
                Inspired by Duolingo's engagement <ArrowRight className="w-3 h-3" />
              </div>
            </Card>

            <Card variant="bordered" className="p-8 space-y-4 hover:border-cyan/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan font-heading font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-heading font-bold text-white">
                Practise Through Hands-On Activities
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Run actual SQL and Python directly in your browser. Solve progressive formula drills, clean real corrupted datasets, and test your hypothesis testing acumen.
              </p>
              <div className="pt-2 text-xs font-mono text-cyan font-medium flex items-center gap-1">
                Inspired by DataCamp's practicality <ArrowRight className="w-3 h-3" />
              </div>
            </Card>

            <Card variant="bordered" className="p-8 space-y-4 hover:border-orange/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange/10 border border-orange/30 flex items-center justify-center text-orange font-heading font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-heading font-bold text-white">
                Build Through Real-World Challenges
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Investigate complex scenarios: revenue drops, fraud spikes, and cohort churn. Build a public portfolio with production-grade case studies and executive readouts.
              </p>
              <div className="pt-2 text-xs font-mono text-orange font-medium flex items-center gap-1">
                Inspired by Kaggle's experimentation <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* EXPLORE THE EXPERIENCE (15 DOMAINS PREVIEW) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-lime font-semibold block mb-2">
              The Complete Knowledge Library
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              15 Comprehensive Skill Academies
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              All 15 domains preserved with original category classifications and distinct learning priority levels. Choose your own path.
            </p>
          </div>
          <Link to="/academies">
            <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
              View All 15 Domains
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURRICULUM_DOMAINS.slice(0, 6).map(domain => (
            <Link key={domain.id} to={`/academies/${domain.slug}`} className="group">
              <Card variant="interactive" className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      DOMAIN {domain.number.toString().padStart(2, '0')}
                    </span>
                    <PriorityBadge level={domain.defaultPriority} />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-lime transition-colors mb-2">
                    {domain.name}
                  </h3>
                  <div className="mb-3">
                    <ClassificationBadge classification={domain.classification} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {domain.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-charcoal-border/70 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{domain.topics.length} core topics</span>
                  <span className="text-lime group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY THE DATA MASTER? */}
      <section className="py-20 bg-charcoal/30 border-t border-charcoal-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-lime font-semibold">
                Product Differentiation
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
                Designed for Outcomes, Not Mere Course Completion.
              </h2>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-lime/10 text-lime mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-heading">Personalised Roadmaps, Zero Lock-In</strong>
                    Choose what you need. Aspiring BI analysts aren't forced into machine learning; engineers aren't held back in spreadsheets.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-cyan/10 text-cyan mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-heading">Business Simulations & Analytical Thinking</strong>
                    Learn how to think like a Senior Analyst: Root cause analysis, MECE framing, and translating numbers into dollar decisions.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-orange/10 text-orange mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-heading">Recruiter-Ready Public Portfolio</strong>
                    Directly export your verified challenge investigations into public case studies to share with hiring managers.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/about">
                  <Button variant="outline" size="sm">
                    Read Our Educational Manifesto
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Swiss Architecture Box */}
            <div className="rounded-2xl bg-charcoal border border-charcoal-border p-6 font-mono text-xs space-y-4">
              <div className="text-slate-400 uppercase tracking-wider text-[11px] pb-2 border-b border-charcoal-border">
                THE 5 PRIORITY LEVELS ARCHITECTURE
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-midnight border border-lime/30 flex items-center justify-between">
                  <span className="text-lime font-bold">Level 1: Core Foundations</span>
                  <span className="text-slate-400">Excel • SQL • Python • Stats</span>
                </div>
                <div className="p-3 rounded-lg bg-midnight border border-cyan/30 flex items-center justify-between">
                  <span className="text-cyan font-bold">Level 2: Analytical Proficiency</span>
                  <span className="text-slate-400">KPI Trees • BI • Storytelling</span>
                </div>
                <div className="p-3 rounded-lg bg-midnight border border-orange/30 flex items-center justify-between">
                  <span className="text-orange font-bold">Level 3: Professional Differentiation</span>
                  <span className="text-slate-400">A/B Testing • Cohorts • Governance</span>
                </div>
                <div className="p-3 rounded-lg bg-midnight border border-purple-500/30 flex items-center justify-between">
                  <span className="text-purple-300 font-bold">Level 4: Advanced / Optional</span>
                  <span className="text-slate-400">ML • Warehouses • Generative AI</span>
                </div>
                <div className="p-3 rounded-lg bg-midnight border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-300 font-bold">Level 5: Career Preparation</span>
                  <span className="text-slate-400">ATS Resumes • Mock Interviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center relative">
        <div className="p-12 rounded-3xl bg-charcoal-surface border border-charcoal-border relative overflow-hidden space-y-6">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-lime/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan/10 rounded-full blur-3xl" />

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Stop Just Learning. <br />
            <span className="text-lime">Start Mastering.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join a modern exploration studio designed to help you analyze with confidence and build verifiable real-world capabilities.
          </p>
          <div className="pt-2">
            <Link to="/onboarding">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
