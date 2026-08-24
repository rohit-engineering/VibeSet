import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Zap,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    openRazorpayForCart,
    setActivePage,
    openProductDetail,
    showToast
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  const rawTotal = cart.reduce((sum, item) => sum + item.product.price, 0);
  const totalOriginalPrice = cart.reduce((sum, item) => sum + item.product.originalPrice, 0);
  const discountAmount = appliedDiscount
    ? Math.round((rawTotal * appliedDiscount.percent) / 100)
    : 0;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'DIGI50') {
      setAppliedDiscount({ code: 'DIGI50', percent: 50 });
      showToast('🎉 Coupon Applied!', '50% Extra Discount unlocked on your digital bundle.');
    } else if (code === 'VIP20') {
      setAppliedDiscount({ code: 'VIP20', percent: 20 });
      showToast('🎉 Coupon Applied!', '20% Extra Discount unlocked.');
    } else {
      showToast('Invalid Coupon', 'Try using code "DIGI50" for 50% discount.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-[#FAFAFA] text-[#1A1A1A] rounded-full flex items-center justify-center mx-auto border border-[#EEEEEE]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Your Digital Cart is Empty</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Explore curated 4K wallpapers, WhatsApp statuses, Canva kits, and festive digital drops ready for instant download.
        </p>
        <button
          onClick={() => setActivePage('explore')}
          className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs px-6 py-3 rounded-full shadow-sm transition-all inline-flex items-center gap-2"
        >
          <span>Explore Digital Marketplace</span>
          <ArrowRight className="w-4 h-4 text-[#FFE5D9]" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('explore')}
            className="p-1 rounded-full hover:bg-[#FAFAFA] text-neutral-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1A1A1A]">Digital Cart Checkout</h1>
            <p className="text-xs font-mono text-neutral-500">{cart.length} Digital Asset(s) Selected</p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-mono text-rose-600 hover:text-rose-700"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {cart.map(({ product }) => (
            <div
              key={product.id}
              className="bg-white p-3.5 sm:p-4 rounded-3xl border border-[#EEEEEE] shadow-xs flex items-center justify-between gap-3 hover:border-black/20 transition-colors"
            >
              <div
                onClick={() => openProductDetail(product)}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <img
                  src={product.previewImageUrl}
                  alt={product.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-neutral-900 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-600 uppercase">
                    <span className="bg-[#D8E2DC] text-[#2C4A3E] px-2 py-0.2 rounded-full font-medium">{product.category.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="bg-[#F0F0F0] text-neutral-700 px-1.5 py-0.2 rounded-full">
                      {product.format}
                    </span>
                  </div>
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A] truncate mt-1">
                    {product.title}
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    {product.fileDimensions} • Instant 4K Delivery
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-sm sm:text-base font-serif font-bold text-[#1A1A1A] block">
                    {product.isFree ? 'FREE' : `₹${product.price}`}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs font-mono text-neutral-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-neutral-400 hover:text-rose-500 p-1 transition-colors"
                  title="Remove from Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary & Razorpay Checkout Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Promo Code Box */}
          <div className="bg-white p-5 rounded-3xl border border-[#EEEEEE] shadow-xs">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Apply Promo Code
            </label>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Try code DIGI50 (50% OFF)"
                className="flex-1 text-xs p-2.5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-full focus:outline-none focus:border-black uppercase font-mono font-medium text-[#1A1A1A] px-3.5"
              />
              <button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs px-4 py-2.5 rounded-full transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedDiscount && (
              <div className="mt-2.5 bg-[#D8E2DC] text-[#2C4A3E] p-2.5 rounded-2xl text-xs font-medium flex items-center justify-between border border-[#C2D4C8]">
                <span>Code <strong>{appliedDiscount.code}</strong> Applied ({appliedDiscount.percent}% OFF)</span>
                <button
                  onClick={() => setAppliedDiscount(null)}
                  className="text-rose-600 hover:underline text-[11px] font-mono"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Flipkart-style Price Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-[#EEEEEE] shadow-xs space-y-3">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Price Details ({cart.length} Digital Items)
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-600 font-mono">
                <span>Total Digital MRP:</span>
                <span className="line-through">₹{totalOriginalPrice}</span>
              </div>

              <div className="flex items-center justify-between text-[#2C4A3E] font-mono font-medium">
                <span>Store Discount:</span>
                <span>-₹{totalOriginalPrice - rawTotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#2C4A3E] font-mono font-medium">
                  <span>Coupon Discount ({appliedDiscount?.code}):</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-600 font-mono">
                <span>Digital Delivery & Cloud CDN:</span>
                <span className="text-[#2C4A3E] font-bold">FREE (0s Wait)</span>
              </div>

              <div className="border-t border-[#EEEEEE] pt-2 flex items-center justify-between text-sm font-serif font-bold text-[#1A1A1A]">
                <span>Total Amount:</span>
                <span className="text-lg font-serif text-[#1A1A1A]">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Razorpay Instant Checkout Button */}
            <button
              onClick={openRazorpayForCart}
              className="w-full bg-[#1A1A1A] hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm py-3.5 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#FFE5D9] fill-[#FFE5D9]" />
              <span>Complete Order with Razorpay (₹{finalTotal.toFixed(2)})</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 pt-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C4A3E]" />
              <span>Instant Digital License • Lifetime 4K Re-download Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
