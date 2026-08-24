import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { downloadDigitalAsset, generateDigitalInvoice } from '../utils/watermark';
import { getDiceBearAvatar, AVATAR_STYLES, DiceBearStyle } from '../utils/avatar';
import {
  User,
  Download,
  Sparkles,
  FileText,
  CreditCard,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Package,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
  ChevronRight,
  Dices,
  Palette,
  Check
} from 'lucide-react';
import { PRO_MEMBERSHIP_PLANS } from '../data/initialProducts';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileDashboard: React.FC = () => {
  const {
    user,
    products,
    orders,
    logoutUser,
    setIsAuthModalOpen,
    setActivePage,
    openRazorpayForSubscription,
    showToast,
    openProductDetail,
    recordDownload,
    updateUserAvatar
  } = useApp();

  const [activeTab, setActiveTab] = useState<'downloads' | 'purchases' | 'subscription'>('downloads');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isAvatarStudioOpen, setIsAvatarStudioOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<DiceBearStyle>('bottts');
  const [avatarSeed, setAvatarSeed] = useState(() => user?.email?.split('@')[0] || 'digivault');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-white text-neutral-900 rounded-full flex items-center justify-center mx-auto border border-neutral-200 shadow-2xs">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Sign in to Access Your Vault</h2>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
          Sign in to view your downloaded 4K files, purchase receipts, and PixelPass subscription.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full max-w-xs mx-auto bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs py-3 rounded-full shadow-2xs transition-all cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Get purchased products list
  const purchasedProducts = products.filter((p) =>
    user.purchasedProductIds.includes(p.id)
  );

  // Download history fallback or user's tracked downloads
  const downloadItems = user.downloadHistory && user.downloadHistory.length > 0
    ? user.downloadHistory
    : purchasedProducts.map((p, idx) => ({
        id: `hist-${p.id}-${idx}`,
        productId: p.id,
        title: p.title,
        format: p.format,
        fileSize: p.fileSize,
        downloadedAt: 'Recent Download',
        previewUrl: p.previewImageUrl
      }));

  const handleDownloadItem = async (product: any) => {
    if (downloadingId) return;
    setDownloadingId(product.id || product.productId);
    showToast('Downloading 4K Asset', `Fetching clean source file for "${product.title}"...`, 'info');

    const target = products.find((p) => p.id === (product.id || product.productId)) || product;
    await downloadDigitalAsset(target);
    recordDownload(target);

    setDownloadingId(null);
    showToast('Downloaded! 📥', `"${product.title}" saved to device.`);
  };

  const handleDownloadInvoice = (order: any) => {
    const invoice = generateDigitalInvoice(
      order.orderId,
      order.items.map((i: any) => i.product.title).join(', '),
      order.totalAmount,
      order.paymentId,
      order.customerEmail
    );
    const blob = new Blob([invoice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DigiVault_Receipt_${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Receipt Saved 📄', `Receipt for ${order.orderId} downloaded.`);
  };

  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    setAvatarSeed(randomSeed);
    const newAvatar = getDiceBearAvatar(randomSeed, selectedStyle);
    updateUserAvatar(newAvatar);
  };

  const handleSelectStyle = (style: DiceBearStyle) => {
    setSelectedStyle(style);
    const newAvatar = getDiceBearAvatar(avatarSeed, style);
    updateUserAvatar(newAvatar);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6 pb-24 space-y-4">
      {/* 1. Android Native Minimal Profile Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-100 shadow-2xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-neutral-100 border border-neutral-200"
              />
              <button
                onClick={() => setIsAvatarStudioOpen(!isAvatarStudioOpen)}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border-2 border-white flex items-center justify-center shadow-xs cursor-pointer transition-transform group-hover:scale-110"
                title="Change DiceBear Avatar"
              >
                <Palette className="w-3 h-3 text-amber-300" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-neutral-900">
                  {user.name}
                </h1>
                {user.isProMember ? (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                    PRO
                  </span>
                ) : (
                  <span className="bg-neutral-100 text-neutral-600 text-[10px] font-mono px-2 py-0.5 rounded-full">
                    Free Tier
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 mt-1">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-neutral-400" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAvatarStudioOpen(!isAvatarStudioOpen)}
              className="px-3 py-1.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">Avatar</span>
            </button>
            <button
              onClick={logoutUser}
              className="p-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DiceBear Avatar Studio Drawer */}
        <AnimatePresence>
          {isAvatarStudioOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-neutral-100 pt-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>DiceBear NPM Avatar Customizer</span>
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Switch styles or roll a unique algorithmic vector avatar.
                  </p>
                </div>
                <button
                  onClick={handleRandomizeAvatar}
                  className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-full flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-300" />
                  <span>Roll Avatar</span>
                </button>
              </div>

              {/* Style options */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {AVATAR_STYLES.map((st) => {
                  const isSelected = selectedStyle === st.id;
                  const previewUri = getDiceBearAvatar(avatarSeed, st.id);
                  return (
                    <button
                      key={st.id}
                      onClick={() => handleSelectStyle(st.id)}
                      className={`p-2 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-neutral-50/80 hover:bg-white text-neutral-800'
                      }`}
                    >
                      <img
                        src={previewUri}
                        alt={st.label}
                        className="w-7 h-7 rounded-full bg-white/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate leading-tight">{st.label}</p>
                        <p className={`text-[9px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                          {st.id}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Android Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-center">
          <div className="bg-neutral-50 p-2.5 rounded-2xl">
            <div className="text-sm font-bold text-neutral-900 font-mono">
              {downloadItems.length}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium">Downloads</div>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-2xl">
            <div className="text-sm font-bold text-neutral-900 font-mono">
              {orders.length}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium">Purchases</div>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-2xl">
            <div className="text-sm font-bold text-neutral-900 font-mono">
              {user.isProMember ? 'Active' : 'Free'}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium">Plan Status</div>
          </div>
        </div>
      </div>

      {/* 2. Clean Segmented Navigation Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1 bg-white rounded-2xl border border-neutral-100 shadow-2xs">
        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'downloads'
              ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Downloaded ({downloadItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'purchases'
              ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Purchases ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'subscription'
              ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
              : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Subscription</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: Downloaded History */}
      {activeTab === 'downloads' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs text-neutral-500">
            <span>Your Instant 4K Asset Library</span>
            <span>{downloadItems.length} Available</span>
          </div>

          {downloadItems.length > 0 ? (
            <div className="space-y-2">
              {downloadItems.map((item, idx) => {
                const prod = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={item.id || idx}
                    className="bg-white p-3 sm:p-3.5 rounded-2xl border border-neutral-100 shadow-2xs flex items-center justify-between gap-3 hover:border-neutral-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.previewUrl || prod?.previewImageUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                      />
                      <div className="min-w-0">
                        <h3
                          onClick={() => prod && openProductDetail(prod)}
                          className="text-xs sm:text-sm font-semibold text-neutral-900 truncate hover:underline cursor-pointer"
                        >
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                          <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded font-mono text-[10px]">
                            {item.format}
                          </span>
                          <span>•</span>
                          <span>{item.fileSize}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {item.downloadedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDownloadItem(prod || item)}
                        disabled={downloadingId === (prod?.id || item.productId)}
                        className="h-8 px-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-amber-300" />
                        <span className="hidden sm:inline">
                          {downloadingId === (prod?.id || item.productId) ? 'Saving...' : 'Re-download'}
                        </span>
                        <span className="sm:hidden">4K</span>
                      </button>

                      {prod?.canvaEditableUrl && (
                        <a
                          href={prod.canvaEditableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full bg-cyan-50 text-cyan-700 hover:bg-cyan-100 flex items-center justify-center transition-colors"
                          title="Open Canva Template"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-neutral-100 shadow-2xs space-y-2">
              <Package className="w-8 h-8 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-800">No Downloads Yet</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Explore our catalog for wallpapers, Canva templates, and free drops.
              </p>
              <button
                onClick={() => setActivePage('explore')}
                className="mt-2 h-8 px-4 bg-neutral-900 text-white rounded-full text-xs font-medium cursor-pointer"
              >
                Browse Drops
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Purchases & Orders */}
      {activeTab === 'purchases' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs text-neutral-500">
            <span>Payment History & Invoices</span>
            <span>{orders.length} Orders</span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-2.5">
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-neutral-900">
                          {ord.orderId}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-semibold px-2 py-0.2 rounded-full">
                          PAID
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {ord.date} • Ref: {ord.paymentId}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-neutral-900 font-mono">
                        ₹{ord.totalAmount.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleDownloadInvoice(ord)}
                        className="text-[11px] text-neutral-700 hover:text-neutral-950 font-medium underline flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-neutral-500" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                    {ord.items.map((item, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-neutral-50 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-100"
                      >
                        {item.product.title} (₹{item.price})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-neutral-100 shadow-2xs space-y-2">
              <CreditCard className="w-8 h-8 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-800">No Purchase History</h3>
              <p className="text-xs text-neutral-400">
                You haven't made any purchases yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Subscription Details */}
      {activeTab === 'subscription' && (
        <div className="space-y-4">
          {user.isProMember ? (
            /* Active Pro Member Banner */
            <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="bg-amber-400 text-neutral-900 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Active VIP Pass
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold mt-2">
                    {user.proPlanName || 'PixelPass Annual Unlimited'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Enjoy unrestricted 4K instant downloads for all 10,000+ templates.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 text-xs">
                <div className="bg-neutral-800/80 p-2.5 rounded-2xl">
                  <div className="text-[10px] text-neutral-400">Valid Until</div>
                  <div className="font-semibold text-neutral-200 mt-0.5">
                    {user.proExpiryDate || 'August 23, 2027'}
                  </div>
                </div>
                <div className="bg-neutral-800/80 p-2.5 rounded-2xl">
                  <div className="text-[10px] text-neutral-400">Commercial License</div>
                  <div className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Included</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Non-pro upgrade prompt */
            <div className="space-y-3">
              <div className="text-center py-2">
                <h2 className="text-base font-bold text-neutral-900">
                  Upgrade to PixelPass Unlimited
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Unlock all 10,000+ digital assets without per-item payment
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRO_MEMBERSHIP_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-100 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-neutral-900">{plan.name}</h3>
                        <span className="bg-amber-100 text-amber-900 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{plan.duration}</p>

                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-2xl font-bold text-neutral-900 font-mono">
                          ₹{plan.price}
                        </span>
                        <span className="text-xs text-neutral-400 line-through font-mono">
                          ₹{plan.originalPrice}
                        </span>
                      </div>

                      <ul className="space-y-1.5 mt-3 text-xs text-neutral-600">
                        {plan.perks.slice(0, 3).map((perk, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => openRazorpayForSubscription(plan.id, plan.name, plan.price)}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Subscribe (₹{plan.price})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
