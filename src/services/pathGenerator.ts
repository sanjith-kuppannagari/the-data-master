import { CURRICULUM_DOMAINS, getDomainById } from '../data/curriculum';
import { Domain, Topic } from '../types/curriculum';
import { ExperienceLevel, UserProfile } from '../types/user';
import { GeneratedLearningPath, Milestone, PathTopicItem, TopicImportance } from '../types/path';

export interface PathGenerationInput {
  userId: string;
  targetRole: string;
  primaryGoals: string[];
  selectedDomainIds: string[];
  experienceLevel: ExperienceLevel;
  dailyCommitmentMinutes: number;
  completedTopicIds?: string[];
}

/**
 * Returns the domain roles map determining essential vs recommended domains by target role.
 */
export const getRoleArchetypes = (targetRole: string): { essential: string[]; recommended: string[] } => {
  const normalized = targetRole.toLowerCase();

  if (normalized.includes('business analyst')) {
    return {
      essential: ['domain-7', 'domain-1', 'domain-2', 'domain-8'],
      recommended: ['domain-4', 'domain-5', 'domain-15', 'domain-9'],
    };
  }

  if (normalized.includes('bi analyst') || normalized.includes('intelligence')) {
    return {
      essential: ['domain-2', 'domain-1', 'domain-5'],
      recommended: ['domain-6', 'domain-10', 'domain-7', 'domain-9'],
    };
  }

  if (normalized.includes('product analyst')) {
    return {
      essential: ['domain-2', 'domain-4', 'domain-7', 'domain-11'],
      recommended: ['domain-5', 'domain-6', 'domain-15', 'domain-8'],
    };
  }

  if (normalized.includes('engineer') || normalized.includes('data engineering')) {
    return {
      essential: ['domain-2', 'domain-3', 'domain-10'],
      recommended: ['domain-6', 'domain-13', 'domain-1', 'domain-9'],
    };
  }

  // Default: Aspiring Data Analyst
  return {
    essential: ['domain-1', 'domain-2', 'domain-4', 'domain-3', 'domain-6'],
    recommended: ['domain-5', 'domain-7', 'domain-9', 'domain-8'],
  };
};

/**
 * Validates dependencies between topics and domains.
 */
export const evaluateTopicPrerequisites = (
  topic: Topic,
  domain: Domain,
  completedTopicIds: string[],
  activeTopicIdsInPath: string[]
): { prerequisitesMet: boolean; missingPrerequisites: string[] } => {
  const missing: string[] = [];

  // 1. Topic-level intra-domain dependencies
  const topicIdx = domain.topics.findIndex(t => t.id === topic.id);
  if (topicIdx > 0) {
    const priorTopic = domain.topics[topicIdx - 1];
    if (!completedTopicIds.includes(priorTopic.id) && !activeTopicIdsInPath.includes(priorTopic.id)) {
      missing.push(`${domain.name}: ${priorTopic.title}`);
    }
  }

  // 2. Cross-domain dependencies
  if (domain.id === 'domain-11') {
    // Advanced Analytics requires Python (d3-t1) and Statistics (d4-t1)
    if (!completedTopicIds.includes('d3-t1') && !activeTopicIdsInPath.includes('d3-t1')) {
      missing.push('Python Programming: Syntax & Core Data Structures');
    }
    if (!completedTopicIds.includes('d4-t1') && !activeTopicIdsInPath.includes('d4-t1')) {
      missing.push('Mathematics & Statistics: Descriptive Statistics');
    }
  }

  if (domain.id === 'domain-10') {
    // Data Engineering requires SQL (d2-t2)
    if (!completedTopicIds.includes('d2-t2') && !activeTopicIdsInPath.includes('d2-t2')) {
      missing.push('SQL & Database: SQL Query Fundamentals');
    }
  }

  return {
    prerequisitesMet: missing.length === 0,
    missingPrerequisites: missing,
  };
};

/**
 * Generates an individualized, pedagogically sound learning path.
 */
