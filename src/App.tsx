import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadProjects,
  loadCreators,
  loadFeedback,
  loadUserLikedProjects,
  toggleProjectLike,
  submitFeedback,
  submitNewProject,
  resetDemoData,
  filterAndSortProjects,
  computePlatformStats,
} from './utils/storage';
import {
  Project,
  Creator,
  Feedback,
  CategoryType,
  SortOption,
  FeedbackCategory,
} from './types';
import { CURRENT_DEMO_USER, INITIAL_PROJECTS, INITIAL_CREATORS, INITIAL_FEEDBACK } from './data/seedData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectFilters } from './components/ProjectFilters';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { LaunchProjectModal } from './components/LaunchProjectModal';
import { CreatorsDirectoryModal } from './components/CreatorsDirectoryModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { Sparkles, Layers, Search, RefreshCw, Plus } from 'lucide-react';

export default function App() {
  // Primary application state
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [creators, setCreators] = useState<Creator[]>(() => loadCreators());
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(() => loadFeedback());
  const [userLikes, setUserLikes] = useState<string[]>(() => loadUserLikedProjects());

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // Modal views
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeCreatorId, setActiveCreatorId] = useState<string | null>(null);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isCreatorsModalOpen, setIsCreatorsModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle ESC key to dismiss any open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeProjectId) {
          setActiveProjectId(null);
        } else if (activeCreatorId) {
          setActiveCreatorId(null);
        } else if (isLaunchModalOpen) {
          setIsLaunchModalOpen(false);
        } else if (isCreatorsModalOpen) {
          setIsCreatorsModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectId, activeCreatorId, isLaunchModalOpen, isCreatorsModalOpen]);

  // Derived filtered projects list
  const filteredProjects = useMemo(() => {
    return filterAndSortProjects(
      projects,
      searchQuery,
      selectedCategory,
      sortOption,
      creators,
      feedbackList
    );
  }, [projects, searchQuery, selectedCategory, sortOption, creators, feedbackList]);

  // Derived overall platform statistics
  const platformStats = useMemo(() => {
    return computePlatformStats(projects, creators, feedbackList);
  }, [projects, creators, feedbackList]);

  // Featured project for Hero spotlight
  const featuredProject = useMemo(() => {
    return projects.find((p) => p.featured) || projects[0];
  }, [projects]);

  const featuredCreator = useMemo(() => {
    if (!featuredProject) return undefined;
    return creators.find((c) => c.id === featuredProject.creatorId);
  }, [featuredProject, creators]);

  // Currently active project & creator for modals
  const currentActiveProject = useMemo(() => {
    if (!activeProjectId) return null;
    return projects.find((p) => p.id === activeProjectId) || null;
  }, [activeProjectId, projects]);

  const currentActiveCreator = useMemo(() => {
    if (!activeCreatorId) return null;
    return creators.find((c) => c.id === activeCreatorId) || null;
  }, [activeCreatorId, creators]);

  // Handlers
  const handleToggleLike = useCallback((projectId: string) => {
    const result = toggleProjectLike(projectId, projects, userLikes);
    setProjects(result.updatedProjects);
    setUserLikes(result.updatedLikes);

    const project = projects.find((p) => p.id === projectId);
    const title = project ? project.title : 'Project';

    if (result.isLiked) {
      addToast(`Supported "${title}"!`, 'success');
    } else {
      addToast(`Support removed for "${title}".`, 'info');
    }
  }, [projects, userLikes, addToast]);

  const handleFeedbackSubmit = useCallback((
    projectId: string,
    authorName: string,
    authorRole: string,
    category: FeedbackCategory,
    message: string
  ) => {
    const result = submitFeedback(
      projectId,
      authorName,
      authorRole,
      category,
      message,
      feedbackList
    );
    setFeedbackList(result.updatedFeedback);
    addToast('Feedback submitted to project discussion!', 'success');
  }, [feedbackList, addToast]);

  const handleLaunchProject = useCallback((payload: {
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
    status: 'Launched' | 'Beta' | 'Prototype';
  }) => {
    const result = submitNewProject(payload, projects, creators);
    setProjects(result.updatedProjects);
    setCreators(result.updatedCreators);
    setIsLaunchModalOpen(false);

    // Automatically navigate to the new project modal
    setActiveProjectId(result.newProject.id);
    addToast(`🚀 "${result.newProject.title}" has been launched!`, 'success');
  }, [projects, creators, addToast]);

  const handleResetData = useCallback(() => {
    resetDemoData();
    setProjects(INITIAL_PROJECTS);
    setCreators(INITIAL_CREATORS);
    setFeedbackList(INITIAL_FEEDBACK);
    setUserLikes(['project-devboard']);
    setSearchQuery('');
    setSelectedCategory('All');
    setSortOption('popular');
    addToast('Demo database restored to fresh seed state.', 'info');
  }, [addToast]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortOption('popular');
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F5F2EF] flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentUser={CURRENT_DEMO_USER}
        onOpenLaunch={() => setIsLaunchModalOpen(true)}
        onOpenCreators={() => setIsCreatorsModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat as CategoryType);
        }}
        onResetData={handleResetData}
        onHomeClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          handleResetFilters();
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with platform statistics and featured showcase */}
        <Hero
          featuredProject={featuredProject}
          featuredCreator={featuredCreator}
          totalProjects={platformStats.totalProjects}
          totalCreators={platformStats.totalCreators}
          totalFeedback={platformStats.totalFeedback}
          totalLikes={platformStats.totalLikes}
          onExploreClick={() => {
            const filterSection = document.getElementById('project-filters-section');
            if (filterSection) {
              filterSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onLaunchClick={() => setIsLaunchModalOpen(true)}
          onOpenProject={(id) => setActiveProjectId(id)}
          onLikeProject={handleToggleLike}
          isLiked={featuredProject ? userLikes.includes(featuredProject.id) : false}
        />

        {/* Discovery & Project Showcase Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Filters Bar */}
          <ProjectFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            totalFiltered={filteredProjects.length}
            onResetFilters={handleResetFilters}
          />

          {/* Project Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredProjects.map((project) => {
                const creator = creators.find((c) => c.id === project.creatorId);
                const fbCount = feedbackList.filter((fb) => fb.projectId === project.id).length;
                const isLiked = userLikes.includes(project.id);

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    creator={creator}
                    feedbackCount={fbCount}
                    isLiked={isLiked}
                    onOpenProject={(id) => setActiveProjectId(id)}
                    onOpenCreator={(cid) => setActiveCreatorId(cid)}
                    onToggleLike={handleToggleLike}
                    onCategoryClick={(cat) => setSelectedCategory(cat as CategoryType)}
                  />
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 px-4 text-center rounded-2xl bg-[#111114] border border-zinc-800/80 my-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 text-zinc-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-white">
                  No matching student projects found
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                  We couldn&rsquo;t find anything matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another search term or reset filters.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                >
                  Reset all filters
                </button>
                <button
                  onClick={() => setIsLaunchModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Launch this project instead</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {/* 1. Project Detail Modal */}
      {currentActiveProject && (
        <ProjectDetailModal
          project={currentActiveProject}
          creator={creators.find((c) => c.id === currentActiveProject.creatorId)}
          feedbackList={feedbackList}
          isLiked={userLikes.includes(currentActiveProject.id)}
          onClose={() => setActiveProjectId(null)}
          onOpenCreator={(cid) => {
            setActiveProjectId(null);
            setActiveCreatorId(cid);
          }}
          onToggleLike={handleToggleLike}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}

      {/* 2. Creator Profile Modal */}
      {currentActiveCreator && (
        <CreatorProfileModal
          creator={currentActiveCreator}
          allProjects={projects}
          allFeedback={feedbackList}
          userLikes={userLikes}
          onClose={() => setActiveCreatorId(null)}
          onOpenProject={(pid) => {
            setActiveCreatorId(null);
            setActiveProjectId(pid);
          }}
          onToggleLike={handleToggleLike}
        />
      )}

      {/* 3. Launch Project Modal */}
      {isLaunchModalOpen && (
        <LaunchProjectModal
          currentUser={CURRENT_DEMO_USER}
          onClose={() => setIsLaunchModalOpen(false)}
          onSubmit={handleLaunchProject}
        />
      )}

      {/* 4. Creators Directory Modal */}
      {isCreatorsModalOpen && (
        <CreatorsDirectoryModal
          creators={creators}
          projects={projects}
          feedbackList={feedbackList}
          onClose={() => setIsCreatorsModalOpen(false)}
          onOpenCreator={(cid) => {
            setIsCreatorsModalOpen(false);
            setActiveCreatorId(cid);
          }}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onResetData={handleResetData}
        onOpenLaunch={() => setIsLaunchModalOpen(true)}
      />
    </div>
  );
}
