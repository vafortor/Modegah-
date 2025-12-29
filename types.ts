
export type Currency = 'GHS' | 'USD';

export type SortOption = 'default' | 'price-low' | 'price-high' | 'rating';

export type UserRole = 'CLIENT' | 'PARTNER' | 'ADMIN';

export type PartnerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  businessName?: string;
}

export interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
  newsletter: boolean;
}

export interface Partner {
  id: string;
  name: string;
  location: string;
  contact: string;
  status: PartnerStatus;
  tier: 'standard' | 'premium' | 'enterprise';
  appliedDate: string;
  subscriptionFee: number;
  revenueGenerated: number;
  activeFleetCount: number;
  productionCapacity: number; // units per day
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Hollow' | 'Solid' | 'Paving' | 'Decorative' | 'Cement' | 'Interlocking' | 'U-Block';
  price: number; // Base price in GHS
  description: string;
  image: string;
  averageRating: number;
  reviewCount: number;
  factoryName: string;
  specifications: {
    dimensions: string;
    weight: string;
    strength: string;
  };
  isActive: boolean; // For admin to toggle availability
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  transactionId: string;
  date: string;
  items: CartItem[];
  subtotalGHS: number;
  discountAppliedGHS: number;
  totalGHS: number;
  status: 'Processing' | 'In Production' | 'Out for Delivery' | 'Delivered';
  currencyAtTime: Currency;
  exchangeRateAtTime: number;
  paymentMethod: 'Mobile Money' | 'Bank Transfer';
  trackingDetails?: {
    currentLocation: string;
    estimatedArrival: string;
    driverName: string;
    driverPhone: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum View {
  HOME = 'home',
  SHOP = 'shop',
  CALCULATOR = 'calculator',
  ORDERS = 'orders',
  WISHLIST = 'wishlist',
  PARTNER = 'partner',
  PARTNER_DASHBOARD = 'partner_dashboard',
  PARTNER_SETTINGS = 'partner_settings',
  ADMIN_DASHBOARD = 'admin_dashboard',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  PROFILE = 'profile',
  FORGOT_PASSWORD = 'forgot_password'
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
}
