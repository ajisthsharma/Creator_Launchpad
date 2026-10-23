import {
  Project,
  Creator,
  Feedback,
  CategoryType,
  SortOption,
  Achievement,
  FeedbackCategory
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_CREATORS,
  INITIAL_FEEDBACK,
  CURRENT_DEMO_USER
} from '../data/seedData';

const STORAGE_KEYS = {
  PROJECTS: 'creator_launchpad_projects_v1',
  CREATORS: 'creator_launchpad_creators_v1',
  FEEDBACK: 'creator_launchpad_feedback_v1',
  LIKED_PROJECTS: 'creator_launchpad_user_likes_v1',
};

// Safe JSON parse with fallback
function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return fallback;
  }
}

function safeSave<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing to localStorage key "${key}":`, e);
  }
}

// Data accessors
export function loadProjects(): Project[] {
  const stored = safeParse<Project[]>(STORAGE_KEYS.PROJECTS, []);
  if (!stored || stored.length === 0) {
    safeSave(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }
  return stored;
}

export function loadCreators(): Creator[] {
  const stored = safeParse<Creator[]>(STORAGE_KEYS.CREATORS, []);
  if (!stored || stored.length === 0) {
    safeSave(STORAGE_KEYS.CREATORS, INITIAL_CREATORS);
    return INITIAL_CREATORS;
  }
  return stored;
}

export function loadFeedback(): Feedback[] {
  const stored = safeParse<Feedback[]>(STORAGE_KEYS.FEEDBACK, []);
  if (!stored || stored.length === 0) {
    safeSave(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    return INITIAL_FEEDBACK;
  }
  return stored;
}

export function loadUserLikedProjects(): string[] {
  return safeParse<string[]>(STORAGE_KEYS.LIKED_PROJECTS, ['project-devboard']);
}

// Mutations
export function toggleProjectLike(
  projectId: string,
  currentProjects: Project[],
  currentLikes: string[]
): { updatedProjects: Project[]; updatedLikes: string[]; isLiked: boolean; newCount: number } {
  const hasLiked = currentLikes.includes(projectId);
  const updatedLikes = hasLiked
    ? currentLikes.filter((id) => id !== projectId)
    : [...currentLikes, projectId];

  const delta = hasLiked ? -1 : 1;
  let newCount = 0;

  const updatedProjects = currentProjects.map((p) => {
    if (p.id === projectId) {
      newCount = Math.max(0, p.likesCount + delta);
      return { ...p, likesCount: newCount };
    }
    return p;
  });

  safeSave(STORAGE_KEYS.PROJECTS, updatedProjects);
  safeSave(STORAGE_KEYS.LIKED_PROJECTS, updatedLikes);

  return {
    updatedProjects,
    updatedLikes,
    isLiked: !hasLiked,
    newCount,
  };
}

export function submitFeedback(
  projectId: string,
  authorName: string,
  authorRole: string,
  category: FeedbackCategory,
  message: string,
  currentFeedback: Feedback[]
): { updatedFeedback: Feedback[]; newEntry: Feedback } {
  const newEntry: Feedback = {
    id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    projectId,
    authorName: authorName.trim() || CURRENT_DEMO_USER.name,
    authorRole: authorRole.trim() || CURRENT_DEMO_USER.role,
    category,
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  const updatedFeedback = [newEntry, ...currentFeedback];
  safeSave(STORAGE_KEYS.FEEDBACK, updatedFeedback);

  return { updatedFeedback, newEntry };
}

export function submitNewProject(
  payload: {
    title: string;
    description: string;
    story: string;
    problem: string;
    features: string[];
    challenges?: string;
    category: Exclude<CategoryType, 'All'>;
    technologies: string[];
    creatorName: string;
    teamMembers?: { name: string; role: string }[];
    thumbnailUrl?: string;
    demoUrl?: string;
    repositoryUrl?: string;
    status?: 'Launched' | 'Beta' | 'Prototype';
  },
  currentProjects: Project[],
  currentCreators: Creator[]
): { updatedProjects: Project[]; updatedCreators: Creator[]; newProject: Project } {
  const slug = payload.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const id = `project-${slug}-${Date.now().toString(36)}`;

  // Find or create creator
  let creator = currentCreators.find(
    (c) => c.name.toLowerCase() === payload.creatorName.toLowerCase()
  );

  let updatedCreators = [...currentCreators];

  if (!creator) {
    const creatorHandle = `@${payload.creatorName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    creator = {
      id: `creator-${Date.now().toString(36)}`,
      name: payload.creatorName.trim(),
      handle: creatorHandle,
      role: 'Student Creator & Builder',
      university: 'Campus Innovation Lab',
      bio: `Creator of ${payload.title} on Creator Launchpad.`,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      skills: payload.technologies.slice(0, 5),
    };
    updatedCreators = [creator, ...updatedCreators];
    safeSave(STORAGE_KEYS.CREATORS, updatedCreators);
  }

  // Fallback thumbnail if empty or invalid
  const thumbnail =
    payload.thumbnailUrl && payload.thumbnailUrl.trim().length > 0
      ? payload.thumbnailUrl.trim()
      : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';

  const newProject: Project = {
    id,
    title: payload.title.trim(),
    slug,
    description: payload.description.trim(),
    story: payload.story.trim(),
    problem: payload.problem.trim(),
    features: payload.features.filter((f) => f.trim().length > 0),
    challenges: payload.challenges?.trim() || undefined,
    category: payload.category,
    technologies: payload.technologies.filter((t) => t.trim().length > 0),
    creatorId: creator.id,
    teamMembers: payload.teamMembers || [{ name: creator.name, role: 'Lead Creator' }],
    thumbnailUrl: thumbnail,
    demoUrl: payload.demoUrl?.trim() || undefined,
    repositoryUrl: payload.repositoryUrl?.trim() || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    status: payload.status || 'Launched',
    likesCount: 1, // Author start like
  };

  const updatedProjects = [newProject, ...currentProjects];
  safeSave(STORAGE_KEYS.PROJECTS, updatedProjects);

  return { updatedProjects, updatedCreators, newProject };
}

