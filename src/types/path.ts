import { Domain, Topic, PriorityLevel } from './curriculum';
import { ExperienceLevel } from './user';

export type TopicImportance = 'essential' | 'recommended' | 'optional';

export interface PathTopicItem {
  topic: Topic;
  domain: Domain;
  importance: TopicImportance;
  estimatedMinutes: number;
  prerequisitesMet: boolean;
  missingPrerequisites: string[];
  order: number;
  isCompleted: boolean;
}

export interface Milestone {
  id: string;
  number: number;
  title: string;
  description: string;
  targetFocus: string;
  items: PathTopicItem[];
  estimatedHours: number;
  isUnlocked: boolean;
  progressPercent: number;
}

export interface GeneratedLearningPath {
  userId: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  dailyCommitmentMinutes: number;
  totalEstimatedMinutes: number;
  totalEstimatedDays: number;
  milestones: Milestone[];
  essentialDomainIds: string[];
  recommendedDomainIds: string[];
  allTopicsCount: number;
  completedTopicsCount: number;
  progressPercent: number;
  generatedAt: string;
}
