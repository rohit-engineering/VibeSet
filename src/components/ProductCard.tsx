import React from 'react';
import { DigitalProduct } from '../types';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: DigitalProduct;
  layoutStyle?: 'pinterest' | 'compact' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layoutStyle = 'pinterest' }) => {
  const {
    openProductDetail,
    toggleWishlist,
    isWishlisted,
    isPurchased
  } = useApp();

  const wishlisted = isWishlisted(product.id);
  const purchased = isPurchased(product.id);

  // Aspect ratio classes for Pinterest-style image masonry & grid
  const getAspectRatioClass = () => {
    if (layoutStyle === 'compact') return 'aspect-square';
    if (product.orientation === 'portrait_9_16') return 'aspect-[9/16]';
    if (product.orientation === 'square_1_1') return 'aspect-square';
    if (product.orientation === 'landscape_16_9') return 'aspect-[16/10]';
    return 'aspect-[4/5]';
  };

  return (
    <div
      onClick={() => openProductDetail(product)}
      className={`break-inside-avoid inline-block w-full ${getAspectRatioClass()} rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 cursor-pointer select-none border border-black/5 hover:border-black/15 shadow-xs hover:shadow-md transition-all group relative mb-3 sm:mb-4`}
    >
      {/* 1. Full-bleed Image */}
      <img
        src={product.previewImageUrl}
        alt={product.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
      />

      {/* 2. Wishlist Heart Button - Top Right */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-xs ${
            wishlisted
              ? 'bg-[#F4ACB7] text-[#1A1A1A]'
              : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current text-[#1A1A1A]' : ''}`} />
        </button>
      </div>

      {/* 3. Price / Free Badge - Bottom Left */}
      <div className="absolute bottom-2.5 left-2.5 z-10">
        {purchased ? (
          <span className="bg-[#D8E2DC]/95 backdrop-blur-md text-[#2C4A3E] font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
            Unlocked
          </span>
        ) : product.isFree ? (
          <span className="bg-[#D8E2DC]/95 backdrop-blur-md text-[#2C4A3E] font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
            FREE
          </span>
        ) : (
          <span className="bg-white/95 backdrop-blur-md text-[#1A1A1A] font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">
            ₹{product.price}
          </span>
        )}
      </div>
    </div>
  );
};
