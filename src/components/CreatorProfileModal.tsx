import React from 'react';
import {
  X,
  Github,
  Linkedin,
  Globe,
  Rocket,
  Flame,
  MessageSquare,
  Cpu,
  Layers,
  Award,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Creator, Project, Feedback } from '../types';
import { calculateCreatorStats } from '../utils/storage';
import { ProjectCard } from './ProjectCard';

interface CreatorProfileModalProps {
  creator: Creator;
  allProjects: Project[];
  allFeedback: Feedback[];
  userLikes: string[];
  onClose: () => void;
  onOpenProject: (projectId: string) => void;
  onToggleLike: (projectId: string) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  allProjects,
  allFeedback,
  userLikes,
  onClose,
  onOpenProject,
  onToggleLike,
}) => {
  const { publishedProjects, totalLikes, totalFeedbackReceived, achievements } =
    calculateCreatorStats(creator.id, allProjects, allFeedback, creator.skills);

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'first_launch':
        return <Rocket className="w-4 h-4 text-violet-400" />;
      case 'community_favorite':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'feedback_champion':
        return <MessageSquare className="w-4 h-4 text-amber-400" />;
      case 'polyglot':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      default:
        return <Award className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-profile-title"
    >
      <div
        className="relative w-full max-w-4xl bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#141418]/95 backdrop-blur-md border-b border-zinc-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Showcase</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close creator profile"
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Creator Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
            <div className="flex items-center gap-4">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-zinc-700 shadow-xl"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 id="creator-profile-title" className="text-2xl font-bold font-heading text-white">
                    {creator.name}
                  </h1>
                  <span className="text-xs text-zinc-400">{creator.handle}</span>
                </div>
                <p className="text-xs font-medium text-violet-400">
                  {creator.role} {creator.university ? `· ${creator.university}` : ''}
                </p>
                <p className="text-xs text-zinc-400 max-w-lg leading-relaxed pt-1">
                  {creator.bio}
                </p>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {creator.githubUrl && (
                <a
                  href={creator.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {creator.linkedinUrl && (
                <a
                  href={creator.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {creator.websiteUrl && (
                <a
                  href={creator.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Personal website"
                  className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#141418] border border-zinc-800/80 text-center">
              <div className="text-2xl font-bold font-heading text-white">{publishedProjects.length}</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Projects Launched</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141418] border border-zinc-800/80 text-center">
              <div className="text-2xl font-bold font-heading text-rose-400">{totalLikes}</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Total Upvotes</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141418] border border-zinc-800/80 text-center">
              <div className="text-2xl font-bold font-heading text-violet-400">{totalFeedbackReceived}</div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Critiques Received</div>
            </div>
          </div>

          {/* Skills & Badges Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Technical Mastery & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {creator.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800/60 border border-zinc-700/60 text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>Achievement Milestones</span>
                <span className="text-[10px] text-zinc-500 lowercase">
                  {achievements.filter((a) => a.unlocked).length}/{achievements.length} unlocked
                </span>
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {achievements.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                      badge.unlocked
                        ? 'bg-[#18181D] border-zinc-700/80 text-zinc-200'
                        : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-600 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getAchievementIcon(badge.badgeType)}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-heading text-white">
                        {badge.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                        {badge.conditionText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Portfolio */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <h3 className="text-lg font-bold font-heading text-white">
              Project Portfolio ({publishedProjects.length})
            </h3>

            {publishedProjects.length === 0 ? (
              <div className="text-center py-10 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
                <p className="text-sm">No projects published yet by this creator.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {publishedProjects.map((p) => {
                  const fbCount = allFeedback.filter((fb) => fb.projectId === p.id).length;
                  return (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      creator={creator}
                      feedbackCount={fbCount}
                      isLiked={userLikes.includes(p.id)}
                      onOpenProject={onOpenProject}
                      onOpenCreator={() => {}}
                      onToggleLike={onToggleLike}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
