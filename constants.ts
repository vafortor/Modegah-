
import { Product, Review, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '6" Hollow Sandcrete Block',
    category: 'Hollow',
    price: 12.50,
    factoryName: 'Modegah Shai Hills',
    description: 'Most common load-bearing block. High-vibration mold for superior durability and precision.',
    image: 'https://images.unsplash.com/photo-1517646288273-96b9624b7ecd?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.8,
    reviewCount: 24,
    specifications: {
      dimensions: '400mm x 150mm x 200mm',
      weight: '16.5kg',
      strength: '3.5 N/mm²'
    }
  },
  {
    id: '2',
    name: '8" Hollow Sandcrete Block',
    category: 'Hollow',
    price: 18.50,
    factoryName: 'Modegah Shai Hills',
    description: 'Heavy structural load-bearing block. Ideal for multi-story buildings and high-pressure walls.',
    image: 'https://images.unsplash.com/photo-1590059393164-8846c4f5263a?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.9,
    reviewCount: 18,
    specifications: {
      dimensions: '400mm x 200mm x 200mm',
      weight: '22kg',
      strength: '5.0 N/mm²'
    }
  },
  {
    id: 'c1',
    name: 'Ghacem Super Strong (42.5R)',
    category: 'Cement',
    price: 105.00,
    factoryName: 'Ghacem Ltd (Accra)',
    description: 'Premium Ordinary Portland Cement (OPC) for high-strength concrete works and block molding.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.9,
    reviewCount: 120,
    specifications: {
      dimensions: '50kg Bag',
      weight: '50kg',
      strength: '42.5 N/mm²'
    }
  },
  {
    id: 'c2',
    name: 'Dangote Cement (42.5R)',
    category: 'Cement',
    price: 102.00,
    factoryName: 'Dangote Cement Ghana',
    description: 'High-quality 42.5R grade cement suitable for all construction projects, including bridges and high-rise buildings.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.8,
    reviewCount: 85,
    specifications: {
      dimensions: '50kg Bag',
      weight: '50kg',
      strength: '42.5 N/mm²'
    }
  },
  {
    id: 'c3',
    name: 'Dzata Cement (32.5R)',
    category: 'Cement',
    price: 98.00,
    factoryName: 'Dzata Cement (Tema)',
    description: '100% Ghanaian-owned brand. Standard grade cement perfect for plastering and general block work.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.7,
    reviewCount: 45,
    specifications: {
      dimensions: '50kg Bag',
      weight: '50kg',
      strength: '32.5 N/mm²'
    }
  },
  {
    id: 'c4',
    name: 'Diamond Cement (42.5R)',
    category: 'Cement',
    price: 100.00,
    factoryName: 'Diamond Cement Ltd',
    description: 'Strong and durable Portland Cement produced locally to meet West African standard specifications.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.6,
    reviewCount: 38,
    specifications: {
      dimensions: '50kg Bag',
      weight: '50kg',
      strength: '42.5 N/mm²'
    }
  },
  {
    id: '11',
    name: '6" Solid Block (Eco-Mix)',
    category: 'Solid',
    price: 14.20,
    factoryName: 'Elite Concrete Partners',
    description: 'Premium solid blocks for maximum stability and insulation. Produced by our certified partner using Modegah standards.',
    image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.6,
    reviewCount: 15,
    specifications: {
      dimensions: '400mm x 150mm x 200mm',
      weight: '28kg',
      strength: '4.5 N/mm²'
    }
  },
  {
    id: '3',
    name: 'Solid Paving Stone (Classic Grey)',
    category: 'Paving',
    price: 3.20,
    factoryName: 'Modegah Shai Hills',
    description: 'Heavy-duty interlocking paving stones for driveways, walkways, and industrial floors.',
    image: 'https://images.unsplash.com/photo-1588615419842-887e5967008b?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.7,
    reviewCount: 56,
    specifications: {
      dimensions: '200mm x 100mm x 60mm',
      weight: '4kg',
      strength: '40 N/mm²'
    }
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Kojo Mensah',
    rating: 5,
    comment: 'The quality of these blocks is outstanding. Very little breakage during delivery.',
    date: '2024-03-10'
  }
];

export const GHS_TO_USD_RATE = 0.063;
export const INITIAL_ORDERS: Order[] = [];
