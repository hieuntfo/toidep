export type CategoryType = 'all' | 'hair_female' | 'hair_male' | 'nail' | 'makeup' | 'spa_skincare';

export type VipTier = 'free' | 'pro' | 'vip_gold' | 'vip_diamond';

export interface FocalCropSettings {
  aspectRatio: '5:3' | '1:1' | '4:5' | '16:9';
  focalX: number; // 0 to 100 percentage
  focalY: number; // 0 to 100 percentage
  zoom: number; // 1 to 2.5
  focusTarget: 'face' | 'center' | 'nail' | 'custom';
}

export type HanoiDistrict = 
  | 'Tất cả Hà Nội'
  | 'Hoàn Kiếm'
  | 'Cầu Giấy'
  | 'Đống Đa'
  | 'Ba Đình'
  | 'Tây Hồ'
  | 'Hai Bà Trưng'
  | 'Thanh Xuân';

export interface Stylist {
  id: string;
  name: string;
  avatar: string;
  title: string;
  experienceYears: number;
  salonId: string;
  salonName: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  bio: string;
}

export interface SalonPriceItem {
  name: string;
  price: string;
  duration: string;
  category: CategoryType;
}

export interface Salon {
  id: string;
  slug: string;
  name: string;
  isVerified: boolean;
  avatar: string;
  coverImage: string;
  address: string;
  district: HanoiDistrict;
  phone: string;
  openHours: string;
  rating: number;
  reviewsCount: number;
  description: string;
  priceItems: SalonPriceItem[];
  stylists: Stylist[];
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  proPlanActive?: boolean;
  // VIP & Verified Partner Account
  isVip?: boolean;
  vipTier?: VipTier;
  vipBadgeText?: string;
  servicesProvided?: CategoryType[];
}

export interface Post {
  id: string;
  title: string;
  caption: string;
  images: string[];
  category: CategoryType;
  styleName: string;
  tags: string[];
  salonId: string;
  salonName: string;
  salonDistrict: HanoiDistrict;
  salonAddress: string;
  stylistId?: string;
  stylistName?: string;
  priceEstimate: string;
  priceFrom: number;
  likesCount: number;
  savesCount: number;
  createdAt: string;
  authorName: string;
  authorAvatar: string;
  authorType: 'salon' | 'stylist' | 'customer';
  isVerifiedSalon: boolean;
  commentsCount: number;
  isSpotlight?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface BookingRequest {
  id: string;
  postId?: string;
  postTitle?: string;
  postImage?: string;
  styleName: string;
  salonId: string;
  salonName: string;
  stylistId?: string;
  stylistName?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedPrice: string;
}

export interface Review {
  id: string;
  salonId: string;
  bookingId?: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  content: string;
  styleDone: string;
  stylistName?: string;
  date: string;
  isVerifiedStay: boolean;
}

export type LogoConcept = 'A' | 'B' | 'C' | 'D' | 'E';

export interface LogoDetail {
  id: LogoConcept;
  name: string;
  concept: string;
  meaning: string;
  strength: string;
  weakness: string;
  suitableRole: string;
}

// User & Authentication Types
export type UserRole = 'customer' | 'salon_pro' | 'admin';
export type ProVerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type AuthProvider = 'email' | 'google' | 'facebook' | 'apple';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  phone?: string;
  role: UserRole;
  proStatus: ProVerificationStatus;
  salonId?: string; // Connected salon for salon_pro
  registeredAt: string;
  authProvider: AuthProvider;
  bio?: string;
  address?: string;
  isBlocked?: boolean;
  status?: 'active' | 'suspended';
}

// Editorial / Longform News Article Types
export type ArticleCategory = 
  | 'hair_trends'
  | 'hair_care'
  | 'makeup_nail'
  | 'interviews'
  | 'technology';

export interface ArticleMediaItem {
  url: string;
  caption?: string;
  credit?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

export interface ArticleSection {
  id: string;
  type: 'paragraph' | 'heading' | 'pullquote' | 'image_break' | 'image_gallery' | 'vertical_video' | 'stylist_tip' | 'service_cta';
  content?: string;
  heading?: string;
  caption?: string;
  credit?: string;
  imageUrl?: string;
  images?: ArticleMediaItem[];
  videoUrl?: string; // e.g. 9:16 vertical video
  videoPoster?: string;
  videoDuration?: string;
  videoTitle?: string;
  tipAuthor?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  categoryLabel: string;
  coverImage: string;
  readTime: string; // e.g. "5 phút đọc"
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  publishedAt: string;
  status: 'published' | 'draft';
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  sections: ArticleSection[];
  relatedSalonId?: string;
  relatedSalonName?: string;
  relatedPostId?: string;
  tags: string[];
  focalCrop?: FocalCropSettings;
}
