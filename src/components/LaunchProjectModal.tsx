import React, { useState } from 'react';
import { X, Rocket, Sparkles, AlertCircle, CheckCircle2, Link2, Image, Layers, Code, Info } from 'lucide-react';
import { CategoryType, ActiveUser } from '../types';

interface LaunchProjectModalProps {
  currentUser: ActiveUser;
  onClose: () => void;
  onSubmit: (projectData: {
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
  }) => void;
}

const CATEGORIES: Exclude<CategoryType, 'All'>[] = [
  'AI / ML',
  'Web Development',
  'Mobile Apps',
  'Robotics / IoT',
  'Sustainability',
  'Open Source',
  'Other',
];

export const LaunchProjectModal: React.FC<LaunchProjectModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Exclude<CategoryType, 'All'>>('AI / ML');
  const [problem, setProblem] = useState('');
  const [story, setStory] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [challenges, setChallenges] = useState('');
  const [techInput, setTechInput] = useState('');
  const [creatorName, setCreatorName] = useState(currentUser.name);
  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<'Launched' | 'Beta' | 'Prototype'>('Launched');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL protocol validator
  const isValidUrl = (url: string) => {
    if (!url.trim()) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = 'Project title is required.';
    } else if (title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }

    if (!description.trim()) {
      errs.description = 'Short description is required.';
    } else if (description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters.';
    }

    if (!problem.trim()) {
      errs.problem = 'Please describe the problem you are solving.';
    }

    if (!story.trim()) {
      errs.story = 'Please share your story, motivation, or inspiration.';
    }

    if (!creatorName.trim()) {
      errs.creatorName = 'Creator name is required.';
    }

    if (demoUrl.trim() && !isValidUrl(demoUrl.trim())) {
      errs.demoUrl = 'Demo URL must begin with http:// or https://';
    }

    if (repositoryUrl.trim() && !isValidUrl(repositoryUrl.trim())) {
      errs.repositoryUrl = 'Repository URL must begin with http:// or https://';
    }

    if (thumbnailUrl.trim() && !isValidUrl(thumbnailUrl.trim())) {
      errs.thumbnailUrl = 'Thumbnail URL must be a valid http:// or https:// URL';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Parse features
    const parsedFeatures = featuresInput
      .split('\n')
      .map((f) => f.trim().replace(/^[-*•]\s*/, ''))
      .filter((f) => f.length > 0);

    // If no features listed, create standard fallback
    const finalFeatures =
      parsedFeatures.length > 0
        ? parsedFeatures
        : ['Autonomous student innovation architecture', 'Responsive web experience'];

    // Parse tech stack
    const parsedTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const finalTech = parsedTech.length > 0 ? parsedTech : ['TypeScript', 'React'];

    // Parse team members (format: Name - Role or just Name)
    const teamMembers = teamMembersInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split('-');
        if (parts.length > 1) {
          return { name: parts[0].trim(), role: parts.slice(1).join('-').trim() };
        }
        return { name: line, role: 'Contributor' };
      });

    // Submit
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      story: story.trim(),
      problem: problem.trim(),
      features: finalFeatures,
      challenges: challenges.trim() || undefined,
      category,
      technologies: finalTech,
      creatorName: creatorName.trim(),
      teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      repositoryUrl: repositoryUrl.trim() || undefined,
      status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-modal-title"
    >
      <div
        className="relative w-full max-w-3xl bg-[#111114] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#141418]/95 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 id="launch-modal-title" className="text-base font-bold font-heading text-white">
                Launch Student Project
              </h2>
              <p className="text-xs text-zinc-400">Share your creation with the campus community</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close form"
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Identity</span>
            </h3>

            {/* Title */}
            <div>
              <label htmlFor="form-title" className="block text-xs font-medium text-zinc-300 mb-1">
                Project Title *
              </label>
              <input
                id="form-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. EcoTrack, VisionGuard, DevBoard"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  errors.title ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="form-desc" className="block text-xs font-medium text-zinc-300 mb-1">
                Short Tagline / Elevator Pitch *
              </label>
              <input
                id="form-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A concise one-liner describing what your project does"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  errors.description ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="form-category" className="block text-xs font-medium text-zinc-300 mb-1">
                  Category *
                </label>
                <select
                  id="form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Exclude<CategoryType, 'All'>)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="form-status" className="block text-xs font-medium text-zinc-300 mb-1">
                  Project Phase
                </label>
                <select
                  id="form-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Launched' | 'Beta' | 'Prototype')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
                >
                  <option value="Launched">Launched (Production / Ready)</option>
                  <option value="Beta">Beta (Testing on Campus)</option>
                  <option value="Prototype">Prototype (Initial Working Build)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Deep Narrative: Problem & Story */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>The Story & The Problem</span>
            </h3>

            {/* Problem */}
            <div>
              <label htmlFor="form-problem" className="block text-xs font-medium text-zinc-300 mb-1">
                The Problem Being Solved *
              </label>
              <textarea
                id="form-problem"
                rows={2}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What specific campus, environmental, or technical problem did you witness?"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  errors.problem ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.problem && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.problem}
                </p>
              )}
            </div>

            {/* Story */}
            <div>
              <label htmlFor="form-story" className="block text-xs font-medium text-zinc-300 mb-1">
                The Origin Story & Inspiration *
              </label>
              <textarea
                id="form-story"
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="How did you come up with the idea? What drove you to build it during the semester?"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  errors.story ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.story && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.story}
                </p>
              )}
            </div>

            {/* Key Features */}
            <div>
              <label htmlFor="form-features" className="block text-xs font-medium text-zinc-300 mb-1">
                Key Features (one per line)
              </label>
              <textarea
                id="form-features"
                rows={3}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Edge neural network running at 45 FPS&#10;Binaural 3D directional audio cues&#10;Zero cloud dependency in offline basements"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            {/* Challenges */}
            <div>
              <label htmlFor="form-challenges" className="block text-xs font-medium text-zinc-300 mb-1">
                Challenges Faced & Lessons Learned (optional)
              </label>
              <textarea
                id="form-challenges"
                rows={2}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="What was the hardest bug, hardware limitation, or model quantization hurdle?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          </div>

          {/* Tech Stack & Team */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>Technology & Creator Info</span>
            </h3>

            {/* Technologies */}
            <div>
              <label htmlFor="form-tech" className="block text-xs font-medium text-zinc-300 mb-1">
                Technologies Used (comma-separated)
              </label>
              <input
                id="form-tech"
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="PyTorch, React, WebSockets, Tailwind, FastAPI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Creator Name */}
              <div>
                <label htmlFor="form-creator" className="block text-xs font-medium text-zinc-300 mb-1">
                  Lead Creator Name *
                </label>
                <input
                  id="form-creator"
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Your Name"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                    errors.creatorName ? 'border-rose-500' : 'border-zinc-800'
                  }`}
                />
                {errors.creatorName && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.creatorName}
                  </p>
                )}
              </div>

              {/* Team Members */}
              <div>
                <label htmlFor="form-team" className="block text-xs font-medium text-zinc-300 mb-1">
                  Team Members (Name - Role, optional)
                </label>
                <textarea
                  id="form-team"
                  rows={2}
                  value={teamMembersInput}
                  onChange={(e) => setTeamMembersInput(e.target.value)}
                  placeholder="Kai Tanaka - Accessibility Researcher&#10;Samantha Lin - Frontend"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            </div>
          </div>

          {/* Links & Artwork */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              <span>Links & Media</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="form-demo-url" className="block text-xs font-medium text-zinc-300 mb-1">
                  Live Demo URL (optional)
                </label>
                <input
                  id="form-demo-url"
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://myproject.example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                    errors.demoUrl ? 'border-rose-500' : 'border-zinc-800'
                  }`}
                />
                {errors.demoUrl && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.demoUrl}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="form-repo-url" className="block text-xs font-medium text-zinc-300 mb-1">
                  GitHub / Repository URL (optional)
                </label>
                <input
                  id="form-repo-url"
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                    errors.repositoryUrl ? 'border-rose-500' : 'border-zinc-800'
                  }`}
                />
                {errors.repositoryUrl && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.repositoryUrl}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="form-thumb-url" className="block text-xs font-medium text-zinc-300 mb-1">
                Thumbnail Image URL (optional)
              </label>
              <input
                id="form-thumb-url"
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (leaves default if empty)"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  errors.thumbnailUrl ? 'border-rose-500' : 'border-zinc-800'
                }`}
              />
              {errors.thumbnailUrl && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.thumbnailUrl}
                </p>
              )}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:opacity-50 text-white font-medium text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-900/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <Rocket className="w-4 h-4" />
              <span>{isSubmitting ? 'Launching...' : 'Launch Project to Community'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
