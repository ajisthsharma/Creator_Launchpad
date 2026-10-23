import React from 'react';
import { ArrowRight, Flame, Heart, MessageSquare, Rocket, Sparkles, ExternalLink } from 'lucide-react';
import { Project, Creator } from '../types';

interface HeroProps {
  featuredProject?: Project;
  featuredCreator?: Creator;
  totalProjects: number;
  totalCreators: number;
  totalFeedback: number;
  totalLikes: number;
  onExploreClick: () => void;
  onLaunchClick: () => void;
  onOpenProject: (projectId: string) => void;
  onLikeProject: (projectId: string) => void;
  isLiked: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  featuredProject,
  featuredCreator,
  totalProjects,
  totalCreators,
  totalFeedback,
  totalLikes,
  onExploreClick,
  onLaunchClick,
  onOpenProject,
  onLikeProject,
  isLiked,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-zinc-800/60 bg-radial from-zinc-900/50 via-[#09090B] to-[#09090B]">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -z-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Vision & Headline */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Top editorial kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span>Fall 2026 Student Innovation Showcase</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-500">Open Community</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F2EF] tracking-tight leading-[1.08]">
              Your ideas deserve a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-rose-400">
                launchpad.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed">
              Discover bold student projects, meet the creators behind them, and help great ideas take flight through constructive community feedback.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-900/25 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onLaunchClick}
                className="bg-[#18181D] hover:bg-zinc-800 text-[#F5F2EF] hover:text-white border border-zinc-700/80 font-medium px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <Rocket className="w-4 h-4 text-violet-400" />
                <span>Launch Your Project</span>
              </button>
            </div>

            {/* Real Platform Statistics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-zinc-800/80 w-full">
              <div>
                <div className="text-2xl font-bold font-heading text-[#F5F2EF]">{totalProjects}</div>
                <div className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Projects Launched</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-heading text-[#F5F2EF]">{totalCreators}</div>
                <div className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Student Creators</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-heading text-[#F5F2EF]">{totalFeedback}</div>
                <div className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Critiques & Feedback</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-heading text-[#F5F2EF]">{totalLikes}</div>
                <div className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Community Upvotes</div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Spotlight Card */}
          {featuredProject && (
            <div className="lg:col-span-5 w-full">
              <div className="relative group rounded-2xl bg-[#141418] border border-zinc-800/90 shadow-2xl p-5 hover:border-violet-500/50 transition-all duration-300">
                {/* Featured kicker tag */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured of the Week</span>
                  </div>
                  <span className="text-xs text-zinc-400">{featuredProject.category}</span>
                </div>

                {/* Hero Thumbnail */}
                <div 
                  className="relative aspect-[16/9] w-full rounded-xl overflow-hidden cursor-pointer bg-zinc-900 mb-4"
                  onClick={() => onOpenProject(featuredProject.id)}
                >
                  <img
                    src={featuredProject.thumbnailUrl}
                    alt={featuredProject.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image if remote URL fails
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-80" />
                  
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 text-xs font-medium rounded bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10">
                    {featuredProject.status}
                  </span>
                </div>

                {/* Information */}
                <div className="space-y-3">
                  <h3 
                    onClick={() => onOpenProject(featuredProject.id)}
                    className="text-xl font-bold text-[#F5F2EF] group-hover:text-violet-300 cursor-pointer transition-colors"
                  >
                    {featuredProject.title}
                  </h3>

                  <p className="text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {featuredProject.description}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredProject.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer with Creator and Like Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/70">
                    <div className="flex items-center gap-2.5">
                      {featuredCreator && (
                        <>
                          <img
                            src={featuredCreator.avatarUrl}
                            alt={featuredCreator.name}
                            className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                          />
                          <div className="text-xs">
                            <span className="font-medium text-[#F5F2EF]">{featuredCreator.name}</span>
                            <span className="text-zinc-500 block">{featuredCreator.university || 'Creator'}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeProject(featuredProject.id);
                        }}
                        aria-label={`Like ${featuredProject.title}`}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isLiked
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span>{featuredProject.likesCount}</span>
                      </button>

                      <button
                        onClick={() => onOpenProject(featuredProject.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
