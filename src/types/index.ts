export type CategoryType = 
  | 'All'
  | 'AI / ML'
  | 'Web Development'
  | 'Mobile Apps'
  | 'Robotics / IoT'
  | 'Sustainability'
  | 'Open Source'
  | 'Other';

export type FeedbackCategory = 'Suggestion' | 'Question' | 'Appreciation' | 'Bug Report';

export type SortOption = 'popular' | 'recent' | 'discussed';

export interface TeamMember {
  name: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  story: string;
  problem: string;
  features: string[];
  challenges?: string;
  category: Exclude<CategoryType, 'All'>;
  technologies: string[];
  creatorId: string;
  teamMembers: TeamMember[];
  thumbnailUrl: string;
  demoUrl?: string;
  repositoryUrl?: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  status: 'Launched' | 'Beta' | 'Prototype';
  likesCount: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  role: string;
  university?: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export interface Feedback {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: string;
  category: FeedbackCategory;
  message: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badgeType: 'first_launch' | 'community_favorite' | 'feedback_champion' | 'polyglot';
  conditionText: string;
}

export interface ActiveUser {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarUrl: string;
}
