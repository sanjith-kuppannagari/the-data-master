import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { CURRICULUM_DOMAINS } from '../../data/curriculum';
import { ExperienceLevel, LearningStyle } from '../../types/user';
import { generateLearningPath } from '../../services/pathGenerator';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, PriorityBadge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ObservatoryBackdrop } from '../../components/common/ObservatoryBackdrop';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

const GOAL_OPTIONS = [
  { id: 'data-analyst', title: 'Become a Data Analyst', desc: 'Master SQL, Python, Excel, statistics, cleaning and portfolio projects.', role: 'Data Analyst' },
  { id: 'business-analyst', title: 'Become a Business Analyst', desc: 'Focus on business understanding, KPI trees, financial models and storytelling.', role: 'Business Analyst' },
  { id: 'bi-analyst', title: 'Become a BI Analyst', desc: 'Specialise in Tableau, Power BI, SQL data modeling and executive reporting.', role: 'BI Analyst' },
  { id: 'product-analyst', title: 'Become a Product Analyst', desc: 'Focus on cohort retention, A/B experimentation, conversion funnels and user metrics.', role: 'Product Analyst' },
  { id: 'current-job', title: 'Learn Analytics for My Current Job', desc: 'Apply practical data skills immediately to enhance workplace efficiency.', role: 'Commercial Analyst' },
  { id: 'internship', title: 'Prepare for Internships & Placements', desc: 'Build technical readiness, solve interview challenges and showcase a portfolio.', role: 'Junior Analyst' },
  { id: 'beginner', title: 'Explore Data Analytics as a Beginner', desc: 'Build a solid, stress-free foundation from the ground up.', role: 'Data Explorer' },
  { id: 'personal', title: 'Learn Specific Skills for Personal Interest', desc: 'Handpick specific domains and progress at your own pace.', role: 'Independent Learner' },
];

const EXPERIENCE_OPTIONS: { level: ExperienceLevel; label: string; desc: string }[] = [
  { level: 'Complete beginner', label: 'Complete Beginner', desc: 'Brand new to spreadsheets, code and analytical mathematics.' },
  { level: 'Basic knowledge', label: 'Basic Knowledge', desc: 'Familiar with simple spreadsheets or basic arithmetic; ready for real SQL.' },
  { level: 'Intermediate', label: 'Intermediate', desc: 'Comfortable with writing basic queries and formulas; want advanced techniques.' },
  { level: 'Advanced', label: 'Advanced', desc: 'Experienced practitioner aiming to master specialized modeling, ML, and executive narrative.' },
];

const TIME_OPTIONS = [
  { minutes: 15, label: '15 minutes / day', desc: 'Bite-sized micro-learning, ideal for busy schedules.' },
  { minutes: 30, label: '30 minutes / day', desc: 'Balanced pace for steady progression and consistent habit.' },
  { minutes: 60, label: '1 hour / day', desc: 'Accelerated immersion with comprehensive daily practice.' },
  { minutes: 120, label: '2 hours / day', desc: 'Intensive career transformation track.' },
];

const STYLE_OPTIONS: { style: LearningStyle; desc: string }[] = [
  { style: 'Short lessons', desc: 'Bite-sized structured theoretical breakdowns.' },
  { style: 'Hands-on exercises', desc: 'Interactive code and formula practice editors.' },
  { style: 'Real-world datasets', desc: 'Exploring and transforming authentic messy data.' },
  { style: 'Business case studies', desc: 'Investigating realistic commercial dilemmas.' },
  { style: 'Projects', desc: 'End-to-end multi-tool portfolio capstones.' },
  { style: 'Competitions', desc: 'Challenging scenarios with community leaderboards.' },
  { style: 'A combination of everything', desc: 'A rich multimodal hybrid curriculum.' },
];

