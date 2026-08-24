import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORY_DEFINITIONS } from '../data/initialProducts';
import { ProductCategory } from '../types';
import {
  ArrowLeft,
  Search,
  X,
  SlidersHorizontal,
  Grid,
  Columns,
  Sparkles,
  TrendingUp,
  History,
  Check,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

const POPULAR_SEARCH_KEYWORDS = [
  'Wallpapers',
  'Canva Templates',
  '4K Posters',
  'WhatsApp Status',
  'Avatars',
  'Festive',
  'Free Drops',
  'Minimalist'
];

export const DynamicSearchPage: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    setActivePage
  } = useApp();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedPriceType, setSelectedPriceType] = useState<'all' | 'free' | 'under99' | 'paid'>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'popularity' | 'rating' | 'price_low' | 'price_high' | 'newest'>('relevance');
  const [layoutMode, setLayoutMode] = useState<'pinterest' | 'compact'>('pinterest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('digivault_recent_searches');
      return saved ? JSON.parse(saved) : ['4K Wallpaper', 'Canva Template', 'Status Video'];
    } catch {
      return ['4K Wallpaper', 'Canva Template', 'Status Video'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize on mount
  useEffect(() => {
    if (searchQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((i) => i.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('digivault_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(localQuery);
    saveRecentSearch(localQuery);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleSelectKeyword = (keyword: string) => {
    setLocalQuery(keyword);
    setSearchQuery(keyword);
    saveRecentSearch(keyword);
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Unique formats in entire catalog
  const availableFormats = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.format) set.add(p.format);
    });
    return ['all', ...Array.from(set)];
  }, [products]);

  // Dynamic search & multi-facet filtering
  const searchResults = useMemo(() => {
    const q = localQuery.trim().toLowerCase();

    return products
      .filter((p) => {
        // Query matching (Title, Description, Tags, Category, Format, Creator)
        if (q) {
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchFormat = p.format.toLowerCase().includes(q);
          const matchCreator = p.creator.name.toLowerCase().includes(q);
          const matchFestival = p.festivalTag ? p.festivalTag.toLowerCase().includes(q) : false;

          if (!matchTitle && !matchDesc && !matchTags && !matchCategory && !matchFormat && !matchCreator && !matchFestival) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Format filter
        if (selectedFormat !== 'all' && p.format !== selectedFormat) {
          return false;
        }

        // Price filter
        if (selectedPriceType === 'free' && !p.isFree) return false;
        if (selectedPriceType === 'paid' && p.isFree) return false;
        if (selectedPriceType === 'under99' && (p.price > 99 || p.isFree)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'relevance' && q) {
          const aExact = a.title.toLowerCase().includes(q) ? 2 : 0;
          const bExact = b.title.toLowerCase().includes(q) ? 2 : 0;
          return bExact - aExact || b.downloadCount - a.downloadCount;
        }
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'popularity':
          default:
            return b.downloadCount - a.downloadCount;
        }
      });
  }, [products, localQuery, selectedCategory, selectedFormat, selectedPriceType, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedPriceType !== 'all' || selectedFormat !== 'all';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceType('all');
    setSelectedFormat('all');
    setSortBy('relevance');
  };

  const sortLabels: Record<string, string> = {
    relevance: 'Relevance',
    popularity: 'Most Popular',
    rating: 'Top Rated',
    price_low: 'Price: Low to High',
    price_high: 'Price: High to Low',
    newest: 'Newest First'
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 pb-24 sm:pb-12">
      {/* 1. Sticky Ecommerce Search Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-2.5 pb-2">
          {/* Main Input Row */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Flipkart-Style Search Input Container */}
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search 10,000+ wallpapers, templates, status..."
                className="w-full pl-10 pr-9 py-2.5 bg-neutral-100/90 border-none rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 w-5 h-5 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Layout Toggle (Compact Grid vs Masonry) */}
            <button
              type="button"
              onClick={() => setLayoutMode(layoutMode === 'pinterest' ? 'compact' : 'pinterest')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
              title="Toggle Layout"
            >
              {layoutMode === 'pinterest' ? <Grid className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
            </button>
          </form>

          {/* Quick Category Filter Pills */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`h-7 px-3 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
              }`}
            >
              All Categories
            </button>
            {CATEGORY_DEFINITIONS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                  className={`h-7 px-3 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Filter Attributes (Price, Formats, Sort) */}
          <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-[11px]">
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Price Type Chips */}
              {[
                { id: 'all', label: 'All Price' },
                { id: 'free', label: 'Free' },
                { id: 'under99', label: '< ₹99' },
                { id: 'paid', label: 'Paid' }
              ].map((p) => {
                const isSelected = selectedPriceType === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPriceType(p.id as any)}
                    className={`h-6 px-2.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}

              {/* Reset Filter Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="h-6 px-2 rounded-full font-medium text-rose-600 bg-rose-50 border border-rose-100 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="h-6 px-2.5 rounded-full bg-white border border-neutral-200 text-neutral-700 font-medium flex items-center gap-1 hover:bg-neutral-50 cursor-pointer"
              >
                <SlidersHorizontal className="w-2.5 h-2.5" />
                <span>{sortLabels[sortBy]}</span>
                <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
              </button>

              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-neutral-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Sort Results
                    </div>
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key as any);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                          sortBy === key
                            ? 'font-semibold text-neutral-900 bg-neutral-50'
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                      >
                        <span>{label}</span>
                        {sortBy === key && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Feed */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3">
        {/* Results Counter & Search Keywords */}
        <div className="px-1 mb-3 flex items-center justify-between text-xs text-neutral-500">
          <div>
            {localQuery.trim() ? (
              <span>
                Results for <strong className="text-neutral-900 font-semibold">"{localQuery}"</strong>
              </span>
            ) : (
              <span>All Available Digital Drops</span>
            )}
            <span className="ml-1.5 text-neutral-400 font-mono">({searchResults.length})</span>
          </div>
        </div>

        {/* Suggested / Popular Chips when query is short or empty */}
        {(!localQuery.trim() || searchResults.length === 0) && (
          <div className="mb-5 p-3.5 bg-white rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-2">
                  <History className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSelectKeyword(item)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleSelectKeyword(kw)}
                    className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchResults.length === 0 ? (
          <div className="py-16 text-center max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">
              No matching products found
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We couldn't find anything matching "{localQuery}". Try checking for spelling errors or searching for broader keywords like "wallpaper", "poster", or "canva".
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          /* Product Grid / Masonry */
          <div
            className={
              layoutMode === 'pinterest'
                ? 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2.5 sm:gap-4 [column-fill:_balance]'
                : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4'
            }
          >
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layoutStyle={layoutMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
