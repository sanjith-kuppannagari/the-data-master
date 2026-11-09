export type DomainClassification =
  | 'CORE SKILL'
  | 'MAJOR DIFFERENTIATOR'
  | 'PROFESSIONAL SKILL'
  | 'CAREER DIFFERENTIATOR / PRACTICAL SKILL'
  | 'ADDITIONAL TECHNICAL KNOWLEDGE'
  | 'ADVANCED / OPTIONAL FOR ENTRY-LEVEL ANALYSTS'
  | 'EMERGING PROFESSIONAL SKILL'
  | 'PROFESSIONAL KNOWLEDGE'
  | 'CAREER PREPARATION'
  | 'SPECIALIZATION / CAREER DEVELOPMENT';

export type PriorityLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4' | 'Level 5';

export interface PriorityLevelDefinition {
  level: PriorityLevel;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  recommendedAudience: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  xpReward: number;
  prerequisites?: string[];
}

export interface Domain {
  id: string;
  slug: string;
  number: number;
  name: string;
  classification: DomainClassification;
  defaultPriority: PriorityLevel;
  tagline: string;
  description: string;
  learningObjectives: string[];
  tools: string[];
  prerequisites: string[];
  topics: Topic[];
  icon: string;
  accent: 'lime' | 'cyan' | 'orange' | 'ivory';
  recommendedProjects: string[];
}
