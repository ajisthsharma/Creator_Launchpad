import React, { useState, useRef, useEffect } from 'react';
import { Rocket, Sparkles, Users, Layers, Plus, Menu, X, RotateCcw, ExternalLink } from 'lucide-react';
import { ActiveUser } from '../types';

interface NavbarProps {
  currentUser: ActiveUser;
  onOpenLaunch: () => void;
  onOpenCreators: () => void;
  onSelectCategory: (category: string) => void;
  onResetData: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLaunch,
  onOpenCreators,
  onSelectCategory,
  onResetData,
  onHomeClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090B]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-6">
            <button
              onClick={onHomeClick}
              className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-1"
              aria-label="Creator Launchpad Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-950/40 text-white transform group-hover:scale-105 transition-transform duration-200">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base tracking-tight text-[#F5F2EF] group-hover:text-white flex items-center gap-1.5">
                  CREATOR LAUNCHPAD
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                    CAMPUS
                  </span>
                </span>
                <span className="text-[11px] text-zinc-400 font-sans tracking-wide">
                  Student Innovation Network
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Main Navigation">
              <button
                onClick={onHomeClick}
                className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors"
              >
                Explore
              </button>
              <button
                onClick={() => {
                  const filterSection = document.getElementById('project-filters-section');
                  if (filterSection) {
                    filterSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-zinc-400" />
                Categories
              </button>
              <button
                onClick={onOpenCreators}
                className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-zinc-400" />
                Creators
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLaunch}
              className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Launch Project</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label="User Account Menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
                <span className="text-xs font-medium text-zinc-300">{currentUser.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#141418] border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-zinc-800/80">
                    <div className="font-semibold text-white">{currentUser.name}</div>
                    <div className="text-xs text-zinc-400">{currentUser.handle} · {currentUser.role}</div>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenLaunch();
                      }}
                      className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/70 flex items-center gap-2.5"
                    >
                      <Plus className="w-4 h-4 text-violet-400" />
                      Submit New Project
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenCreators();
                      }}
                      className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/70 flex items-center gap-2.5"
                    >
                      <Users className="w-4 h-4 text-rose-400" />
                      Student Creators Directory
                    </button>
                  </div>

                  <div className="pt-1 border-t border-zinc-800/80">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onResetData();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/70 flex items-center gap-2.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset to Default Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenLaunch}
              className="bg-violet-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              aria-label="Launch project"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111114] border-b border-zinc-800 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onHomeClick();
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60 rounded-lg"
          >
            Explore Projects
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const filterSection = document.getElementById('project-filters-section');
              if (filterSection) {
                filterSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60 rounded-lg flex items-center justify-between"
          >
            <span>Filter Categories</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCreators();
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60 rounded-lg flex items-center justify-between"
          >
            <span>Explore Creators</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </button>
          <div className="pt-2 border-t border-zinc-800/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onResetData();
              }}
              className="w-full text-left py-2 px-3 text-xs text-amber-300 hover:bg-zinc-800/60 rounded-lg flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Seed Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
