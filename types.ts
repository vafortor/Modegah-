
export type Currency = 'GHS' | 'USD';

export type SortOption = 'default' | 'price-low' | 'price-high' | 'rating';

export type UserRole = 'CLIENT' | 'PARTNER';

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
  category: 'Hollow' | 'Solid' | 'Paving' | 'Decorative' | 'Cement';
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
  PARTNER = 'partner',
  PARTNER_DASHBOARD = 'partner_dashboard',
  PRIVACY = 'privacy',
  TERMS = 'terms'
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
}