// Reset all demo data to seed defaults
export function resetDemoData(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    window.localStorage.removeItem(STORAGE_KEYS.CREATORS);
    window.localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
    window.localStorage.removeItem(STORAGE_KEYS.LIKED_PROJECTS);
  }
}

// Pure filter and sort calculation
export function filterAndSortProjects(
  projects: Project[],
  searchQuery: string,
  selectedCategory: CategoryType,
  sortOption: SortOption,
  creators: Creator[],
  feedbackList: Feedback[]
): Project[] {
  const query = searchQuery.trim().toLowerCase();

  // Create fast map of creator names
  const creatorMap = new Map<string, string>();
  for (const c of creators) {
    creatorMap.set(c.id, c.name.toLowerCase());
  }

  // Create fast map of feedback count per project
  const feedbackCountMap = new Map<string, number>();
  for (const fb of feedbackList) {
    feedbackCountMap.set(fb.projectId, (feedbackCountMap.get(fb.projectId) || 0) + 1);
  }

  // 1. Filtering
  const filtered = projects.filter((project) => {
    // Category check
    if (selectedCategory !== 'All' && project.category !== selectedCategory) {
      return false;
    }

    // Search query check
    if (query) {
      const creatorName = creatorMap.get(project.creatorId) || '';
      const inTitle = project.title.toLowerCase().includes(query);
      const inDesc = project.description.toLowerCase().includes(query);
      const inCategory = project.category.toLowerCase().includes(query);
      const inCreator = creatorName.includes(query);
      const inTech = project.technologies.some((t) => t.toLowerCase().includes(query));

      if (!inTitle && !inDesc && !inCategory && !inCreator && !inTech) {
        return false;
      }
    }

    return true;
  });

  // 2. Sorting
  return [...filtered].sort((a, b) => {
    if (sortOption === 'popular') {
      return b.likesCount - a.likesCount;
    }
    if (sortOption === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === 'discussed') {
      const countA = feedbackCountMap.get(a.id) || 0;
      const countB = feedbackCountMap.get(b.id) || 0;
      return countB - countA;
    }
    return 0;
  });
}

// Compute creator statistics and achievements
export function calculateCreatorStats(
  creatorId: string,
  projects: Project[],
  feedbackList: Feedback[],
  creatorSkills: string[] = []
): {
  publishedProjects: Project[];
  totalLikes: number;
  totalFeedbackReceived: number;
  achievements: Achievement[];
} {
  const publishedProjects = projects.filter((p) => p.creatorId === creatorId);
  const projectIds = new Set(publishedProjects.map((p) => p.id));

  const totalLikes = publishedProjects.reduce((acc, p) => acc + p.likesCount, 0);
  const totalFeedbackReceived = feedbackList.filter((fb) => projectIds.has(fb.projectId)).length;

  const achievements: Achievement[] = [
    {
      id: 'ach-first-launch',
      title: 'First Launch',
      description: 'Published at least one completed student project.',
      iconName: 'Rocket',
      badgeType: 'first_launch',
      conditionText: '1+ project launched',
      unlocked: publishedProjects.length >= 1,
    },
    {
      id: 'ach-community-fav',
      title: 'Community Favorite',
      description: 'Accumulated 30 or more community appreciations across projects.',
      iconName: 'Flame',
      badgeType: 'community_favorite',
      conditionText: '30+ total likes',
      unlocked: totalLikes >= 30,
    },
    {
      id: 'ach-feedback-champion',
      title: 'Feedback Champion',
      description: 'Received constructive community critiques and suggestions.',
      iconName: 'MessageSquare',
      badgeType: 'feedback_champion',
      conditionText: '3+ critiques received',
      unlocked: totalFeedbackReceived >= 3,
    },
    {
      id: 'ach-tech-polyglot',
      title: 'Tech Polyglot',
      description: 'Demonstrated mastery across 4 or more technologies.',
      iconName: 'Cpu',
      badgeType: 'polyglot',
      conditionText: '4+ core technologies',
      unlocked: creatorSkills.length >= 4,
    },
  ];

  return {
    publishedProjects,
    totalLikes,
    totalFeedbackReceived,
    achievements,
  };
}

// Compute overall platform stats
export function computePlatformStats(
  projects: Project[],
  creators: Creator[],
  feedbackList: Feedback[]
): {
  totalProjects: number;
  totalCreators: number;
  totalFeedback: number;
  totalLikes: number;
} {
  return {
    totalProjects: projects.length,
    totalCreators: creators.length,
    totalFeedback: feedbackList.length,
    totalLikes: projects.reduce((acc, p) => acc + p.likesCount, 0),
  };
}
