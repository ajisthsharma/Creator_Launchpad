import React from 'react';
import { Rocket, Heart, RotateCcw, Github, Globe, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface FooterProps {
  onSelectCategory: (category: CategoryType) => void;
  onResetData: () => void;
  onOpenLaunch: () => void;
}

const CATEGORIES: CategoryType[] = [
  'AI / ML',
  'Web Development',
  'Mobile Apps',
  'Robotics / IoT',
  'Sustainability',
  'Open Source',
];

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onResetData,
  onOpenLaunch,
}) => {
  return (
    <footer className="bg-[#09090B] border-t border-zinc-800/80 pt-12 pb-8 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center text-white shadow-md">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-base text-white tracking-tight">
                CREATOR LAUNCHPAD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              An open launch platform built for student engineers, designers, and researchers. Giving bold campus ideas the visibility and constructive feedback they deserve.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Built by Team Alliance</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Demo Environment
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Explore Disciplines
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    const filterSection = document.getElementById('project-filters-section');
                    if (filterSection) filterSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left text-zinc-400 hover:text-white transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Controls */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Community Actions
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenLaunch}
                className="w-full text-left py-1.5 px-3 rounded-lg bg-violet-600/15 border border-violet-500/30 text-violet-300 hover:bg-violet-600/25 transition-colors font-medium flex items-center justify-between"
              >
                <span>Launch New Project</span>
                <Rocket className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onResetData}
                className="w-full text-left py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 hover:border-zinc-700 transition-colors flex items-center justify-between"
              >
                <span>Reset Demo Seed Data</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 Creator Launchpad. Open student innovation showcase.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>Fueled by student builders</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