const OUTCOME_OPTIONS = [
  'Gain practical skills',
  'Build a recruiter-ready portfolio',
  'Prepare for a career transition',
  'Improve current job performance',
  'Pass technical interviews',
  'Explore new analytical domains',
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [selectedGoals, setSelectedGoals] = useState<string[]>(user.primaryGoals || ['Become a Data Analyst']);
  const [selectedRole, setSelectedRole] = useState<string>(user.targetRole || 'Data Analyst');
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>(
    user.selectedDomainIds.length > 0
      ? user.selectedDomainIds
      : ['domain-1', 'domain-2', 'domain-3', 'domain-4', 'domain-5', 'domain-6', 'domain-7', 'domain-9']
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(user.experienceLevel || 'Basic knowledge');
  const [dailyMinutes, setDailyMinutes] = useState<number>(user.dailyCommitmentMinutes || 30);
  const [selectedStyles, setSelectedStyles] = useState<LearningStyle[]>(
    user.learningStyles.length > 0 ? user.learningStyles : ['Hands-on exercises', 'Real-world datasets', 'Business case studies']
  );
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>(
    user.intendedOutcomes || ['Gain practical skills', 'Build a recruiter-ready portfolio']
  );

  const toggleGoal = (title: string, role: string) => {
    setSelectedGoals(prev => {
      const exists = prev.includes(title);
      const updated = exists ? prev.filter(g => g !== title) : [...prev, title];
      return updated.length > 0 ? updated : [title];
    });
    setSelectedRole(role);
  };

  const toggleDomain = (domainId: string) => {
    setSelectedDomainIds(prev => {
      const exists = prev.includes(domainId);
      const updated = exists ? prev.filter(d => d !== domainId) : [...prev, domainId];
      return updated.length > 0 ? updated : [domainId];
    });
  };

  const toggleStyle = (style: LearningStyle) => {
    setSelectedStyles(prev => {
      const exists = prev.includes(style);
      const updated = exists ? prev.filter(s => s !== style) : [...prev, style];
      return updated.length > 0 ? updated : [style];
    });
  };

  const toggleOutcome = (outcome: string) => {
    setSelectedOutcomes(prev => {
      const exists = prev.includes(outcome);
      const updated = exists ? prev.filter(o => o !== outcome) : [...prev, outcome];
      return updated.length > 0 ? updated : [outcome];
    });
  };

  const handleFinishOnboarding = () => {
    // Generate the personalized learning roadmap
    const path = generateLearningPath({
      userId: user.id,
      targetRole: selectedRole,
      primaryGoals: selectedGoals,
      selectedDomainIds,
      experienceLevel,
      dailyCommitmentMinutes: dailyMinutes,
      completedTopicIds: user.completedTopicIds,
    });

    // Update user profile with onboarding responses
    updateProfile({
      targetRole: selectedRole,
      primaryGoals: selectedGoals,
      selectedDomainIds,
      experienceLevel,
      dailyCommitmentMinutes: dailyMinutes,
      learningStyles: selectedStyles,
      intendedOutcomes: selectedOutcomes,
      onboardingCompleted: true,
    });

    navigate('/platform/journey');
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-midnight text-slate-100 flex flex-col font-sans relative selection:bg-lime selection:text-midnight">
      <ObservatoryBackdrop intensity="medium" />

      {/* Header */}
      <header className="h-16 px-6 border-b border-charcoal-border flex items-center justify-between bg-charcoal/80 backdrop-blur-md sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-midnight border border-charcoal-border flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
          </div>
          <span className="font-heading font-extrabold text-sm tracking-tight text-white">
            THE DATA MASTER
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            Step <strong className="text-lime">{step}</strong> of {totalSteps}
          </span>
          <button
            onClick={() => navigate('/platform/dashboard')}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Skip to Studio
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-charcoal-border/50 h-1">
        <div
          className="bg-lime h-full transition-all duration-300 shadow-[0_0_12px_rgba(198,243,107,0.5)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Content Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex flex-col justify-between">
        <div>
          {/* STEP 1: LEARNING GOAL */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime">Step 1 of 6</Badge>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                  What is your primary learning goal?
                </h1>
                <p className="text-sm text-slate-300">
                  Select all that align with your aspirations. We will calibrate your starting recommendations accordingly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {GOAL_OPTIONS.map(opt => {
                  const isSelected = selectedGoals.includes(opt.title);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleGoal(opt.title, opt.role)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-lime/10 border-lime ring-1 ring-lime/40 text-white shadow-[0_0_15px_rgba(198,243,107,0.1)]'
                          : 'bg-charcoal-surface border-charcoal-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-heading font-bold text-sm text-white">
                          {opt.title}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS & DOMAIN SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime">Step 2 of 6</Badge>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                  Which skill domains do you want to master?
                </h1>
                <p className="text-sm text-slate-300">
                  Select from all 15 authoritative syllabus academies. You are free to choose any combination; prerequisites will be sequenced automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                {CURRICULUM_DOMAINS.map(domain => {
                  const isSelected = selectedDomainIds.includes(domain.id);
                  return (
                    <button
                      key={domain.id}
                      onClick={() => toggleDomain(domain.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-lime/10 border-lime ring-1 ring-lime/40 text-white'
                          : 'bg-charcoal-surface border-charcoal-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
                          <span>ACADEMY {domain.number.toString().padStart(2, '0')}</span>
                          <PriorityBadge level={domain.defaultPriority} size="sm" />
                        </div>
                        <h3 className="font-heading font-bold text-xs text-white mb-1">
                          {domain.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                          {domain.tagline}
                        </p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-charcoal-border/50 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">{domain.topics.length} topics</span>
                        <span className={isSelected ? 'text-lime font-bold' : 'text-slate-500'}>
                          {isSelected ? '✓ Selected' : '+ Add'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE LEVEL */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime">Step 3 of 6</Badge>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                  What is your current analytical experience?
                </h1>
                <p className="text-sm text-slate-300">
                  We use this to establish your initial difficulty baseline and fast-track topics you have already mastered.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {EXPERIENCE_OPTIONS.map(opt => {
                  const isSelected = experienceLevel === opt.level;
                  return (
                    <button
                      key={opt.level}
                      onClick={() => setExperienceLevel(opt.level)}
                      className={`w-full p-5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-lime/10 border-lime ring-1 ring-lime/40 text-white'
                          : 'bg-charcoal-surface border-charcoal-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div>
                        <span className="font-heading font-bold text-base text-white block mb-1">
                          {opt.label}
                        </span>
                        <span className="text-xs text-slate-400 block font-sans">
                          {opt.desc}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-lime shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TIME COMMITMENT */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime">Step 4 of 6</Badge>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                  How much time can you commit daily?
                </h1>
                <p className="text-sm text-slate-300">
                  Consistency matters far more than cramming. We will estimate your path timeline according to this commitment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {TIME_OPTIONS.map(opt => {
                  const isSelected = dailyMinutes === opt.minutes;
                  return (
                    <button
                      key={opt.minutes}
                      onClick={() => setDailyMinutes(opt.minutes)}
                      className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-lime/10 border-lime ring-1 ring-lime/40 text-white'
                          : 'bg-charcoal-surface border-charcoal-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-base text-white">
                          {opt.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 font-sans">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: LEARNING STYLE */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime">Step 5 of 6</Badge>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                  What is your preferred learning style?
                </h1>
                <p className="text-sm text-slate-300">
                  Select the formats that keep you most engaged.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {STYLE_OPTIONS.map(opt => {
                  const isSelected = selectedStyles.includes(opt.style);
                  return (
                    <button
                      key={opt.style}
                      onClick={() => toggleStyle(opt.style)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-lime/10 border-lime ring-1 ring-lime/40 text-white'
                          : 'bg-charcoal-surface border-charcoal-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div>
                        <span className="font-heading font-bold text-sm text-white block mb-1">
                          {opt.style}
                        </span>
                        <span className="text-xs text-slate-400 block font-sans">
                          {opt.desc}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-lime shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: INTENDED OUTCOMES */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="lime">Step 6 of 6</Badge>
                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                  What is your primary intended outcome?
                </h1>
                <p className="text-sm text-slate-300">
                  We use your outcome to prioritize portfolio building, technical interviews, or workplace productivity modules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {OUTCOME_OPTIONS.map(outcome => {
                  const isSelected = selectedOutcomes.includes(outcome);
                  return (
                    <button
                      key={outcome}
                      onClick={() => toggleOutcome(outcome)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-lime/10 border-lime ring-1 ring-lime/40 text-white'
                          : 'bg-charcoal-surface border-charcoal-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="font-heading font-medium text-xs sm:text-sm text-white">
                        {outcome}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-8 border-t border-charcoal-border mt-8 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="ghost"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep(prev => prev - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => setStep(prev => prev + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              iconPosition="right"
              onClick={handleFinishOnboarding}
            >
              Generate My Learning Path
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};