export const generateLearningPath = (input: PathGenerationInput): GeneratedLearningPath => {
  const {
    userId,
    targetRole,
    primaryGoals,
    selectedDomainIds,
    experienceLevel,
    dailyCommitmentMinutes,
    completedTopicIds = [],
  } = input;

  const roleArchetype = getRoleArchetypes(targetRole);

  // Union of selected domains and essential prerequisite domains
  const activeDomainIds = new Set<string>([...selectedDomainIds]);

  // Ensure essential prerequisite domains are included if dependent domains are chosen
  if (activeDomainIds.has('domain-11')) {
    activeDomainIds.add('domain-4'); // Stats
    activeDomainIds.add('domain-3'); // Python
  }
  if (activeDomainIds.has('domain-10') || activeDomainIds.has('domain-5')) {
    activeDomainIds.add('domain-2'); // SQL
  }

  // Convert to full domain models and sort by default priority level (Level 1 first)
  const priorityOrder: Record<string, number> = {
    'Level 1': 1,
    'Level 2': 2,
    'Level 3': 3,
    'Level 4': 4,
    'Level 5': 5,
  };

  const domainsToInclude: Domain[] = Array.from(activeDomainIds)
    .map(id => getDomainById(id))
    .filter((d): d is Domain => d !== undefined)
    .sort((a, b) => {
      const pDiff = (priorityOrder[a.defaultPriority] || 99) - (priorityOrder[b.defaultPriority] || 99);
      if (pDiff !== 0) return pDiff;
      return a.number - b.number;
    });

  // Build ordered topic items
  const allPathItems: PathTopicItem[] = [];
  const scheduledTopicIds: string[] = [];

  let itemOrder = 1;

  domainsToInclude.forEach(domain => {
    const isDomainEssential = roleArchetype.essential.includes(domain.id);
    const isDomainRecommended = roleArchetype.recommended.includes(domain.id);

    domain.topics.forEach(topic => {
      let importance: TopicImportance = 'optional';
      if (isDomainEssential) {
        importance = topic.difficulty === 'advanced' ? 'recommended' : 'essential';
      } else if (isDomainRecommended) {
        importance = 'recommended';
      }

      // Check prerequisites
      const { prerequisitesMet, missingPrerequisites } = evaluateTopicPrerequisites(
        topic,
        domain,
        completedTopicIds,
        scheduledTopicIds
      );

      const isCompleted = completedTopicIds.includes(topic.id);

      allPathItems.push({
        topic,
        domain,
        importance,
        estimatedMinutes: topic.estimatedMinutes,
        prerequisitesMet,
        missingPrerequisites,
        order: itemOrder++,
        isCompleted,
      });

      scheduledTopicIds.push(topic.id);
    });
  });

  // Calculate totals
  const totalMinutes = allPathItems.reduce((acc, item) => acc + item.estimatedMinutes, 0);
  const dailyCommitment = Math.max(15, dailyCommitmentMinutes || 30);
  const totalDays = Math.ceil(totalMinutes / dailyCommitment);

  // Group into 4 structured Milestones
  const totalItems = allPathItems.length;
  const quarter = Math.ceil(totalItems / 4);

  const milestone1Items = allPathItems.slice(0, quarter);
  const milestone2Items = allPathItems.slice(quarter, quarter * 2);
  const milestone3Items = allPathItems.slice(quarter * 2, quarter * 3);
  const milestone4Items = allPathItems.slice(quarter * 3);

  const buildMilestone = (
    number: number,
    id: string,
    title: string,
    description: string,
    targetFocus: string,
    items: PathTopicItem[],
    prevMilestoneProgress: number = 100
  ): Milestone => {
    const totalMinutesInMilestone = items.reduce((acc, i) => acc + i.estimatedMinutes, 0);
    const completedItems = items.filter(i => i.isCompleted).length;
    const progressPercent = items.length
      ? Math.round((completedItems / items.length) * 100)
      : 0;

    return {
      id,
      number,
      title,
      description,
      targetFocus,
      items,
      estimatedHours: Math.round((totalMinutesInMilestone / 60) * 10) / 10,
      isUnlocked: prevMilestoneProgress >= 50 || number === 1,
      progressPercent,
    };
  };

  const m1 = buildMilestone(
    1,
    'milestone-1',
    'Core Foundations & Query Mechanics',
    'Build numerical and analytical fluency in spreadsheets, relational querying, and descriptive statistics.',
    'Spreadsheets, PostgreSQL & Statistical Summaries',
    milestone1Items
  );

  const m2 = buildMilestone(
    2,
    'milestone-2',
    'Exploratory Data Analysis & Business Intelligence',
    'Sanitize messy datasets, engineer features, and design visual KPI storytelling scorecards.',
    'Data Cleaning, Pandas, Tableau/Power BI & Commercial KPIs',
    milestone2Items,
    m1.progressPercent
  );

  const m3 = buildMilestone(
    3,
    'milestone-3',
    'Advanced Analysis, Simulations & Specialized Craft',
    'Tackle multi-dimensional window functions, business root-cause simulations, and hypothesis testing.',
    'Window Functions, Business Simulations & Statistical Tests',
    milestone3Items,
    m2.progressPercent
  );

  const m4 = buildMilestone(
    4,
    'milestone-4',
    'Portfolio Capstone, Placement & Market Readiness',
    'Consolidate end-to-end verified project showcases, technical interview simulations, and executive presentations.',
    'Public Portfolio, GitHub & Technical Interview Readiness',
    milestone4Items,
    m3.progressPercent
  );

  const completedCount = allPathItems.filter(i => i.isCompleted).length;
  const overallProgress = totalItems ? Math.round((completedCount / totalItems) * 100) : 0;

  return {
    userId,
    targetRole,
    experienceLevel,
    dailyCommitmentMinutes: dailyCommitment,
    totalEstimatedMinutes: totalMinutes,
    totalEstimatedDays: totalDays,
    milestones: [m1, m2, m3, m4],
    essentialDomainIds: roleArchetype.essential,
    recommendedDomainIds: roleArchetype.recommended,
    allTopicsCount: totalItems,
    completedTopicsCount: completedCount,
    progressPercent: overallProgress,
    generatedAt: new Date().toISOString(),
  };
};
