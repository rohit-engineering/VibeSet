import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeFeed } from './components/HomeFeed';
import { ShopExplore } from './components/ShopExplore';
import { CategoryPageView } from './components/CategoryPageView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartPage } from './components/CartPage';
import { WishlistPage } from './components/WishlistPage';
import { ProfileDashboard } from './components/ProfileDashboard';
import { ProSubscriptionPage } from './components/ProSubscriptionPage';
import { DynamicSearchPage } from './components/DynamicSearchPage';
import { RazorpayModal } from './components/RazorpayModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, openCategory } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'category':
        return <CategoryPageView />;
      case 'explore':
        return <ShopExplore />;
      case 'product_detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'profile':
        return <ProfileDashboard />;
      case 'search':
        return <DynamicSearchPage />;
      case 'pro_subscription':
        return <ProSubscriptionPage />;
      case 'home':
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Clean Aesthetic Navbar */}
      <Navbar />

      {/* Main Content Area with Smooth Fast Page Transitions */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: 0.16,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full"
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Responsive Mobile Bottom Navigation */}
      <BottomNav />

      {/* Aesthetic Minimal Footer (Desktop / Tablet) */}
      <footer className="hidden sm:block bg-[#1A1A1A] text-neutral-400 border-t border-neutral-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FFE5D9] text-[#1A1A1A] flex items-center justify-center font-serif italic font-bold text-base">
                d
              </div>
              <span className="font-serif text-white text-lg font-bold tracking-tight">
                digivault<span className="text-[#F4ACB7]">.</span>
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Curated digital product marketplace. Explore, license, and download 4K wallpapers, Canva design kits, WhatsApp status drops, and vector graphics.
            </p>
            <div className="flex items-center gap-1.5 text-[#D8E2DC] font-mono text-[11px]">
              <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
              <span>Direct 4K Cloud Delivery</span>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[10px] mb-3">
              Curated Collections
            </h4>
            <ul className="space-y-2 text-neutral-300">
              <li onClick={() => openCategory('whatsapp_status')} className="hover:text-white transition-colors cursor-pointer">WhatsApp Status (9:16 4K)</li>
              <li onClick={() => openCategory('canvas_template')} className="hover:text-white transition-colors cursor-pointer">Canva Cloud Design Kits</li>
              <li onClick={() => openCategory('greeting_card')} className="hover:text-white transition-colors cursor-pointer">Cards & Celebration Invites</li>
              <li onClick={() => openCategory('wallpaper')} className="hover:text-white transition-colors cursor-pointer">Minimalist 4K & OLED Wallpapers</li>
              <li onClick={() => openCategory('poster')} className="hover:text-white transition-colors cursor-pointer">Wall Posters & Art Prints</li>
              <li onClick={() => openCategory('ebook_pdf')} className="hover:text-white transition-colors cursor-pointer">Creator eBooks & PDF Guides</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[10px] mb-3">
              Trust & Licensing
            </h4>
            <ul className="space-y-2 text-neutral-300">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D8E2DC]" />
                <span>Instant Razorpay Payment</span>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">Commercial License Rights</li>
              <li className="hover:text-white transition-colors cursor-pointer">Anti-Piracy Cloud Protection</li>
              <li className="hover:text-white transition-colors cursor-pointer">Lifetime Digital Vault Access</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[10px] mb-3">
              PixelPass Creator Pass
            </h4>
            <p className="text-neutral-400 mb-3 leading-relaxed">
              Unlimited downloads of all 10,000+ premium digital assets for ₹199/month.
            </p>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-[#FFE5D9] font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="font-serif italic text-xs">Unlimited All-Access Club</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-neutral-800 text-center text-[11px] text-neutral-500 font-mono">
          © {new Date().getFullYear()} digivault. All rights reserved.
        </div>
      </footer>

      {/* Global Modals & Overlays */}
      <RazorpayModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
