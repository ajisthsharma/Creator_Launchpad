import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CategoryType, SortOption } from '../types';

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFiltered: number;
  onResetFilters: () => void;
}

const CATEGORIES: CategoryType[] = [
  'All',
  'AI / ML',
  'Web Development',
  'Mobile Apps',
  'Robotics / IoT',
  'Sustainability',
  'Open Source',
  'Other',
];

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  totalFiltered,
  onResetFilters,
}) => {
  const isFiltered = searchQuery.trim().length > 0 || selectedCategory !== 'All' || sortOption !== 'popular';

  return (
    <div id="project-filters-section" className="space-y-4 pt-8 pb-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input with icon and clear button */}
        <div className="relative flex-1">
          <label htmlFor="project-search-input" className="sr-only">
            Search projects, creators, technologies
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="project-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by project name, description, creator, or tech (e.g., PyTorch, SQLite, React)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141418] border border-zinc-800 text-sm text-[#F5F2EF] placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <label htmlFor="sort-select" className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sort by:</span>
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-[#141418] border border-zinc-800 text-xs font-medium text-[#F5F2EF] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Recently Launched</option>
            <option value="discussed">Most Discussed</option>
          </select>
        </div>
      </div>

      {/* Segmented Category Filters Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/30'
                  : 'bg-[#141418] text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Active state and results summary bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
        <div>
          <span>Showing <strong className="text-zinc-200">{totalFiltered}</strong> {totalFiltered === 1 ? 'project' : 'projects'}</span>
          {selectedCategory !== 'All' && (
            <span> in <strong className="text-violet-300">{selectedCategory}</strong></span>
          )}
          {searchQuery && (
            <span> matching &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo;</span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 focus:outline-none focus-visible:underline"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
