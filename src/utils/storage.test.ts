import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortProjects,
  calculateCreatorStats,
  computePlatformStats,
  toggleProjectLike
} from './storage';
import { Project, Creator, Feedback } from '../types';

const mockCreators: Creator[] = [
  {
    id: 'c1',
    name: 'Alice Cooper',
    handle: '@alice',
    role: 'Junior Dev',
    bio: 'Test bio',
    avatarUrl: '',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
  },
  {
    id: 'c2',
    name: 'Bob Martin',
    handle: '@bob',
    role: 'Senior Dev',
    bio: 'Test bio 2',
    avatarUrl: '',
    skills: ['Go', 'Docker'],
  }
];

const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'Alpha Robotics',
    slug: 'alpha-robotics',
    description: 'An autonomous rover project',
    story: 'Story 1',
    problem: 'Problem 1',
    features: ['Auto navigation'],
    category: 'Robotics / IoT',
    technologies: ['C++', 'ROS 2'],
    creatorId: 'c1',
    teamMembers: [],
    thumbnailUrl: '',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
    featured: false,
    status: 'Launched',
    likesCount: 15,
  },
  {
    id: 'p2',
    title: 'Beta AI Assistant',
    slug: 'beta-ai',
    description: 'A deep learning speech tool',
    story: 'Story 2',
    problem: 'Problem 2',
    features: ['Speech synthesis'],
    category: 'AI / ML',
    technologies: ['Python', 'PyTorch'],
    creatorId: 'c2',
    teamMembers: [],
    thumbnailUrl: '',
    createdAt: '2026-10-15T12:00:00Z',
    updatedAt: '2026-10-15T12:00:00Z',
    featured: true,
    status: 'Beta',
    likesCount: 45,
  },
  {
    id: 'p3',
    title: 'Gamma Green Campus',
    slug: 'gamma-green',
    description: 'Campus recycling map',
    story: 'Story 3',
    problem: 'Problem 3',
    features: ['Map routing'],
    category: 'Sustainability',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    creatorId: 'c1',
    teamMembers: [],
    thumbnailUrl: '',
    createdAt: '2026-10-10T09:00:00Z',
    updatedAt: '2026-10-10T09:00:00Z',
    featured: false,
    status: 'Launched',
    likesCount: 30,
  }
];

const mockFeedback: Feedback[] = [
  {
    id: 'f1',
    projectId: 'p1',
    authorName: 'Reviewer 1',
    authorRole: 'Mentor',
    category: 'Suggestion',
    message: 'Great rover!',
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'f2',
    projectId: 'p1',
    authorName: 'Reviewer 2',
    authorRole: 'Peer',
    category: 'Question',
    message: 'What battery did you use?',
    createdAt: '2026-10-03T10:00:00Z'
  },
  {
    id: 'f3',
    projectId: 'p1',
    authorName: 'Reviewer 3',
    authorRole: 'Peer',
    category: 'Appreciation',
    message: 'Super clean codebase',
    createdAt: '2026-10-04T10:00:00Z'
  },
  {
    id: 'f4',
    projectId: 'p2',
    authorName: 'Reviewer 4',
    authorRole: 'Student',
    category: 'Question',
    message: 'Does it run offline?',
    createdAt: '2026-10-16T10:00:00Z'
  }
];

test('filterAndSortProjects filters by category correctly', () => {
  const result = filterAndSortProjects(mockProjects, '', 'AI / ML', 'recent', mockCreators, mockFeedback);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'p2');
});

test('filterAndSortProjects filters by search query on title, tech and creator', () => {
  // search by technology
  const techSearch = filterAndSortProjects(mockProjects, 'pytorch', 'All', 'recent', mockCreators, mockFeedback);
  assert.equal(techSearch.length, 1);
  assert.equal(techSearch[0].id, 'p2');

  // search by creator name
  const creatorSearch = filterAndSortProjects(mockProjects, 'alice', 'All', 'recent', mockCreators, mockFeedback);
  assert.equal(creatorSearch.length, 2);

  // search by description keyword
  const descSearch = filterAndSortProjects(mockProjects, 'rover', 'All', 'recent', mockCreators, mockFeedback);
  assert.equal(descSearch.length, 1);
  assert.equal(descSearch[0].id, 'p1');
});

test('filterAndSortProjects sorts correctly by popularity, recency, and discussed', () => {
  // popular: p2 (45) -> p3 (30) -> p1 (15)
  const popular = filterAndSortProjects(mockProjects, '', 'All', 'popular', mockCreators, mockFeedback);
  assert.deepEqual(popular.map((p) => p.id), ['p2', 'p3', 'p1']);

  // recent: p2 (Oct 15) -> p3 (Oct 10) -> p1 (Oct 1)
  const recent = filterAndSortProjects(mockProjects, '', 'All', 'recent', mockCreators, mockFeedback);
  assert.deepEqual(recent.map((p) => p.id), ['p2', 'p3', 'p1']);

  // discussed: p1 (3 comments) -> p2 (1 comment) -> p3 (0 comments)
  const discussed = filterAndSortProjects(mockProjects, '', 'All', 'discussed', mockCreators, mockFeedback);
  assert.deepEqual(discussed.map((p) => p.id), ['p1', 'p2', 'p3']);
});

test('toggleProjectLike toggles like and updates count accurately', () => {
  // Initially not liked
  const round1 = toggleProjectLike('p1', mockProjects, []);
  assert.equal(round1.isLiked, true);
  assert.equal(round1.newCount, 16);
  assert.deepEqual(round1.updatedLikes, ['p1']);

  // Toggling off
  const round2 = toggleProjectLike('p1', round1.updatedProjects, round1.updatedLikes);
  assert.equal(round2.isLiked, false);
  assert.equal(round2.newCount, 15);
  assert.deepEqual(round2.updatedLikes, []);
});

test('calculateCreatorStats calculates stats and unlocks achievements correctly', () => {
  const statsC1 = calculateCreatorStats('c1', mockProjects, mockFeedback, mockCreators[0].skills);
  assert.equal(statsC1.publishedProjects.length, 2);
  assert.equal(statsC1.totalLikes, 45); // 15 + 30
  assert.equal(statsC1.totalFeedbackReceived, 3); // 3 on p1

  const firstLaunch = statsC1.achievements.find(a => a.badgeType === 'first_launch');
  const communityFav = statsC1.achievements.find(a => a.badgeType === 'community_favorite');
  const feedbackChamp = statsC1.achievements.find(a => a.badgeType === 'feedback_champion');
  const polyglot = statsC1.achievements.find(a => a.badgeType === 'polyglot');

  assert.equal(firstLaunch?.unlocked, true);
  assert.equal(communityFav?.unlocked, true); // 45 >= 30
  assert.equal(feedbackChamp?.unlocked, true); // 3 >= 3
  assert.equal(polyglot?.unlocked, true); // 4 skills >= 4
});

test('computePlatformStats totals correctly', () => {
  const platformStats = computePlatformStats(mockProjects, mockCreators, mockFeedback);
  assert.equal(platformStats.totalProjects, 3);
  assert.equal(platformStats.totalCreators, 2);
  assert.equal(platformStats.totalFeedback, 4);
  assert.equal(platformStats.totalLikes, 90);
});
