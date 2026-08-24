import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORY_DEFINITIONS } from '../data/initialProducts';
import { ProductCategory } from '../types';
import {
  ArrowLeft,
  Search,
  X,
  SlidersHorizontal,
  Columns,
  Grid,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown
} from 'lucide-react';

const CATEGORY_TITLES: Record<ProductCategory, string> = {
  all: 'All Drops',
  greeting_card: 'Cards & Invites',
  wallpaper: '4K Wallpapers',
  poster: 'Wall Posters',
  drawing: 'Handmade Art',
  whatsapp_status: 'WhatsApp Status',
  profile_avatar: '3D Avatars & DP',
  graphics: 'Vector Graphics',
  ebook_pdf: 'eBooks & PDF Guides',
  canvas_template: 'Canva Templates',
  insta_story: 'Insta Stories',
  ad_banner: 'Ad & Sale Banners'
};

export const CategoryPageView: React.FC = () => {
  const {
    products,
    selectedCategory,
    openCategory,
    setActivePage
  } = useApp();

  const currentCategory = selectedCategory || 'all';
  const categoryTitle = CATEGORY_TITLES[currentCategory] || 'Explore Drops';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedPriceType, setSelectedPriceType] = useState<'all' | 'free' | 'under99' | 'paid'>('all');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price_low' | 'price_high' | 'newest'>('popularity');
  const [layoutMode, setLayoutMode] = useState<'pinterest' | 'compact'>('pinterest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Base products in this category
  const categoryProducts = useMemo(() => {
    if (currentCategory === 'all') return products;
    return products.filter((p) => p.category === currentCategory);
  }, [products, currentCategory]);

  // Unique formats available in this category
  const availableFormats = useMemo(() => {
    const formats = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.format) formats.add(p.format);
    });
    return ['all', ...Array.from(formats)];
  }, [categoryProducts]);

  // Filtered and sorted products
  const displayedProducts = useMemo(() => {
    return categoryProducts
      .filter((p) => {
        // Format filter
        if (selectedFormat !== 'all' && p.format !== selectedFormat) {
          return false;
        }

        // Orientation filter
        if (selectedOrientation !== 'all' && p.orientation !== selectedOrientation) {
          return false;
        }

        // Price filter
        const isFreeProd = p.isFree || p.price === 0;
        if (selectedPriceType === 'free' && !isFreeProd) return false;
        if (selectedPriceType === 'paid' && isFreeProd) return false;
        if (selectedPriceType === 'under99' && (p.price > 99 || isFreeProd)) return false;

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const matchTitle = p.title ? p.title.toLowerCase().includes(query) : false;
          const matchDesc = p.description ? p.description.toLowerCase().includes(query) : false;
          const matchTag = p.tags && Array.isArray(p.tags) ? p.tags.some((t) => t.toLowerCase().includes(query)) : false;
          const matchCreator = p.creator?.name ? p.creator.name.toLowerCase().includes(query) : false;
          if (!matchTitle && !matchDesc && !matchTag && !matchCreator) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'price_low':
            return (a.price || 0) - (b.price || 0);
          case 'price_high':
            return (b.price || 0) - (a.price || 0);
          case 'newest':
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          case 'popularity':
          default:
            return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
      });
  }, [categoryProducts, selectedFormat, selectedOrientation, selectedPriceType, searchQuery, sortBy]);

  const hasActiveFilters = selectedPriceType !== 'all' || selectedFormat !== 'all' || selectedOrientation !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFormat('all');
    setSelectedOrientation('all');
    setSelectedPriceType('all');
    setSortBy('popularity');
    setIsSearchOpen(false);
  };

  const sortLabels: Record<string, string> = {
    popularity: 'Popular',
    rating: 'Top Rated',
    price_low: 'Lowest Price',
    price_high: 'Highest Price',
    newest: 'Newest'
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 pb-20 sm:pb-12 select-none">
      {/* 1. Android Native-Style App Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-2">
            {/* Left: Back Arrow + Category Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setActivePage('home')}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-neutral-800 shrink-0 cursor-pointer"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-baseline gap-2 min-w-0">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 truncate">
                  {categoryTitle}
                </h1>
                <span className="text-[11px] font-mono text-neutral-400 shrink-0 font-medium">
                  {displayedProducts.length}
                </span>
              </div>
            </div>

            {/* Right Actions: Search toggle, Sort button, Layout Toggle */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (isSearchOpen) setSearchQuery('');
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isSearchOpen || searchQuery
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200'
                }`}
                aria-label="Search within category"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Layout Switcher (2-Col vs Masonry) */}
              <button
                onClick={() => setLayoutMode(layoutMode === 'pinterest' ? 'compact' : 'pinterest')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors cursor-pointer"
                title={layoutMode === 'pinterest' ? 'Switch to Grid' : 'Switch to Dynamic Masonry'}
                aria-label="Toggle Layout"
              >
                {layoutMode === 'pinterest' ? (
                  <Grid className="w-4 h-4" />
                ) : (
                  <Columns className="w-4 h-4" />
                )}
              </button>

              {/* Sort Menu Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="h-9 px-2.5 rounded-full flex items-center gap-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Sort Dropdown */}
                {isSortDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-neutral-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        Sort By
                      </div>
                      {[
                        { id: 'popularity', label: 'Most Popular' },
                        { id: 'rating', label: 'Highest Rated' },
                        { id: 'price_low', label: 'Price: Low to High' },
                        { id: 'price_high', label: 'Price: High to Low' },
                        { id: 'newest', label: 'Newest Drops' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSortBy(opt.id as any);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                            sortBy === opt.id
                              ? 'font-semibold text-neutral-900 bg-neutral-50'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Expandable Minimal Search Input */}
          {isSearchOpen && (
            <div className="pb-3 pt-1">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${categoryTitle}...`}
                  className="w-full pl-9 pr-9 py-2 bg-neutral-100 border-none rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 w-5 h-5 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Category Switcher Pills Carousel (Android Style Horizontal Scroll) */}
        <div className="px-3 sm:px-6 py-2 border-t border-neutral-100/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {CATEGORY_DEFINITIONS.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  openCategory(cat.id as ProductCategory);
                  handleResetFilters();
                }}
                className={`h-8 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Minimal Filter Chips Row */}
        <div className="px-3 sm:px-6 py-2 bg-[#FAFAFA] border-t border-neutral-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-xs">
          {/* Price Quick Filter Chips */}
          {[
            { id: 'all', label: 'All' },
            { id: 'free', label: 'Free' },
            { id: 'under99', label: '< ₹99' },
            { id: 'paid', label: 'Paid' }
          ].map((p) => {
            const isSelected = selectedPriceType === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPriceType(p.id as any)}
                className={`h-7 px-3 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-neutral-800 text-white shadow-2xs font-semibold'
                    : 'bg-white text-neutral-600 border border-neutral-200/70 hover:bg-neutral-50'
                }`}
              >
                {p.label}
              </button>
            );
          })}

          {/* Dynamic Format Filter Chips */}
          {availableFormats.length > 2 && (
            <>
              <div className="h-4 w-px bg-neutral-200 shrink-0 mx-0.5" />
              {availableFormats.map((fmt) => {
                const isSelected = selectedFormat === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`h-7 px-3 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-neutral-800 text-white shadow-2xs font-semibold'
                        : 'bg-white text-neutral-600 border border-neutral-200/70 hover:bg-neutral-50'
                    }`}
                  >
                    {fmt === 'all' ? 'All Formats' : fmt}
                  </button>
                );
              })}
            </>
          )}

          {/* Reset Filters Pill */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="h-7 px-2.5 rounded-full text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Product Feed (2-Column Mobile, 3-Col Tablet, 4-5 Col Desktop) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 sm:pt-5">
        {displayedProducts.length === 0 ? (
          /* Clean Empty State */
          <div className="py-16 text-center max-w-xs mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">
              No products found
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Try adjusting or resetting your filter criteria to see more items.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        ) : (
          /* Products Grid / Masonry */
          <div
            className={
              layoutMode === 'pinterest'
                ? 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2.5 sm:gap-4 [column-fill:_balance]'
                : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4'
            }
          >
            {displayedProducts.map((product) => (
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
