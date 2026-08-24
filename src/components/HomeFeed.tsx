import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { StoryPreviewModal } from './StoryPreviewModal';
import {
  CATEGORY_DEFINITIONS,
  FESTIVAL_COLLECTIONS
} from '../data/initialProducts';
import {
  Sparkles,
  Flame,
  Star,
  Gift,
  ArrowRight,
  Smartphone,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Image,
  Palette,
  MessageCircle,
  UserCheck,
  Layers,
  BookOpen,
  LayoutTemplate,
  Instagram,
  Tag
} from 'lucide-react';
import { ProductCategory, DigitalProduct } from '../types';

export const HomeFeed: React.FC = () => {
  const {
    products,
    setActivePage,
    setFilterState,
    openCategory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'trending' | 'top_rated' | 'free' | 'pro' | 'festive'>('trending');
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  // WhatsApp & 9:16 Stories subset
  const storyProducts = products.filter(
    (p) => p.orientation === 'portrait_9_16' || p.category === 'whatsapp_status' || p.category === 'insta_story'
  );

  // Tab filtering
  const getFilteredProducts = (): DigitalProduct[] => {
    switch (activeTab) {
      case 'top_rated':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'free':
        return products.filter((p) => p.isFree);
      case 'pro':
        return products.filter((p) => p.isProOnly);
      case 'festive':
        return products.filter((p) => p.festivalTag && p.festivalTag !== 'Evergreen');
      case 'trending':
      default:
        return products.filter((p) => p.trending || p.featured);
    }
  };

  const displayedProducts = getFilteredProducts();

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 max-w-7xl mx-auto px-3 sm:px-6 pt-2 sm:pt-4">
      {/* Mobile-Only Flipkart-Style Search Bar */}
      <section className="sm:hidden">
        <div
          onClick={() => setActivePage('search')}
          className="w-full bg-white border border-neutral-200/90 rounded-2xl px-3.5 py-2.5 shadow-2xs flex items-center justify-between gap-2.5 active:bg-neutral-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0 text-neutral-400">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <span className="text-xs text-neutral-500 font-normal truncate">
              Search wallpapers, Canva, status drops...
            </span>
          </div>
          <div className="h-6 px-2.5 bg-neutral-900 text-white rounded-full text-[11px] font-medium flex items-center shrink-0">
            Search
          </div>
        </div>
      </section>

      {/* 1. Category Quick Circles Strip */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-[#EEEEEE] py-2.5 sm:py-3 px-3 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none py-0.5">
          {CATEGORY_DEFINITIONS.map((cat) => {
            // Icon mapping with modern styling
            const renderIcon = () => {
              switch (cat.id) {
                case 'all':
                  return <Sparkles className="w-5 h-5 text-amber-500" />;
                case 'greeting_card':
                  return <Gift className="w-5 h-5 text-rose-500" />;
                case 'wallpaper':
                  return <Smartphone className="w-5 h-5 text-indigo-500" />;
                case 'poster':
                  return <Image className="w-5 h-5 text-teal-600" />;
                case 'drawing':
                  return <Palette className="w-5 h-5 text-pink-500" />;
                case 'whatsapp_status':
                  return <MessageCircle className="w-5 h-5 text-emerald-500" />;
                case 'profile_avatar':
                  return <UserCheck className="w-5 h-5 text-violet-500" />;
                case 'graphics':
                  return <Layers className="w-5 h-5 text-fuchsia-500" />;
                case 'ebook_pdf':
                  return <BookOpen className="w-5 h-5 text-blue-500" />;
                case 'canvas_template':
                  return <LayoutTemplate className="w-5 h-5 text-cyan-600" />;
                case 'insta_story':
                  return <Instagram className="w-5 h-5 text-purple-600" />;
                case 'ad_banner':
                  return <Flame className="w-5 h-5 text-orange-500" />;
                default:
                  return <Tag className="w-5 h-5 text-neutral-600" />;
              }
            };

            return (
              <button
                key={cat.id}
                onClick={() => {
                  openCategory(cat.id as ProductCategory);
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[1.5px] bg-gradient-to-tr from-neutral-200 via-neutral-100 to-neutral-200 group-hover:from-neutral-900 group-hover:to-neutral-700 transition-all shadow-2xs">
                  <div className="w-full h-full rounded-full bg-neutral-50 group-hover:bg-white flex items-center justify-center transition-colors">
                    <div className="group-hover:scale-110 transition-transform duration-200">
                      {renderIcon()}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-neutral-700 group-hover:text-black text-center whitespace-nowrap">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. 9:16 Stories & WhatsApp Status Reel Strip */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-[#EEEEEE] shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-neutral-800" />
            <h2 className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A]">
              9:16 Stories & WhatsApp Status
            </h2>
          </div>

          <button
            onClick={() => {
              openCategory('whatsapp_status');
            }}
            className="text-[11px] font-mono font-bold text-neutral-600 hover:text-black flex items-center gap-0.5 cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Story circles strip */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto pb-1 scrollbar-none">
          {storyProducts.map((story, index) => (
            <button
              key={story.id}
              onClick={() => setSelectedStoryIndex(index)}
              className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none cursor-pointer"
            >
              <div className="relative p-0.5 rounded-xl bg-gradient-to-tr from-[#F4ACB7] via-[#FFE5D9] to-[#D8E2DC] group-hover:scale-105 transition-transform shadow-xs">
                <div className="w-16 h-24 sm:w-18 sm:h-28 rounded-[10px] overflow-hidden bg-neutral-900 relative">
                  <img
                    src={story.previewImageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                    <span className="text-[8px] sm:text-[9px] font-medium text-white leading-tight line-clamp-2 text-left">
                      {story.title}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-700 group-hover:text-black max-w-[70px] truncate">
                {story.isFree ? 'FREE' : `₹${story.price}`}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Curated Vaults & Festive Drops */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Collections</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {FESTIVAL_COLLECTIONS.map((col, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (col.tag === 'free_drop') {
                  setFilterState((prev) => ({
                    ...prev,
                    priceType: 'free',
                    category: 'all',
                    format: 'all',
                    orientation: 'all',
                    festivalTag: '',
                    searchQuery: ''
                  }));
                  setActivePage('explore');
                } else if (
                  [
                    'wallpaper',
                    'poster',
                    'drawing',
                    'whatsapp_status',
                    'profile_avatar',
                    'graphics',
                    'ebook_pdf',
                    'greeting_card',
                    'canvas_template',
                    'insta_story',
                    'ad_banner'
                  ].includes(col.tag)
                ) {
                  openCategory(col.tag as ProductCategory);
                } else {
                  setFilterState((prev) => ({
                    ...prev,
                    festivalTag: col.tag,
                    category: 'all',
                    priceType: 'all',
                    searchQuery: ''
                  }));
                  setActivePage('explore');
                }
              }}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-[#EEEEEE] cursor-pointer aspect-4/3 flex flex-col justify-end p-2.5 transition-all"
            >
              <img
                src={col.image}
                alt={col.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="text-[8px] font-mono font-bold bg-[#FFE5D9] text-[#1A1A1A] px-1.5 py-0.2 rounded-full uppercase">
                  {col.count}+ Assets
                </span>
                <h3 className="font-serif font-bold text-xs sm:text-sm mt-0.5 leading-snug group-hover:text-[#FFE5D9] transition-colors">
                  {col.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Main Product Masonry Feed with Space-Efficient Multi-Columns */}
      <section className="pt-2">
        {/* Tab Selection Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#EEEEEE] pb-2.5 mb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                activeTab === 'trending'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#FAFAFA] text-neutral-600 hover:bg-[#EEEEEE]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('top_rated')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                activeTab === 'top_rated'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#FAFAFA] text-neutral-600 hover:bg-[#EEEEEE]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Top Rated</span>
            </button>

            <button
              onClick={() => setActiveTab('free')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                activeTab === 'free'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#FAFAFA] text-neutral-600 hover:bg-[#EEEEEE]'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-emerald-500" />
              <span>Free Drops</span>
            </button>

            <button
              onClick={() => setActiveTab('festive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                activeTab === 'festive'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#FAFAFA] text-neutral-600 hover:bg-[#EEEEEE]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Festive</span>
            </button>

            <button
              onClick={() => setActiveTab('pro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                activeTab === 'pro'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#FAFAFA] text-neutral-600 hover:bg-[#EEEEEE]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE5D9]" />
              <span className="font-serif italic">Pro Only</span>
            </button>
          </div>

          <button
            onClick={() => setActivePage('explore')}
            className="text-xs font-mono font-bold text-neutral-800 hover:text-black flex items-center gap-1 shrink-0"
          >
            <span>ALL ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Space-Efficient Pinterest Multi-Column Masonry Feed (No row gaps, zero wasted space) */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-4 xl:columns-5 gap-2.5 sm:gap-3.5 [column-fill:_balance]">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} layoutStyle="pinterest" />
          ))}
        </div>
      </section>

      {/* Story Full Screen Modal */}
      {selectedStoryIndex !== null && (
        <StoryPreviewModal
          stories={storyProducts}
          initialIndex={selectedStoryIndex}
          isOpen={selectedStoryIndex !== null}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </div>
  );
};
