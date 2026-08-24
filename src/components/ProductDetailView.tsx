import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { downloadDigitalAsset } from '../utils/watermark';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Zap,
  Download,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
  FileCheck,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  ThumbsUp,
  Send,
  MessageSquareQuote,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DigitalProduct } from '../types';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    setActivePage,
    products,
    reviews: allReviews,
    isWishlisted,
    isPurchased,
    toggleWishlist,
    addToCart,
    openRazorpayForProduct,
    claimFreeProduct,
    openProductDetail,
    addReview,
    user,
    showToast,
    openCategory
  } = useApp();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500 text-sm mb-4">No product selected.</p>
        <button
          onClick={() => setActivePage('home')}
          className="bg-[#1A1A1A] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const product = selectedProduct;
  const purchased = isPurchased(product.id);
  const wishlisted = isWishlisted(product.id);

  // Check if product is PDF, eBook, handbook, or guide
  const isPdfOrEbook =
    product.format === 'PDF' ||
    product.category === 'ebook_pdf' ||
    product.title.toLowerCase().includes('pdf') ||
    product.title.toLowerCase().includes('ebook') ||
    product.title.toLowerCase().includes('guide') ||
    product.title.toLowerCase().includes('handbook') ||
    product.tags.some((t) => ['pdf', 'ebook', 'guide', 'handbook', 'workbook'].includes(t.toLowerCase()));

  // Reviews for this product
  const productReviews = allReviews[product.id] || [];
  const totalReviewsCount = productReviews.length > 0 ? productReviews.length : (product.reviewCount || 34);

  // Similar products for bottom sliding carousel (properly deduplicated)
  const similarProducts: DigitalProduct[] = Array.from(
    new Map<string, DigitalProduct>(
      products
        .filter((p) => p.id !== product.id)
        .sort((a, b) => {
          const aScore = (a.category === product.category ? 2 : 0) + (a.format === product.format ? 1 : 0);
          const bScore = (b.category === product.category ? 2 : 0) + (b.format === product.format ? 1 : 0);
          return bScore - aScore;
        })
        .map((p) => [p.id, p] as const)
    ).values()
  ).slice(0, 10);

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(10);
    showToast('Starting 4K Download', `Downloading high resolution ${product.format}...`, 'info');

    const success = await downloadDigitalAsset(product, undefined, (p) => setDownloadProgress(p));
    setIsDownloading(false);
    setDownloadProgress(0);

    if (success) {
      showToast('Download Complete 🚀', `"${product.title}" saved successfully with clean 4K resolution.`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.title,
          text: `Check out ${product.title} on DigiVault:`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Link Copied 📋', 'Product link copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setIsSubmittingReview(true);
    addReview(product.id, userRating, userComment.trim());
    setUserComment('');
    setIsSubmittingReview(false);
    showToast('Review Published ⭐', 'Thank you for sharing your feedback with the community!');
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
    showToast('Marked as Helpful', 'Thank you for your feedback.', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 space-y-8 animate-fadeIn">
      {/* Top Floating Navigation Bar (Pinterest inspired) */}
      <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
        <button
          onClick={() => setActivePage('home')}
          className="group flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-700 hover:text-black bg-white hover:bg-[#F5F5F5] px-4 py-2 rounded-full border border-[#EEEEEE] transition-all shadow-2xs hover:shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white hover:bg-[#F5F5F5] border border-[#EEEEEE] text-neutral-700 transition-all shadow-2xs hover:shadow-xs active:scale-95 relative"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-full mt-2 bg-[#1A1A1A] text-white text-[10px] px-2 py-1 rounded-md font-mono whitespace-nowrap z-30"
                >
                  Link Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2.5 rounded-full border transition-all shadow-2xs hover:shadow-xs active:scale-95 ${
              wishlisted
                ? 'bg-[#F4ACB7] border-[#F4ACB7] text-[#1A1A1A]'
                : 'bg-white hover:bg-[#F5F5F5] border-[#EEEEEE] text-neutral-700'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Pinterest Full Bleed Asset + Right Purchase and Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Column: Pinterest-Style Clean Image Frame */}
        <div className="md:col-span-6 lg:col-span-7 flex justify-center">
          <div className="w-full rounded-3xl overflow-hidden bg-neutral-900 border border-[#EEEEEE] shadow-sm relative group">
            {/* Format Floating Badge */}
            <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="w-3 h-3 text-[#FFE5D9]" />
              <span>{product.format}</span>
              <span className="text-white/40">•</span>
              <span>{product.fileDimensions}</span>
            </div>

            {/* Main Clean Image */}
            <motion.img
              initial={{ scale: 0.98, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.fullResImageUrl || product.previewImageUrl}
              alt={product.title}
              className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Right Column: Clean Purchase & Product Info */}
        <div className="md:col-span-6 lg:col-span-5 space-y-5">
          {/* Header Info - Minimal & Clean */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
              <button
                onClick={() => openCategory(product.category)}
                className="capitalize font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              >
                {product.category.replace('_', ' ')}
              </button>
              <span>•</span>
              <span className="text-neutral-500">{product.format}</span>
              <span>•</span>
              <span className="text-neutral-500">{product.fileSize}</span>
              {isPdfOrEbook && (
                <>
                  <span>•</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1">
                    <BookOpen className="w-2.5 h-2.5" />
                    <span>PDF Guide</span>
                  </span>
                </>
              )}
            </div>

            <h1 className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug tracking-tight">
              {product.title}
            </h1>

            <p className="text-xs text-neutral-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Minimal Aesthetic Pricing & Action Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#EEEEEE] space-y-3.5 shadow-2xs">
            {/* Price & Tag Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.isFree ? (
                  <span className="text-lg font-semibold text-neutral-900 tracking-tight">
                    Free
                  </span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-neutral-900 tracking-tight">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-xs font-mono text-neutral-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                <Zap className="w-3 h-3 text-neutral-400" />
                <span>Instant Access</span>
              </div>
            </div>

            {/* Action State */}
            {purchased ? (
              /* Already In Vault State */
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1 px-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>In your Vault</span>
                  </div>

                  {/* Minimal Download Button with count */}
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-all shadow-2xs active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? `Downloading...` : 'Download'}</span>
                    <span className="text-[10px] text-neutral-300 font-mono pl-1 border-l border-neutral-700">
                      {(product.downloadCount || 1240).toLocaleString()}
                    </span>
                  </button>
                </div>

                {product.canvaEditableUrl && (
                  <a
                    href={product.canvaEditableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium text-xs py-2 px-3 rounded-xl border border-neutral-200/60 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-neutral-500" />
                    <span>Open in Canva Template Editor</span>
                  </a>
                )}
              </div>
            ) : product.isFree ? (
              /* Free Product State: Minimal Clean Download */
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-500">Free download</span>

                <button
                  onClick={() => claimFreeProduct(product)}
                  className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-all shadow-2xs active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                  <span className="text-[10px] text-neutral-300 font-mono pl-1 border-l border-neutral-700">
                    {(product.downloadCount || 1240).toLocaleString()}
                  </span>
                </button>
              </div>
            ) : (
              /* Paid Product State: Clean Checkout + Cart + Wishlist */
              <div className="space-y-2">
                <button
                  onClick={() => openRazorpayForProduct(product)}
                  className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.99]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Buy Now • ₹{product.price}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium py-2 px-3 rounded-xl border border-neutral-200/60 flex items-center justify-center gap-1.5 transition-colors text-xs active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`px-3 py-2 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${
                      wishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/60 text-neutral-600'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Subtle Minimal Metadata List */}
            <div className="pt-2 border-t border-[#F5F5F5] flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-y-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-neutral-400" />
                <span>Commercial use</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-neutral-400" />
                <span>Original {product.format}</span>
              </span>
              <span className="flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-neutral-400" />
                <span>Lifetime access</span>
              </span>
            </div>
          </div>

          {/* Slide-up & Close-down Review Card (Appears ONLY on PDF / eBook products) */}
          {isPdfOrEbook && (
            <div className="rounded-3xl bg-white border border-[#EEEEEE] shadow-2xs overflow-hidden transition-all">
              {/* Expandable Accordion Header */}
              <button
                onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFE5D9] flex items-center justify-center text-[#7A4B3A]">
                    <MessageSquareQuote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <span>Reader Reviews & Verified Feedback</span>
                      <span className="text-[10px] font-mono font-bold bg-[#FAFAFA] text-neutral-600 border border-[#EEEEEE] px-2 py-0.2 rounded-full">
                        {productReviews.length}
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Ratings and real testimonials from verified PDF downloaders
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <div className="p-1 rounded-full bg-[#FAFAFA] border border-[#EEEEEE] text-neutral-500">
                    {isReviewsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Slide up / Close down Animated Reviews Content */}
              <AnimatePresence initial={false}>
                {isReviewsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-[#F0F0F0] px-4 sm:px-5 pb-5 pt-3 space-y-4"
                  >
                    {/* List of Verified Reviews */}
                    <div className="space-y-3">
                      {productReviews.length > 0 ? (
                        productReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#EEEEEE] space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={rev.userAvatar}
                                  alt={rev.userName}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#1A1A1A]">{rev.userName}</span>
                                    {rev.verifiedPurchase && (
                                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full font-bold">
                                        Verified Buyer
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-neutral-400">{rev.date}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>

                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => toggleHelpful(rev.id)}
                                className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-black transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>Helpful ({rev.helpfulCount + (helpfulCounts[rev.id] || 0)})</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-xs text-neutral-400">
                          No reviews yet for this guide. Be the first to share your thoughts!
                        </div>
                      )}
                    </div>

                    {/* Write a Review Box */}
                    <form onSubmit={handleReviewSubmit} className="pt-2 border-t border-[#F0F0F0] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A1A1A]">Rate this eBook / PDF</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setUserRating(num)}
                              className="p-0.5 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  num <= userRating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          placeholder="Share how helpful this PDF was..."
                          className="flex-1 bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#1A1A1A] transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingReview || !userComment.trim()}
                          className="bg-[#1A1A1A] hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Smart Sliding Suggestions Carousel (Pinterest inspired) */}
      {similarProducts.length > 0 && (
        <div className="pt-8 border-t border-[#EEEEEE] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                <span>More to Explore</span>
                <span className="text-[11px] font-mono text-neutral-500 font-normal">
                  (Smart Recommendations)
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                Curated visual drops similar to <span className="italic">"{product.title.slice(0, 24)}..."</span>
              </p>
            </div>

            {/* Sliding Control Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-full bg-white hover:bg-[#F5F5F5] border border-[#EEEEEE] text-neutral-700 transition-colors shadow-2xs active:scale-90"
                aria-label="Previous suggestions"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-full bg-white hover:bg-[#F5F5F5] border border-[#EEEEEE] text-neutral-700 transition-colors shadow-2xs active:scale-90"
                aria-label="Next suggestions"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smooth Sliding Track */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {similarProducts.map((simProduct) => (
              <motion.div
                key={simProduct.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  openProductDetail(simProduct);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-56 sm:w-64 shrink-0 snap-start bg-white rounded-3xl border border-[#EEEEEE] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-4/5 w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={simProduct.previewImageUrl}
                    alt={simProduct.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                    {simProduct.format}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-1.5 rounded-full bg-white/90 text-neutral-800 shadow-md flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#7A4B3A] bg-[#FFE5D9] px-2 py-0.2 rounded-full inline-block">
                      {simProduct.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] line-clamp-1 group-hover:text-neutral-700 transition-colors">
                      {simProduct.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F5]">
                    <div className="flex items-center gap-1 font-serif font-bold text-xs text-[#1A1A1A]">
                      {simProduct.isFree ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        <span>₹{simProduct.price}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 text-[10px] font-mono text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{simProduct.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
