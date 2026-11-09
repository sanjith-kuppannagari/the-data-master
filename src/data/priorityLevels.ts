import { PriorityLevel, PriorityLevelDefinition } from '../types/curriculum';

export const PRIORITY_LEVELS: Record<PriorityLevel, PriorityLevelDefinition> = {
  'Level 1': {
    level: 'Level 1',
    name: 'Core Foundations',
    tagline: 'The Essential Baseline',
    description: 'Foundational technical & numerical abilities every modern data practitioner requires before tackling business workflows.',
    badgeColor: 'border-lime/40 text-lime bg-lime/10',
    recommendedAudience: 'Beginners, career switchers, and anyone building a rigorous baseline.',
  },
  'Level 2': {
    level: 'Level 2',
    name: 'Analytical Proficiency',
    tagline: 'Translating Data to Decisions',
    description: 'Developing business intuition, executive storytelling, visualization mastery, and reproducible project workflows.',
    badgeColor: 'border-cyan/40 text-cyan bg-cyan/10',
    recommendedAudience: 'Practitioners transitioning from technical syntax to commercial impact.',
  },
  'Level 3': {
    level: 'Level 3',
    name: 'Professional Differentiation',
    tagline: 'Advanced Craft & Specialization',
    description: 'Mastery in specialized methods: cohort retention dynamics, rigorous A/B testing, data governance, and deep domain vertical acumen.',
    badgeColor: 'border-orange/40 text-orange bg-orange/10',
    recommendedAudience: 'Analysts aiming for senior roles, high autonomy, or specialized vertical impact.',
  },
  'Level 4': {
    level: 'Level 4',
    name: 'Advanced / Optional',
    tagline: 'Engineering, ML & Frontier AI',
    description: 'Expanding into scalable data pipelines, predictive modeling, machine learning, and generative AI copilot workflows.',
    badgeColor: 'border-purple-400/40 text-purple-300 bg-purple-500/10',
    recommendedAudience: 'Ambitious analysts exploring full-stack data science and AI-augmented analytics.',
  },
  'Level 5': {
    level: 'Level 5',
    name: 'Career Preparation',
    tagline: 'Market Readiness & Placement',
    description: 'End-to-end professional readiness: ATS optimization, public portfolios, technical interview simulations, and executive defense.',
    badgeColor: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
    recommendedAudience: 'Job seekers, internship candidates, and career switchers preparing for market entry.',
  },
};
