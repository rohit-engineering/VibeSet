import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Sparkles,
  LogOut,
  Download,
  Flame,
  ChevronDown,
  Compass,
  X
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../data/initialProducts';

export const Navbar: React.FC = () => {
  const {
    user,
    cart,
    wishlistIds,
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    setFilterState,
    setIsAuthModalOpen,
    logoutUser,
    products,
    openProductDetail,
    openCategory
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isDetailPage = activePage === 'product_detail';

  // Auto-suggest matches
  const searchSuggestions = searchQuery.trim().length > 1
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilterState((prev) => ({ ...prev, searchQuery: searchQuery.trim() }));
      setActivePage('explore');
      setIsSearchFocused(false);
    }
  };

  const handleCategorySelect = (catId: string) => {
    openCategory(catId as any);
    setIsCategoryMenuOpen(false);
  };

  // Completely hide top navbar on mobile screens (< sm) from every page
  return (
    <header className="hidden sm:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EEEEEE]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Desktop Brand Logo & Explore Dropdown */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-xs">
              <span className="font-serif italic font-bold text-base text-[#FFE5D9]">d</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1A1A1A]">
                digivault<span className="text-[#F4ACB7]">.</span>
              </span>
            </div>
          </button>

          {/* Quick Category Dropdown (Desktop) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-black bg-[#FAFAFA] hover:bg-[#F0F0F0] px-3 py-1.5 rounded-full border border-[#EEEEEE] transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            <AnimatePresence>
              {isCategoryMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EEEEEE] py-2 z-50"
                >
                  <p className="px-3.5 py-1 text-[10px] font-bold uppercase text-neutral-400 font-mono tracking-wider">
                    Curated Categories
                  </p>
                  {CATEGORY_DEFINITIONS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAFAFA] hover:text-black flex items-center justify-between transition-colors"
                    >
                      <span>{cat.label}</span>
                      {cat.badge && (
                        <span className="text-[9px] font-mono bg-[#FFE5D9] text-[#7A4B3A] px-1.5 py-0.2 rounded-full font-bold">
                          {cat.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Animated Search Bar (Centered on Desktop, full width on Mobile home/explore) */}
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 max-w-lg relative"
        >
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <motion.div
              animate={{
                scale: isSearchFocused ? 1.01 : 1,
                boxShadow: isSearchFocused
                  ? '0 0 0 2px rgba(26,26,26,0.1), 0 4px 12px rgba(0,0,0,0.05)'
                  : '0 1px 2px rgba(0,0,0,0.03)'
              }}
              transition={{ duration: 0.2 }}
              className="w-full relative flex items-center rounded-full bg-[#FAFAFA] border border-[#EEEEEE]"
            >
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search 4K wallpapers, Canva kits, WhatsApp drops..."
                className="w-full bg-transparent text-[#1A1A1A] placeholder:text-neutral-400 text-xs sm:text-sm pl-10 pr-20 py-2 sm:py-2.5 rounded-full transition-all outline-hidden"
              />

              <div className="absolute right-1.5 flex items-center gap-1">
                {searchQuery.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterState((prev) => ({ ...prev, searchQuery: '' }));
                    }}
                    className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-neutral-800 text-white text-[11px] font-medium px-3 py-1.5 rounded-full transition-all shadow-xs"
                >
                  Search
                </motion.button>
              </div>
            </motion.div>
          </form>

          {/* Auto suggestions Dropdown with Motion Animation */}
          <AnimatePresence>
            {isSearchFocused && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#EEEEEE] py-2 z-50 overflow-hidden"
              >
                <div className="px-3.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase font-mono tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>Instant Drops</span>
                </div>
                {searchSuggestions.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ backgroundColor: '#FAFAFA' }}
                    onClick={() => {
                      openProductDetail(item);
                      setIsSearchFocused(false);
                    }}
                    className="w-full px-3.5 py-2 hover:bg-[#FAFAFA] flex items-center gap-2.5 text-left transition-colors border-b border-[#F5F5F5] last:border-0"
                  >
                    <img
                      src={item.previewImageUrl}
                      alt={item.title}
                      className="w-8 h-8 rounded-lg object-cover bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1A1A1A] truncate">{item.title}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                        <span className="capitalize">{item.category.replace('_', ' ')}</span>
                        <span>•</span>
                        <span className="font-mono font-bold text-[#1A1A1A]">{item.isFree ? 'FREE' : `₹${item.price}`}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Navigation Actions (Wishlist, Cart, User Profile) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={() => setActivePage('wishlist')}
            className={`relative p-2 rounded-full text-neutral-700 hover:bg-[#FAFAFA] transition-colors ${
              activePage === 'wishlist' ? 'bg-[#FFE5D9] text-[#1A1A1A]' : ''
            }`}
            aria-label="Wishlist"
            title="Saved Items"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#F4ACB7] text-[#1A1A1A] text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setActivePage('cart')}
            className={`relative p-2 rounded-full text-neutral-700 hover:bg-[#FAFAFA] transition-colors ${
              activePage === 'cart' ? 'bg-[#D8E2DC] text-[#1A1A1A]' : ''
            }`}
            aria-label="Shopping Cart"
            title="Digital Cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#1A1A1A] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          <div ref={userMenuRef} className="relative">
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-full hover:bg-[#FAFAFA] transition-colors border border-[#EEEEEE]"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 sm:w-7 sm:h-7 rounded-full object-cover"
                />
                <span className="hidden sm:inline text-xs font-semibold text-neutral-800 truncate max-w-[80px]">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isUserMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EEEEEE] py-2 z-50"
                >
                  <div className="px-3.5 py-2.5 border-b border-[#F0F0F0] bg-[#FAFAFA] rounded-t-2xl">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{user.name}</p>
                      {user.isProMember && (
                        <span className="bg-[#FFE5D9] text-[#7A4B3A] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActivePage('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAFAFA] hover:text-black flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-neutral-600" />
                      <span>My Digital Vault ({user.purchasedProductIds.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('pro_subscription');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAFAFA] hover:text-black flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-serif italic">PixelPass Membership</span>
                    </button>
                  </div>

                  <div className="border-t border-[#F0F0F0] pt-1">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
