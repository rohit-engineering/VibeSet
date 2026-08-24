import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  DigitalProduct,
  UserProfile,
  CartItem,
  OrderRecord,
  Review,
  ActivePage,
  FilterState,
  ProductCategory
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/initialProducts';
import { getDiceBearAvatar } from '../utils/avatar';
import {
  syncUserToFirestore,
  fetchUserFromFirestore,
  saveOrderToFirestore,
  saveProductToFirestore,
  loadProductsFromFirestore,
  subscribeToProducts
} from '../utils/firestoreService';

interface RazorpayCheckoutConfig {
  isOpen: boolean;
  itemTitle: string;
  amount: number;
  type: 'single_product' | 'cart' | 'subscription';
  targetProduct?: DigitalProduct;
  subscriptionPlanId?: string;
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  user: UserProfile | null;
  products: DigitalProduct[];
  reviews: Record<string, Review[]>;
  activePage: ActivePage;
  selectedProduct: DigitalProduct | null;
  selectedCategory: ProductCategory;
  watermarkShield: boolean;
  searchQuery: string;
  filterState: FilterState;
  cart: CartItem[];
  wishlistIds: string[];
  purchasedIds: string[];
  orders: OrderRecord[];
  isAuthModalOpen: boolean;
  razorpayCheckout: RazorpayCheckoutConfig | null;
  toasts: ToastMessage[];

