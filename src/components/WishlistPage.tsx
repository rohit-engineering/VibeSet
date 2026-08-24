import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Heart,
  ShoppingCart,
  ArrowRight,
  Trash2,
  Sparkles
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlistIds,
    products,
    setActivePage,
    addToCart,
    toggleWishlist,
    showToast
  } = useApp();

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((p) => {
      addToCart(p);
    });
    showToast('All Items Added 🛒', 'All wishlisted items moved to your digital cart.');
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-[#FFE5D9] text-[#7A4B3A] rounded-full flex items-center justify-center mx-auto border border-[#F4ACB7]/40">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Your Saved Wishlist is Empty</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Tap the heart icon on any WhatsApp status, Canva kit, or 4K wallpaper to save it here for later.
        </p>
        <button
          onClick={() => setActivePage('explore')}
          className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs px-6 py-3 rounded-full shadow-sm transition-all inline-flex items-center gap-2"
        >
          <span>Discover Digital Drops</span>
          <ArrowRight className="w-4 h-4 text-[#FFE5D9]" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEEEEE] pb-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#F4ACB7] fill-[#F4ACB7]" />
            <span>My Saved Drops</span>
            <span className="text-xs font-mono font-bold bg-[#FFE5D9] text-[#7A4B3A] px-2.5 py-0.5 rounded-full">
              {wishlistedProducts.length} Items
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Your saved digital products ready to buy or download anytime
          </p>
        </div>

        <button
          onClick={handleAddAllToCart}
          className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs px-4 py-2.5 rounded-full shadow-xs flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4 text-[#FFE5D9]" />
          <span>Add All to Cart</span>
        </button>
      </div>

      {/* Space-efficient Masonry Grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2.5 sm:gap-3.5 [column-fill:_balance]">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} layoutStyle="pinterest" />
        ))}
      </div>
    </div>
  );
};
