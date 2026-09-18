import React from 'react';
import { Search, X } from 'lucide-react';
import { Category } from '../types';

interface MenuNavProps {
  categories: Category[];
  selectedCategory: Category | 'ALL';
  onSelectCategory: (category: Category | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MenuNav: React.FC<MenuNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="sticky top-20 z-30 w-full bg-[#0E0E11]/95 backdrop-blur-md border-b border-[#27272A] py-3.5 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => onSelectCategory('ALL')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                selectedCategory === 'ALL'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              ALL ITEMS
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                      : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar: "Search the menu..." */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search the menu..."
              className="w-full pl-9 pr-9 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37] transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