  // Actions
  setActivePage: (page: ActivePage) => void;
  setSelectedProduct: (product: DigitalProduct | null) => void;
  setSelectedCategory: (category: ProductCategory) => void;
  openCategory: (category: ProductCategory) => void;
  toggleWatermarkShield: () => void;
  setSearchQuery: (query: string) => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  addToCart: (product: DigitalProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isPurchased: (productId: string) => boolean;
  openProductDetail: (product: DigitalProduct) => void;
  openRazorpayForProduct: (product: DigitalProduct) => void;
  openRazorpayForCart: () => void;
  openRazorpayForSubscription: (planId: string, planName: string, amount: number) => void;
  closeRazorpay: () => void;
  completePurchase: (paymentId: string, method: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'razorpay_wallet' | 'free_claim' | 'pro_pass') => void;
  claimFreeProduct: (product: DigitalProduct) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  addNewProduct: (product: DigitalProduct) => void;
  loginUser: (email: string, password?: string, isPro?: boolean, name?: string) => boolean;
  signupUser: (name: string, email: string, phone: string, password: string) => boolean;
  updateUserAvatar: (avatarUrl: string) => void;
  recordDownload: (product: DigitalProduct) => void;
  logoutUser: () => void;
  setIsAuthModalOpen: (open: boolean) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_FILTER: FilterState = {
  category: 'all',
  format: 'all',
  orientation: 'all',
  priceType: 'all',
  sortBy: 'popularity',
  festivalTag: '',
  searchQuery: ''
};

const DEFAULT_USER: UserProfile = {
  id: 'user_rk_live',
  name: 'Rajesh Kumar',
  email: 'rk4817341@gmail.com',
  phone: '+91 98765 43210',
  avatar: getDiceBearAvatar('rk4817341', 'bottts'),
  isProMember: true,
  proPlanName: 'PixelPass Annual Unlimited',
  proExpiryDate: '2027-08-23',
  joinedDate: 'August 2026',
  purchasedProductIds: ['prod-1', 'prod-2'],
  wishlistProductIds: ['prod-3', 'prod-5', 'prod-9'],
  cart: [],
  downloadHistory: [
    {
      id: 'dl-1',
      productId: 'prod-1',
      title: 'Neon Cyberpunk 4K Phone Wallpaper Pack',
      format: 'JPG',
      fileSize: '48.5 MB',
      downloadedAt: 'Today, 02:45 PM',
      previewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'dl-2',
      productId: 'prod-2',
      title: 'Royal Indian Wedding Invitation Canva Template',
      format: 'Canva Link',
      fileSize: '12.4 MB',
      downloadedAt: 'Yesterday, 11:20 AM',
      previewUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'
    }
  ],
  orders: [
    {
      orderId: 'ORD-98214',
      items: [
        {
          product: INITIAL_PRODUCTS[0],
          price: 49,
          downloadToken: 'TOK-PROD1-998822',
          licenseKey: 'DIGI-COMM-PROD1-7711'
        }
      ],
      totalAmount: 49,
      discountAmount: 150,
      paymentMethod: 'razorpay_upi',
      paymentId: 'pay_RPZ_98172648',
      date: '2026-08-20 14:32',
      invoiceNumber: 'INV-2026-8819',
      customerEmail: 'rk4817341@gmail.com',
      customerName: 'Rajesh Kumar'
    }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence in local storage
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('digivault_user_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER;
  });

  const [products, setProducts] = useState<DigitalProduct[]>(INITIAL_PRODUCTS);

  // Load from Firestore and set up Realtime Listener
  useEffect(() => {
    let isMounted = true;
    const fetchFirestoreProducts = async () => {
      try {
        const dbProducts = await loadProductsFromFirestore();
        if (isMounted && dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }
      } catch (err) {
        console.warn('Failed to load products from Firestore:', err);
      }
    };

    fetchFirestoreProducts();

    const unsubscribe = subscribeToProducts((liveProducts) => {
      if (isMounted && liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem('digivault_reviews_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [watermarkShield, setWatermarkShield] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(DEFAULT_USER.wishlistProductIds);
  const [purchasedIds, setPurchasedIds] = useState<string[]>(DEFAULT_USER.purchasedProductIds);
  const [orders, setOrders] = useState<OrderRecord[]>(DEFAULT_USER.orders);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [razorpayCheckout, setRazorpayCheckout] = useState<RazorpayCheckoutConfig | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage and Firestore
  useEffect(() => {
    if (user) {
      localStorage.setItem('digivault_user_v2', JSON.stringify(user));
      syncUserToFirestore(user);
    } else {
      localStorage.removeItem('digivault_user_v2');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('digivault_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('digivault_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    
    setToasts((prev) => {
      // Deduplicate: if an identical toast exists, replace it cleanly
      const filtered = prev.filter((t) => !(t.title === title && t.message === message));
      // Keep at most 2 toasts in queue on desktop, 1 on mobile
      const limited = filtered.slice(-1);
      return [...limited, { id, title, message, type }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleWatermarkShield = () => {
    setWatermarkShield((prev) => !prev);
    showToast('Copyright Shield', watermarkShield ? 'Preview watermark hidden' : 'Anti-piracy watermark overlay active', 'info');
  };

  const resetFilters = () => {
    setFilterState(DEFAULT_FILTER);
    setSearchQuery('');
  };

  const addToCart = (product: DigitalProduct) => {
    if (purchasedIds.includes(product.id)) {
      showToast('Already in Library', `You already own "${product.title}". Ready to download anytime!`, 'info');
      return;
    }

    if (cart.some((item) => item.product.id === product.id)) {
      showToast('Already in Cart', `"${product.title}" is already in your digital cart.`, 'info');
      return;
    }

    setCart((prev) => [...prev, { product, addedAt: new Date().toISOString() }]);
    showToast('Added to Cart 🛒', `"${product.title}" added to your digital checkout.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item Removed', 'Product removed from digital cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Sign In Required', 'Please sign in to save items to your wishlist.', 'info');
      return;
    }

    const exists = wishlistIds.includes(productId);
    const updated = exists ? wishlistIds.filter((id) => id !== productId) : [...wishlistIds, productId];
    setWishlistIds(updated);

    if (user) {
      setUser({ ...user, wishlistProductIds: updated });
    }

    if (exists) {
      showToast('Removed from Wishlist', 'Item removed from your saved list.', 'info');
    } else {
      showToast('Saved to Wishlist ❤️', 'Item saved to your Wishlist collection.');
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);
  const isPurchased = (productId: string) => purchasedIds.includes(productId);

  const openProductDetail = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setActivePage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setFilterState((prev) => ({
      ...prev,
      category,
      format: 'all',
      orientation: 'all',
      priceType: 'all',
      festivalTag: '',
      searchQuery: ''
    }));
    setActivePage('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRazorpayForProduct = (product: DigitalProduct) => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Sign In Required', 'Please log in to purchase and unlock digital downloads.', 'info');
      return;
    }

    if (product.isFree) {
      claimFreeProduct(product);
      return;
    }

    setRazorpayCheckout({
      isOpen: true,
      itemTitle: product.title,
      amount: product.price,
      type: 'single_product',
      targetProduct: product
    });
  };

  const openRazorpayForCart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Sign In Required', 'Please log in to complete your checkout.', 'info');
      return;
    }

    if (cart.length === 0) {
      showToast('Cart is Empty', 'Please add digital assets to checkout.', 'error');
      return;
    }

    const total = cart.reduce((acc, curr) => acc + curr.product.price, 0);
    setRazorpayCheckout({
      isOpen: true,
      itemTitle: `Digital Bundle (${cart.length} Assets)`,
      amount: total,
      type: 'cart'
    });
  };

  const openRazorpayForSubscription = (planId: string, planName: string, amount: number) => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Sign In Required', 'Please log in to subscribe to PixelPass.', 'info');
      return;
    }

    setRazorpayCheckout({
      isOpen: true,
      itemTitle: planName,
      amount: amount,
      type: 'subscription',
      subscriptionPlanId: planId
    });
  };

  const closeRazorpay = () => {
    setRazorpayCheckout(null);
  };

  const claimFreeProduct = (product: DigitalProduct) => {
    if (!user) {
      setIsAuthModalOpen(true);
      showToast('Sign In Required', 'Create a free account to download and track your library.', 'info');
      return;
    }

    if (purchasedIds.includes(product.id)) {
      showToast('Already Claimed', 'This asset is already in your library. Click Download anytime!', 'info');
      return;
    }

    const newPurchased = [...purchasedIds, product.id];
    setPurchasedIds(newPurchased);

    const newOrder: OrderRecord = {
      orderId: `FREE-${Date.now().toString().slice(-6)}`,
      items: [
        {
          product,
          price: 0,
          downloadToken: `FREE-TOK-${Date.now()}`,
          licenseKey: `DIGI-FREE-COMM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        }
      ],
      totalAmount: 0,
      discountAmount: product.originalPrice || 99,
      paymentMethod: 'free_claim',
      paymentId: 'free_instant_grant',
      date: new Date().toLocaleString(),
      invoiceNumber: `INV-FREE-${Date.now().toString().slice(-5)}`,
      customerEmail: user.email,
      customerName: user.name
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (user) {
      setUser({
        ...user,
        purchasedProductIds: newPurchased,
        orders: [newOrder, ...user.orders]
      });
    }

    showToast('🎉 Free Asset Claimed!', `"${product.title}" unlocked in your Digital Library with instant 4K download.`);
  };

  const completePurchase = (
    paymentId: string,
    method: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'razorpay_wallet' | 'free_claim' | 'pro_pass'
  ) => {
    if (!razorpayCheckout || !user) return;

    if (razorpayCheckout.type === 'subscription') {
      const updatedUser: UserProfile = {
        ...user,
        isProMember: true,
        proExpiryDate: '2027-08-23'
      };
      setUser(updatedUser);
      showToast('👑 PixelPass Activated!', 'Welcome to PixelPass Pro! You have unlimited free downloads of all digital items.', 'success');
      closeRazorpay();
      return;
    }

    let itemsPurchased: DigitalProduct[] = [];
    if (razorpayCheckout.type === 'single_product' && razorpayCheckout.targetProduct) {
      itemsPurchased = [razorpayCheckout.targetProduct];
    } else if (razorpayCheckout.type === 'cart') {
      itemsPurchased = cart.map((c) => c.product);
      setCart([]);
    }

    const newIds = itemsPurchased.map((p) => p.id).filter((id) => !purchasedIds.includes(id));
    const updatedPurchased = [...purchasedIds, ...newIds];
    setPurchasedIds(updatedPurchased);

    const newOrder: OrderRecord = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: itemsPurchased.map((p) => ({
        product: p,
        price: p.price,
        downloadToken: `TOK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        licenseKey: `DIGI-LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${p.id.toUpperCase()}`
      })),
      totalAmount: razorpayCheckout.amount,
      discountAmount: itemsPurchased.reduce((sum, p) => sum + (p.originalPrice - p.price), 0),
      paymentMethod: method,
      paymentId: paymentId,
      date: new Date().toLocaleString(),
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerEmail: user.email,
      customerName: user.name
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveOrderToFirestore(newOrder, user.id);

    setUser({
      ...user,
      purchasedProductIds: updatedPurchased,
      orders: updatedOrders
    });

    closeRazorpay();
    showToast('⚡ Instant Delivery Unlocked!', `${itemsPurchased.length} Digital Asset(s) added to your Library with instant 4K download & commercial license.`);
  };

  const addReview = (productId: string, rating: number, comment: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
      verifiedPurchase: purchasedIds.includes(productId),
      date: 'Just now',
      helpfulCount: 1
    };

    setReviews((prev) => {
      const existing = prev[productId] || [];
      return { ...prev, [productId]: [newReview, ...existing] };
    });

    // Update product rating average
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const prodReviews = [...(reviews[productId] || []), newReview];
          const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewCount: prodReviews.length
          };
        }
        return p;
      })
    );

    showToast('Review Submitted ⭐', 'Thank you for rating and reviewing this digital product!');
  };

  const addNewProduct = (product: DigitalProduct) => {
    setProducts((prev) => [product, ...prev]);
    showToast('Product Published 🚀', `"${product.title}" has been successfully added to the digital catalog.`);
  };

  const recordDownload = (product: DigitalProduct) => {
    const newDownload = {
      id: `dl-${Date.now()}`,
      productId: product.id,
      title: product.title,
      format: product.format,
      fileSize: product.fileSize,
      downloadedAt: 'Just now',
      previewUrl: product.previewImageUrl
    };

    if (user) {
      const updatedHistory = [newDownload, ...(user.downloadHistory || [])];
      setUser({
        ...user,
        downloadHistory: updatedHistory
      });
    }
  };

  const loginUser = (email: string, password?: string, isPro?: boolean, customName?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Error', 'Please provide a valid email address.', 'error');
      return false;
    }

    // Check if we have registered users saved in localStorage
    let registeredUsers: any[] = [];
    try {
      const saved = localStorage.getItem('digivault_registered_users');
      if (saved) registeredUsers = JSON.parse(saved);
    } catch {}

    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    let newUser: UserProfile;
    if (existing) {
      if (password && existing.password && existing.password !== password) {
        showToast('Login Failed', 'Incorrect password. Please try again.', 'error');
        return false;
      }
      newUser = {
        ...existing,
        id: existing.id || `user_${Date.now()}`,
        avatar: existing.avatar || getDiceBearAvatar(cleanEmail, 'bottts')
      };
    } else {
      const derivedName = customName || cleanEmail.split('@')[0].replace(/[._]/g, ' ');
      newUser = {
        id: `user_${Date.now()}`,
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        email: cleanEmail,
        phone: '+91 98765 43210',
        avatar: getDiceBearAvatar(cleanEmail, 'bottts'),
        isProMember: isPro ?? (cleanEmail.includes('pro') || cleanEmail.includes('rk4817341')),
        proPlanName: (isPro ?? (cleanEmail.includes('pro') || cleanEmail.includes('rk4817341'))) ? 'PixelPass Annual Unlimited' : undefined,
        proExpiryDate: '2027-08-23',
        joinedDate: 'August 2026',
        purchasedProductIds: ['prod-1', 'prod-2'],
        wishlistProductIds: ['prod-3'],
        cart: [],
        downloadHistory: [
          {
            id: `dl-${Date.now()}`,
            productId: 'prod-1',
            title: 'Neon Cyberpunk 4K Phone Wallpaper Pack',
            format: 'JPG',
            fileSize: '48.5 MB',
            downloadedAt: 'Recent Download',
            previewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
          }
        ],
        orders: [
          {
            orderId: 'ORD-98214',
            items: [
              {
                product: INITIAL_PRODUCTS[0],
                price: 49,
                downloadToken: 'TOK-PROD1-998822',
                licenseKey: 'DIGI-COMM-PROD1-7711'
              }
            ],
            totalAmount: 49,
            discountAmount: 150,
            paymentMethod: 'razorpay_upi',
            paymentId: 'pay_RPZ_98172648',
            date: '2026-08-20 14:32',
            invoiceNumber: 'INV-2026-8819',
            customerEmail: cleanEmail,
            customerName: derivedName
          }
        ]
      };
    }

    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast('Welcome Back! 👋', `Logged in successfully as ${newUser.name}`);
    return true;
  };

  const signupUser = (name: string, email: string, phone: string, password: string): boolean => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 2) {
      showToast('Validation Error', 'Please enter your full name.', 'error');
      return false;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Validation Error', 'Please enter a valid email address.', 'error');
      return false;
    }
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      showToast('Validation Error', 'Please enter a valid 10-digit phone number.', 'error');
      return false;
    }
    if (!password || password.length < 6) {
      showToast('Validation Error', 'Password must be at least 6 characters long.', 'error');
      return false;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      avatar: getDiceBearAvatar(cleanEmail, 'bottts'),
      isProMember: false,
      joinedDate: 'August 2026',
      purchasedProductIds: [],
      wishlistProductIds: [],
      cart: [],
      downloadHistory: [],
      orders: []
    };

    // Save to registered users
    try {
      let registeredUsers: any[] = [];
      const saved = localStorage.getItem('digivault_registered_users');
      if (saved) registeredUsers = JSON.parse(saved);
      registeredUsers.push({ ...newUser, password });
      localStorage.setItem('digivault_registered_users', JSON.stringify(registeredUsers));
    } catch {}

    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast('Account Created! 🎉', `Welcome to DigiVault, ${cleanName}! Instant 4K downloads unlocked.`);
    return true;
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updated = { ...user, avatar: avatarUrl };
      setUser(updated);
      showToast('Avatar Updated! 🎨', 'New DiceBear profile avatar applied.');
    }
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Signed Out', 'You have been logged out safely.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        products,
        reviews,
        activePage,
        selectedProduct,
        selectedCategory,
        watermarkShield,
        searchQuery,
        filterState,
        cart,
        wishlistIds,
        purchasedIds,
        orders,
        isAuthModalOpen,
        razorpayCheckout,
        toasts,

        setActivePage,
        setSelectedProduct,
        setSelectedCategory,
        openCategory,
        toggleWatermarkShield,
        setSearchQuery,
        setFilterState,
        resetFilters,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        isPurchased,
        openProductDetail,
        openRazorpayForProduct,
        openRazorpayForCart,
        openRazorpayForSubscription,
        closeRazorpay,
        completePurchase,
        claimFreeProduct,
        addReview,
        addNewProduct,
        loginUser,
        signupUser,
        updateUserAvatar,
        recordDownload,
        logoutUser,
        setIsAuthModalOpen,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
