import React from 'react';
import { Heart, MessageSquare, Sparkles, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Project, Creator } from '../types';

interface ProjectCardProps {
  project: Project;
  creator?: Creator;
  feedbackCount: number;
  isLiked: boolean;
  onOpenProject: (projectId: string) => void;
  onOpenCreator: (creatorId: string) => void;
  onToggleLike: (projectId: string) => void;
  onCategoryClick?: (category: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  creator,
  feedbackCount,
  isLiked,
  onOpenProject,
  onOpenCreator,
  onToggleLike,
  onCategoryClick,
}) => {
  // Format launch date relative
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      onClick={() => onOpenProject(project.id)}
      className="group relative flex flex-col justify-between rounded-xl bg-[#141418] border border-zinc-800/80 hover:border-zinc-700 hover:shadow-xl hover:shadow-violet-950/10 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top Media Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-60" />

        {/* Featured Badge */}
        {project.featured && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 backdrop-blur-md text-black">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        )}

        {/* Status tag */}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
          {project.status}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Metadata line: Unboxed quiet typography per design rules */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onCategoryClick) onCategoryClick(project.category);
              }}
              className="hover:text-violet-400 transition-colors focus:outline-none"
            >
              {project.category}
            </button>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-500">{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg text-[#F5F2EF] group-hover:text-violet-300 transition-colors line-clamp-1 flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 text-zinc-500">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Card Footer: Creator info and Reaction Controls */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          {/* Creator Profile Link */}
          {creator ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCreator(creator.id);
              }}
              className="flex items-center gap-2 group/creator text-left focus:outline-none"
              aria-label={`View ${creator.name}'s profile`}
            >
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-6 h-6 rounded-full object-cover border border-zinc-700"
              />
              <span className="text-xs font-medium text-zinc-300 group-hover/creator:text-white group-hover/creator:underline truncate max-w-[120px]">
                {creator.name}
              </span>
            </button>
          ) : (
            <span className="text-xs text-zinc-500">Student Team</span>
          )}

          {/* Action stats */}
          <div className="flex items-center gap-2">
            {/* Feedback Count */}
            <div 
              className="flex items-center gap-1 text-xs text-zinc-400"
              title={`${feedbackCount} feedback comments`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span>{feedbackCount}</span>
            </div>

            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(project.id);
              }}
              aria-label={`${isLiked ? 'Unlike' : 'Like'} ${project.title}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                isLiked
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{project.likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
