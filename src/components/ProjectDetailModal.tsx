import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageSquare,
  ExternalLink,
  Github,
  Calendar,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  Users,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { Project, Creator, Feedback, FeedbackCategory } from '../types';

interface ProjectDetailModalProps {
  project: Project;
  creator?: Creator;
  feedbackList: Feedback[];
  isLiked: boolean;
  onClose: () => void;
  onOpenCreator: (creatorId: string) => void;
  onToggleLike: (projectId: string) => void;
  onSubmitFeedback: (
    projectId: string,
    authorName: string,
    authorRole: string,
    category: FeedbackCategory,
    message: string
  ) => void;
}

const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  'Suggestion',
  'Question',
  'Appreciation',
  'Bug Report'
];

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  creator,
  feedbackList,
  isLiked,
  onClose,
  onOpenCreator,
  onToggleLike,
  onSubmitFeedback,
}) => {
  // Feedback form state
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('Suggestion');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackAuthor, setFeedbackAuthor] = useState('');
  const [feedbackRole, setFeedbackRole] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const projectFeedback = feedbackList.filter((fb) => fb.projectId === project.id);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const trimmed = feedbackMessage.trim();
    if (!trimmed) {
      setFormError('Please enter a feedback message.');
      return;
    }
    if (trimmed.length < 10) {
      setFormError('Feedback should be at least 10 characters to be constructive.');
      return;
    }
    if (trimmed.length > 600) {
      setFormError('Feedback message must be under 600 characters.');
      return;
    }

    onSubmitFeedback(
      project.id,
      feedbackAuthor.trim() || 'Community Member',
      feedbackRole.trim() || 'Student Reviewer',
      selectedCategory,
      trimmed
    );

    setFeedbackMessage('');
    setFormSuccess('Feedback submitted! Thank you for supporting student innovation.');
    setTimeout(() => {
      setFormSuccess(null);
    }, 4000);
  };

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div 
        className="relative w-full max-w-4xl bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Navigation Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#141418]/95 backdrop-blur-md border-b border-zinc-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleLike(project.id)}
              aria-label={`${isLiked ? 'Unlike' : 'Like'} ${project.title}`}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isLiked
                  ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{isLiked ? 'Supported' : 'Support'} ({project.likesCount})</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Header Banner & Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="font-semibold text-violet-400">{project.category}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Launched {formattedDate}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-medium">
                {project.status}
              </span>
              {project.featured && (
                <>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                    <Sparkles className="w-3 h-3" />
                    Featured Project
                  </span>
                </>
              )}
            </div>

            <h1 id="modal-project-title" className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EF] tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
              {project.description}
            </p>

            {/* External Links Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                </a>
              )}
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#18181D] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>

          {/* Project Thumbnail Image */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Story & Problem Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#141418] border border-zinc-800/80 rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-heading">
                The Problem
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.problem}
              </p>
            </div>

            <div className="bg-[#141418] border border-zinc-800/80 rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 font-heading">
                The Story & Motivation
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.story}
              </p>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="space-y-3">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Key Features & Architecture Highlights</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-[#141418] border border-zinc-800/70 text-xs sm:text-sm text-zinc-300 leading-normal"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges & Lessons Learned if present */}
          {project.challenges && (
            <div className="bg-[#141418] border border-zinc-800/80 rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-heading">
                Challenges & Lessons Learned
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          )}

          {/* Technologies Stack & Team Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Technologies */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800/80 border border-zinc-700/60 text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Project Creators & Team
              </h3>
              <div className="space-y-2">
                {creator && (
                  <button
                    onClick={() => onOpenCreator(creator.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#141418] hover:bg-zinc-800/80 border border-zinc-800 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {creator.name} (Lead)
                        </div>
                        <div className="text-xs text-zinc-400">{creator.university || creator.role}</div>
                      </div>
                    </div>
                    <span className="text-xs text-violet-400 font-medium">View Portfolio →</span>
                  </button>
                )}

                {project.teamMembers
                  .filter((m) => !creator || m.name !== creator.name)
                  .map((member, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#141418] border border-zinc-800 text-xs"
                    >
                      <span className="font-medium text-zinc-200">{member.name}</span>
                      <span className="text-zinc-500">{member.role}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Constructive Community Feedback Section */}
          <div className="pt-6 border-t border-zinc-800/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-400" />
                  <span>Constructive Feedback & Discussion</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Help the creators refine their prototype with insightful suggestions, questions, and encouragement.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">
                {projectFeedback.length} {projectFeedback.length === 1 ? 'Contribution' : 'Contributions'}
              </span>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleFeedbackSubmit} className="bg-[#141418] border border-zinc-800 rounded-xl p-5 space-y-4">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Feedback Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const catColors = {
                      Suggestion: isSelected ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800',
                      Question: isSelected ? 'bg-amber-600 text-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800',
                      Appreciation: isSelected ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800',
                      'Bug Report': isSelected ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800',
                    };

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${catColors[cat]}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Author name and role (optional overrides) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="fb-author-name" className="block text-xs text-zinc-400 mb-1">
                    Your Name
                  </label>
                  <input
                    id="fb-author-name"
                    type="text"
                    value={feedbackAuthor}
                    onChange={(e) => setFeedbackAuthor(e.target.value)}
                    placeholder="Alex Rivera (or your name)"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label htmlFor="fb-author-role" className="block text-xs text-zinc-400 mb-1">
                    Your Role / Major
                  </label>
                  <input
                    id="fb-author-role"
                    type="text"
                    value={feedbackRole}
                    onChange={(e) => setFeedbackRole(e.target.value)}
                    placeholder="Student Builder / Peer Reviewer"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Message text area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="fb-message-input" className="block text-xs text-zinc-400">
                    Your Constructive Feedback *
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    {feedbackMessage.length}/600
                  </span>
                </div>
                <textarea
                  id="fb-message-input"
                  rows={3}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Share ideas on improving usability, architecture suggestions, testing edge cases, or words of encouragement..."
                  className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  maxLength={600}
                />
              </div>

              {/* Form Feedback Messages */}
              {formError && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!feedbackMessage.trim()}
                  className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Feedback</span>
                </button>
              </div>
            </form>

            {/* Feedback List */}
            <div className="space-y-3">
              {projectFeedback.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
                  <p className="text-sm">No feedback yet for this project.</p>
                  <p className="text-xs mt-1">Be the first to share constructive thoughts with the creators!</p>
                </div>
              ) : (
                projectFeedback.map((item) => {
                  const itemDate = new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  const badgeColors = {
                    Suggestion: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
                    Question: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    Appreciation: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                    'Bug Report': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  };

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#141418] border border-zinc-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{item.authorName}</span>
                          <span className="text-zinc-500">({item.authorRole})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${badgeColors[item.category]}`}>
                            {item.category}
                          </span>
                          <span className="text-zinc-500">{itemDate}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
