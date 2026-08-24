import React from 'react';
import { useApp } from '../context/AppContext';
import { PRO_MEMBERSHIP_PLANS } from '../data/initialProducts';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Download,
  ShieldCheck,
  Crown,
  Layers,
  Infinity,
  ArrowRight
} from 'lucide-react';

export const ProSubscriptionPage: React.FC = () => {
  const { openRazorpayForSubscription, user, setActivePage } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 pb-24 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-[#FFE5D9] text-[#7A4B3A] font-mono font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#F4ACB7]/30">
          <Crown className="w-3.5 h-3.5" />
          PIXELPASS CREATOR CLUB
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
          Unlimited Access to 10,000+ Digital Assets
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
          Skip paying per file. Download unlimited 4K WhatsApp video statuses, Canva social media kits, Diwali graphics, and PSD mockups with full commercial licenses.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {PRO_MEMBERSHIP_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all relative ${
              plan.id === 'pro_annual'
                ? 'bg-[#1A1A1A] text-white shadow-xl border border-[#333333]'
                : 'bg-white text-[#1A1A1A] shadow-sm border border-[#EEEEEE] hover:border-black/30'
            }`}
          >
            {plan.id === 'pro_annual' && (
              <div className="absolute -top-3.5 right-6 bg-[#FFE5D9] text-[#7A4B3A] font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-[#F4ACB7]/40">
                🔥 MOST POPULAR • SAVE 58%
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl">{plan.name}</h3>
                  <p className={`text-xs font-mono mt-0.5 ${plan.id === 'pro_annual' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {plan.duration}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase ${
                    plan.id === 'pro_annual'
                      ? 'bg-[#FFE5D9] text-[#7A4B3A]'
                      : 'bg-[#FAFAFA] text-neutral-700 border border-[#EEEEEE]'
                  }`}
                >
                  {plan.badge}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-6">
                <span className="font-serif text-4xl font-bold">₹{plan.price}</span>
                <span className={`text-sm font-mono line-through ${plan.id === 'pro_annual' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  ₹{plan.originalPrice}
                </span>
                <span className="text-xs font-mono font-bold text-[#2C4A3E]">
                  Instant Access
                </span>
              </div>

              {/* Perks List */}
              <ul className="space-y-3 mt-8 text-xs font-sans">
                {plan.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.id === 'pro_annual' ? 'text-[#FFE5D9]' : 'text-[#2C4A3E]'
                      }`}
                    />
                    <span className={plan.id === 'pro_annual' ? 'text-neutral-300' : 'text-neutral-700'}>
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Action Button */}
            <button
              onClick={() => openRazorpayForSubscription(plan.id, plan.name, plan.price)}
              className={`w-full font-medium text-xs sm:text-sm py-3.5 rounded-full shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                plan.id === 'pro_annual'
                  ? 'bg-[#FFE5D9] hover:bg-[#ffdac8] text-[#7A4B3A]'
                  : 'bg-[#1A1A1A] hover:bg-neutral-800 text-white'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Subscribe Now via Razorpay (₹{plan.price})</span>
            </button>
          </div>
        ))}
      </div>

      {/* Pro Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-4xl mx-auto">
        <div className="p-5 bg-white rounded-3xl border border-[#EEEEEE] space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#FFE5D9] text-[#7A4B3A] flex items-center justify-center font-bold">
            <Infinity className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Zero Download Limits</h4>
          <p className="text-xs text-neutral-500 font-sans">
            Download 50 or 500 files a day. No bandwidth throttling or speed caps.
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#EEEEEE] space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#D8E2DC] text-[#2C4A3E] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Commercial Client Resell</h4>
          <p className="text-xs text-neutral-500 font-sans">
            Use all assets for paid client branding, YouTube banners, and ad campaigns.
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#EEEEEE] space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#F4ACB7]/20 text-[#8B4254] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Canva Direct Link Clones</h4>
          <p className="text-xs text-neutral-500 font-sans">
            Get instant editable Canva templates straight into your Canva account.
          </p>
        </div>
      </div>
    </div>
  );
};
