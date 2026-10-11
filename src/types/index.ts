export type CategoryType = 'all' | 'hair_female' | 'hair_male' | 'nail' | 'makeup';

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
