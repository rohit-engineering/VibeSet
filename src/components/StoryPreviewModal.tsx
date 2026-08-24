import React, { useState, useEffect } from 'react';
import { DigitalProduct } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Zap,
  Download,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { downloadDigitalAsset } from '../utils/watermark';

interface StoryPreviewModalProps {
  stories: DigitalProduct[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const StoryPreviewModal: React.FC<StoryPreviewModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose
}) => {
  const {
    openRazorpayForProduct,
    claimFreeProduct,
    isPurchased,
    toggleWishlist,
    isWishlisted,
    watermarkShield,
    showToast
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentStory = stories[currentIndex] || stories[0];

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, isPaused, stories.length, onClose]);

  if (!isOpen || !currentStory) return null;

  const purchased = isPurchased(currentStory.id);
  const wishlisted = isWishlisted(currentStory.id);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentStory.title,
        text: `Check out this 4K WhatsApp status: ${currentStory.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied 📋', 'Shareable link copied to clipboard.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 backdrop-blur-lg animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close story preview"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Left / Right */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
        aria-label="Previous story"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex === stories.length - 1}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
        aria-label="Next story"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 9:16 Story Frame */}
      <div
        className="relative w-full max-w-[400px] h-[85vh] max-h-[750px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/15 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Story Header */}
        <div className="relative z-30 pt-6 px-4 pb-2 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.creator.avatar}
              alt={currentStory.creator.name}
              className="w-8 h-8 rounded-full border border-white/50 object-cover"
            />
            <div>
              <p className="text-xs font-serif font-bold text-white leading-tight">{currentStory.creator.name}</p>
              <p className="text-[10px] font-mono text-white/70">WhatsApp & Story Drops</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Story Image / Backdrop with Watermark */}
        <div className="absolute inset-0 z-10 overflow-hidden bg-black">
          <img
            src={currentStory.fullResImageUrl || currentStory.previewImageUrl}
            alt={currentStory.title}
            className="w-full h-full object-cover select-none"
          />

          {watermarkShield && !purchased && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-8 rotate-[-30deg] scale-125 opacity-30">
              <div className="text-white text-xs font-mono font-bold uppercase tracking-widest text-center">
                DIGIVAULT 9:16 PREVIEW • BUY TO GET CLEAN 4K
              </div>
              <div className="text-white text-xs font-mono font-bold uppercase tracking-widest text-center">
                DIGIVAULT 9:16 PREVIEW • BUY TO GET CLEAN 4K
              </div>
              <div className="text-white text-xs font-mono font-bold uppercase tracking-widest text-center">
                DIGIVAULT 9:16 PREVIEW • BUY TO GET CLEAN 4K
              </div>
            </div>
          )}
        </div>

        {/* Bottom Story Footer with Instant Action */}
        <div className="relative z-30 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono bg-[#FFE5D9] text-[#7A4B3A] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                9:16 Story & Status
              </span>
              <h4 className="text-white font-serif font-bold text-sm line-clamp-1 mt-1">{currentStory.title}</h4>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => toggleWishlist(currentStory.id)}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  wishlisted ? 'bg-[#F4ACB7] text-[#7A4B3A]' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Button */}
          {purchased ? (
            <button
              onClick={() => downloadDigitalAsset(currentStory)}
              className="w-full bg-white hover:bg-neutral-100 text-[#1A1A1A] font-medium py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Clean 4K File</span>
            </button>
          ) : currentStory.isFree ? (
            <button
              onClick={() => claimFreeProduct(currentStory)}
              className="w-full bg-[#D8E2DC] hover:bg-[#c6d6cb] text-[#2C4A3E] font-medium py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-xs font-mono"
            >
              <Download className="w-4 h-4" />
              <span>Claim Free 4K Download</span>
            </button>
          ) : (
            <button
              onClick={() => openRazorpayForProduct(currentStory)}
              className="w-full bg-[#FFE5D9] hover:bg-[#ffdac8] text-[#7A4B3A] font-medium py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 text-xs font-mono font-bold"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Instant Buy ₹{currentStory.price} (Razorpay)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
