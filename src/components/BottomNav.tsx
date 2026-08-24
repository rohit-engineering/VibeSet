import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activePage,
    setActivePage,
    wishlistIds,
    cart,
    user
  } = useApp();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show near the top or when at the bottom
      if (currentScrollY < 60 || (window.innerHeight + currentScrollY) >= document.documentElement.scrollHeight - 60) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Smooth threshold to prevent unnecessary hiding
      const delta = currentScrollY - lastScrollY.current;
      
      if (delta > 25) {
        // Fast scroll down
        setIsVisible(false);
      } else if (delta < -15) {
        // Scroll up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 900);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home
    },
    {
      id: 'explore' as const,
      label: 'Explore',
      icon: Compass
    },
    {
      id: 'wishlist' as const,
      label: 'Saved',
      icon: Heart,
      badge: wishlistIds.length > 0 ? wishlistIds.length : null
    },
    {
      id: 'cart' as const,
      label: 'Cart',
      icon: ShoppingBag,
      badge: cart.length > 0 ? cart.length : null
    },
    {
      id: 'profile' as const,
      label: user ? 'Vault' : 'Account',
      icon: User,
      isAvatar: Boolean(user?.avatar)
    }
  ];

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isVisible ? 0 : 80,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 34,
          mass: 0.8
        }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-[#EEEEEE] px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-6px_25px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => {
                  setActivePage(item.id);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3.5 rounded-2xl relative transition-all cursor-pointer ${
                  isActive
                    ? 'text-neutral-950 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <div className="relative">
                  {item.isAvatar && user ? (
                    <div className={`w-5 h-5 rounded-full overflow-hidden border transition-transform ${
                      isActive ? 'ring-2 ring-neutral-950 border-white scale-110' : 'border-neutral-300'
                    }`}>
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  )}

                  {item.badge !== null && item.badge !== undefined && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] bg-neutral-950 text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center px-1 shadow-xs"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>

                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-neutral-950 mt-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
