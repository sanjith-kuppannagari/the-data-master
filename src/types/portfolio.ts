export type ProjectType =
  | 'coding'
  | 'spreadsheet'
  | 'business_case'
  | 'bi_dashboard'
  | 'statistical_study';

export type ProjectStatus = 'draft' | 'published';

export interface ProjectVisualization {
  id: string;
  title: string;
  caption?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'scatter' | 'kpi_metric' | 'table';
  imageUrl?: string;
  dataSnapshot?: string; // Markdown table or summary metrics
}

export interface PortfolioProject {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  shortDescription: string;
  domainId: string;
  domainName: string;
  projectType: ProjectType;
  problemStatement: string;
  businessContext: string;
  datasetInfo: {
    name: string;
    source?: string;
    rowCount?: number;
    description?: string;
    linkedPlaygroundDatasetId?: string;
  };
  tools: string[];
  methodology: string;
  analysisAndFindings: string;
  visualizations: ProjectVisualization[];
  conclusionsAndRecommendations: string;
  skillsDemonstrated: string[];
  learningOutcomes: string[];
  linkedChallengeId?: string;
  status: ProjectStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  upvotes?: number;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  domainId: string;
  domainName: string;
  projectType: ProjectType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  summary: string;
  problemStatement: string;
  businessContext: string;
  objectives: string[];
  suggestedWorkflow: string[];
  expectedDeliverables: string[];
  recommendedTools: string[];
  sampleDatasetName: string;
  starterMarkdown: {
    methodology: string;
    analysisAndFindings: string;
    conclusionsAndRecommendations: string;
  };
}

export interface PortfolioVisibilitySettings {
  isPublic: boolean;
  customBio?: string;
  headline?: string;
  highlightProjectIds: string[];
  showContactEmail: boolean;
  showAchievements: boolean;
  allowComments: boolean;
}
