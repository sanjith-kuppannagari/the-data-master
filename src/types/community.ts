export type DiscussionCategory =
  | 'SQL & Databases'
  | 'Python & Data Science'
  | 'Spreadsheets & Modeling'
  | 'Statistics & Mathematics'
  | 'Data Visualization & BI'
  | 'Business Analytics'
  | 'Portfolio Reviews'
  | 'Career & Interviews'
  | 'General Discussion';

export interface CommunityReply {
  id: string;
  discussionId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  upvotes: number;
  upvotedByUser?: boolean;
  isAcceptedAnswer?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityDiscussion {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  category: DiscussionCategory;
  domainId?: string;
  content: string;
  tags: string[];
  replies: CommunityReply[];
  upvotes: number;
  upvotedByUser?: boolean;
  views: number;
  isReported?: boolean;
  reportReason?: string;
  isPinned?: boolean;
  isResolved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionFilterOptions {
  category?: DiscussionCategory | 'All';
  searchQuery?: string;
  domainId?: string;
  sortBy?: 'recent' | 'popular' | 'unanswered';
  tag?: string;
}
