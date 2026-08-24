export type ProductCategory =
  | 'all'
  | 'whatsapp_status'
  | 'insta_story'
  | 'greeting_card'
  | 'poster'
  | 'drawing'
  | 'canvas_template'
  | 'wallpaper'
  | 'profile_avatar'
  | 'ad_banner'
  | 'ebook_pdf'
  | 'graphics';

export type ProductFormat =
  | 'JPG'
  | 'PNG'
  | 'PSD'
  | 'SVG'
  | 'Canva Link'
  | 'MP4 Video'
  | 'PDF'
  | 'ZIP Bundle';

export type ProductOrientation = 'portrait_9_16' | 'square_1_1' | 'landscape_16_9' | 'custom';

export type LicenseType = 'Personal Use' | 'Commercial Use' | 'Extended Royalty Free';

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  badge?: string;
  verified: boolean;
  salesCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  helpfulCount: number;
}

export interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  format: ProductFormat;
  orientation: ProductOrientation;
  festivalTag?: string; // e.g. Diwali, Holi, Christmas, New Year, Daily Motivation
  price: number; // In INR (₹). 0 for free
  originalPrice: number; // For discount % calculation (e.g. ₹299 -> ₹99)
  isFree: boolean;
  isProOnly: boolean;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  previewImageUrl: string;
  fullResImageUrl: string;
  fileDimensions: string;
  fileSize: string;
  tags: string[];
  creator: Creator;
  license: LicenseType;
  createdAt: string;
  featured?: boolean;
  trending?: boolean;
  sessionSeason?: 'festive' | 'trending' | 'evergreen' | 'creator_spotlight';
  canvaEditableUrl?: string;
  colorPalette?: string[];
  reviews?: Review[];
  samplePreviewPages?: {
    pageNumber: number;
    title: string;
    description: string;
    previewImageUrl: string;
  }[];
}

export interface CartItem {
  product: DigitalProduct;
  addedAt: string;
}

export interface OrderItem {
  product: DigitalProduct;
  price: number;
  downloadToken: string;
  licenseKey: string;
}

export interface OrderRecord {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'razorpay_wallet' | 'free_claim' | 'pro_pass';
  paymentId: string;
  date: string;
  invoiceNumber: string;
  customerEmail: string;
  customerName: string;
}

export interface DownloadRecord {
  id: string;
  productId: string;
  title: string;
  format: string;
  fileSize: string;
  downloadedAt: string;
  previewUrl: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  isProMember: boolean;
  proPlanName?: string;
  proExpiryDate?: string;
  joinedDate: string;
  purchasedProductIds: string[];
  wishlistProductIds: string[];
  cart: CartItem[];
  orders: OrderRecord[];
  downloadHistory?: DownloadRecord[];
}

export type ActivePage =
  | 'home'
  | 'explore'
  | 'category'
  | 'product_detail'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'profile'
  | 'search'
  | 'creator_studio'
  | 'pro_subscription';

export interface FilterState {
  category: ProductCategory;
  format: string;
  orientation: string;
  priceType: 'all' | 'free' | 'paid' | 'under99' | 'under199';
  sortBy: 'popularity' | 'rating' | 'price_low' | 'price_high' | 'newest';
  festivalTag: string;
  searchQuery: string;
}
