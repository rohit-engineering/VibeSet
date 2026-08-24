import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORY_DEFINITIONS } from '../data/initialProducts';
import {
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Search,
  Check,
  Grid,
  Columns,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { ProductCategory, ProductFormat, ProductOrientation } from '../types';

export const ShopExplore: React.FC = () => {
  const {
    products,
    filterState,
    setFilterState,
    resetFilters,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'pinterest' | 'compact'>('pinterest');

  // Filter evaluation
  const filteredProducts = products.filter((item) => {
    // Category match
    if (filterState.category !== 'all' && item.category !== filterState.category) {
      return false;
    }

    // Format match
    if (filterState.format !== 'all' && item.format !== filterState.format) {
      return false;
    }

    // Orientation match
    if (filterState.orientation !== 'all' && item.orientation !== filterState.orientation) {
      return false;
    }

    // Festival tag match
    if (filterState.festivalTag && (!item.festivalTag || !item.festivalTag.toLowerCase().includes(filterState.festivalTag.toLowerCase()))) {
      return false;
    }

    // Price type match
    if (filterState.priceType === 'free' && !item.isFree) {
      return false;
    }
    if (filterState.priceType === 'paid' && item.isFree) {
      return false;
    }
    if (filterState.priceType === 'under99' && (item.price > 99 || item.isFree)) {
      return false;
    }
    if (filterState.priceType === 'under199' && (item.price > 199 || item.isFree)) {
      return false;
    }

    // Search query match (searchQuery or filterState.searchQuery)
    const activeSearch = (filterState.searchQuery || searchQuery || '').trim().toLowerCase();
    if (activeSearch) {
      const matchTitle = item.title.toLowerCase().includes(activeSearch);
      const matchDesc = item.description.toLowerCase().includes(activeSearch);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(activeSearch));
      const matchCreator = item.creator.name.toLowerCase().includes(activeSearch);
      if (!matchTitle && !matchDesc && !matchTag && !matchCreator) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filterState.sortBy) {
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

  const formatsList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Formats' },
    { id: 'JPG', label: 'JPG Image' },
    { id: 'PNG', label: 'PNG Transparent' },
    { id: 'PSD', label: 'PSD Layered' },
    { id: 'SVG', label: 'SVG Vector' },
    { id: 'PDF', label: 'PDF eBook / Guide' },
    { id: 'ZIP Bundle', label: 'ZIP Bundle Pack' },
    { id: 'Canva Link', label: 'Canva Cloud' },
    { id: 'MP4 Video', label: 'MP4 Video Status' }
  ];

  const orientationsList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Orientations' },
    { id: 'portrait_9_16', label: '9:16 Vertical (Story / Phone)' },
    { id: 'square_1_1', label: '1:1 Square (Insta / DP)' },
    { id: 'landscape_16_9', label: '16:9 Landscape (Desktop / Banner)' }
  ];

  const priceTypes: { id: 'all' | 'free' | 'paid' | 'under99' | 'under199'; label: string }[] = [
    { id: 'all', label: 'Any Price' },
    { id: 'free', label: '🎁 100% Free Drops' },
    { id: 'under99', label: 'Under ₹99' },
    { id: 'under199', label: 'Under ₹199' },
    { id: 'paid', label: 'Premium Paid' }
  ];

  const sortOptions = [
    { id: 'popularity', label: '🔥 Most Popular' },
    { id: 'rating', label: '⭐ Highest Rated' },
    { id: 'price_low', label: '💰 Price: Low to High' },
    { id: 'price_high', label: '💎 Price: High to Low' },
    { id: 'newest', label: '⚡ Newest Drops' }
  ];

  const activeFiltersCount =
    (filterState.category !== 'all' ? 1 : 0) +
    (filterState.format !== 'all' ? 1 : 0) +
    (filterState.orientation !== 'all' ? 1 : 0) +
    (filterState.priceType !== 'all' ? 1 : 0) +
    (filterState.festivalTag ? 1 : 0) +
    (filterState.searchQuery || searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-6 pb-20">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-6">
        {/* Title & Count */}
        <div className="flex items-center justify-between sm:block">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-lg sm:text-2xl font-bold text-[#1A1A1A]">
              <span className="sm:hidden">Explore Drops</span>
              <span className="hidden sm:inline">Explore Digital Drops Library</span>
            </h1>
            <span className="text-[11px] sm:text-xs font-mono font-bold bg-[#FFE5D9] text-[#7A4B3A] px-2 py-0.5 rounded-full">
              {sortedProducts.length} Assets
            </span>
          </div>

          <p className="hidden sm:block text-xs sm:text-sm text-neutral-500 mt-0.5 font-normal">
            Instant 4K downloads for WhatsApp, Instagram, Canva, wallpapers, and festive kits
          </p>

          {/* Mobile Right Controls: Filter + Layout */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => setLayoutMode(layoutMode === 'pinterest' ? 'compact' : 'pinterest')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 bg-neutral-100 active:bg-neutral-200"
              title="Toggle Layout"
            >
              {layoutMode === 'pinterest' ? <Grid className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="h-8 px-3 rounded-full bg-[#1A1A1A] text-white text-xs font-medium flex items-center gap-1 shadow-2xs"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Desktop Quick Search & Sort Bar */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any
                }))
              }
              className="bg-white border border-[#EEEEEE] text-[#1A1A1A] text-xs font-medium rounded-full px-3.5 py-2 pr-8 appearance-none focus:outline-none focus:border-black shadow-xs cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Grid Style Toggle */}
          <div className="flex items-center bg-[#F0F0F0] p-1 rounded-full border border-[#EEEEEE]">
            <button
              onClick={() => setLayoutMode('pinterest')}
              className={`p-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'pinterest' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Masonry View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('compact')}
              className={`p-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                layoutMode === 'compact' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Square Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none mb-3 sm:mb-5">
        {CATEGORY_DEFINITIONS.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setFilterState((prev) => ({
                ...prev,
                category: cat.id as ProductCategory
              }))
            }
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              filterState.category === cat.id
                ? 'bg-[#1A1A1A] text-white shadow-2xs font-semibold'
                : 'bg-white hover:bg-[#FAFAFA] text-neutral-700 border border-[#EEEEEE]'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block md:col-span-1 space-y-5 bg-white p-5 rounded-3xl border border-[#EEEEEE] shadow-xs self-start sticky top-24">
          <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
            <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-[#1A1A1A]">
              <SlidersHorizontal className="w-4 h-4 text-neutral-800" />
              <span>Refine Drops</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Pricing Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Price Range
            </label>
            <div className="space-y-1">
              {priceTypes.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setFilterState((prev) => ({ ...prev, priceType: pt.id }))}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    filterState.priceType === pt.id
                      ? 'bg-[#FFE5D9] text-[#7A4B3A] font-bold'
                      : 'text-neutral-600 hover:bg-[#FAFAFA]'
                  }`}
                >
                  <span>{pt.label}</span>
                  {filterState.priceType === pt.id && <Check className="w-3.5 h-3.5 text-[#7A4B3A]" />}
                </button>
              ))}
            </div>
          </div>

          {/* File Format Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              File Format
            </label>
            <div className="space-y-1">
              {formatsList.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFilterState((prev) => ({ ...prev, format: fmt.id }))}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    filterState.format === fmt.id
                      ? 'bg-[#D8E2DC] text-[#2C4A3E] font-bold'
                      : 'text-neutral-600 hover:bg-[#FAFAFA]'
                  }`}
                >
                  <span>{fmt.label}</span>
                  {filterState.format === fmt.id && <Check className="w-3.5 h-3.5 text-[#2C4A3E]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Screen Orientation
            </label>
            <div className="space-y-1">
              {orientationsList.map((ori) => (
                <button
                  key={ori.id}
                  onClick={() => setFilterState((prev) => ({ ...prev, orientation: ori.id }))}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    filterState.orientation === ori.id
                      ? 'bg-[#F4ACB7]/40 text-[#732B3A] font-bold'
                      : 'text-neutral-600 hover:bg-[#FAFAFA]'
                  }`}
                >
                  <span>{ori.label}</span>
                  {filterState.orientation === ori.id && <Check className="w-3.5 h-3.5 text-[#732B3A]" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Slide-down Filters Drawer */}
        {isMobileFilterOpen && (
          <div className="md:hidden col-span-1 bg-white p-4 rounded-3xl border border-[#EEEEEE] shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#1A1A1A]">Mobile Filter Controls</span>
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-mono text-neutral-500 mb-1">Price</p>
                <select
                  value={filterState.priceType}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, priceType: e.target.value as any }))}
                  className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-2"
                >
                  {priceTypes.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="font-mono text-neutral-500 mb-1">Format</p>
                <select
                  value={filterState.format}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, format: e.target.value }))}
                  className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-2"
                >
                  {formatsList.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="font-mono text-neutral-500 mb-1">Orientation</p>
                <select
                  value={filterState.orientation}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, orientation: e.target.value }))}
                  className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-2"
                >
                  {orientationsList.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="font-mono text-neutral-500 mb-1">Sort</p>
                <select
                  value={filterState.sortBy}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-2"
                >
                  {sortOptions.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#1A1A1A] text-white font-medium py-2.5 rounded-full text-xs"
            >
              Apply Filters ({sortedProducts.length} Results)
            </button>
          </div>
        )}

        {/* Product Grid Area */}
        <main className="md:col-span-3">
          {sortedProducts.length > 0 ? (
            layoutMode === 'compact' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layoutStyle="compact"
                  />
                ))}
              </div>
            ) : (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-2.5 sm:gap-3.5 [column-fill:_balance]">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layoutStyle="pinterest"
                  />
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#EEEEEE] shadow-xs flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#FAFAFA] text-neutral-400 flex items-center justify-center mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Digital Drops Found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                No digital products match your active filter criteria. Try resetting filters or searching with different keywords.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs font-medium px-5 py-2 rounded-full transition-all shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
