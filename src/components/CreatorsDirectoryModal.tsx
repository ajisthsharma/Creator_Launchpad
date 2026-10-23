import React, { useState } from 'react';
import { X, Search, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Creator, Project, Feedback } from '../types';

interface CreatorsDirectoryModalProps {
  creators: Creator[];
  projects: Project[];
  feedbackList: Feedback[];
  onClose: () => void;
  onOpenCreator: (creatorId: string) => void;
}

export const CreatorsDirectoryModal: React.FC<CreatorsDirectoryModalProps> = ({
  creators,
  projects,
  feedbackList,
  onClose,
  onOpenCreator,
}) => {
  const [search, setSearch] = useState('');

  const filteredCreators = creators.filter((c) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const matchName = c.name.toLowerCase().includes(query);
    const matchRole = c.role.toLowerCase().includes(query);
    const matchUniv = c.university?.toLowerCase().includes(query);
    const matchSkill = c.skills.some((s) => s.toLowerCase().includes(query));
    return matchName || matchRole || matchUniv || matchSkill;
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creators-directory-title"
    >
      <div
        className="relative w-full max-w-4xl bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#141418]/95 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 id="creators-directory-title" className="text-base font-bold font-heading text-white">
                Student Innovators & Creators Directory
              </h2>
              <p className="text-xs text-zinc-400">Meet the engineers, designers, and researchers building tomorrow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close creators directory"
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-zinc-800/80 bg-[#121216]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creators by name, university, or tech stack (e.g. PyTorch, WebGL, ROS)..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Creators Grid */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCreators.map((creator) => {
              const creatorProjects = projects.filter((p) => p.creatorId === creator.id);
              const totalLikes = creatorProjects.reduce((acc, p) => acc + p.likesCount, 0);

              return (
                <div
                  key={creator.id}
                  onClick={() => onOpenCreator(creator.id)}
                  className="group p-4 rounded-xl bg-[#141418] border border-zinc-800 hover:border-zinc-700 hover:bg-[#18181D] transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-bold text-sm text-white group-hover:text-violet-300 transition-colors truncate">
                          {creator.name}
                        </h3>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </div>
                      <div className="text-[11px] text-violet-400 font-medium truncate">
                        {creator.university || creator.role}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                        {creator.bio}
                      </p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {creator.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                    {creator.skills.length > 4 && (
                      <span className="text-[10px] font-mono px-1 py-0.5 text-zinc-500">
                        +{creator.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Footer stats */}
                  <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span>
                      <strong className="text-white">{creatorProjects.length}</strong>{' '}
                      {creatorProjects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                    <span>
                      <strong className="text-rose-400">{totalLikes}</strong> Upvotes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCreators.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
              <p className="text-sm">No creators found matching &ldquo;{search}&rdquo;.</p>
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-violet-400 hover:underline"
              >
                Clear search query
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
