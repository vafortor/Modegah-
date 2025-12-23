
export type Currency = 'GHS' | 'USD';

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
  category: 'Hollow' | 'Solid' | 'Paving' | 'Decorative';
  price: number; // Base price in GHS
  description: string;
  image: string;
  averageRating: number;
  reviewCount: number;
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
  date: string;
  items: CartItem[];
  totalGHS: number;
  status: 'Processing' | 'In Production' | 'Out for Delivery' | 'Delivered';
  currencyAtTime: Currency;
  exchangeRateAtTime: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum View {
  HOME = 'home',
  SHOP = 'shop',
  CALCULATOR = 'calculator',
  ORDERS = 'orders'
}
