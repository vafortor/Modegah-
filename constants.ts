
import { Product, Review, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '6" Hollow Sandcrete Block',
    category: 'Hollow',
    price: 12.50,
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
    id: '9',
    name: '5" Hollow Sandcrete Block',
    category: 'Hollow',
    price: 10.80,
    description: 'Standard external wall block. Balanced weight and strength for residential construction.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.5,
    reviewCount: 12,
    specifications: {
      dimensions: '400mm x 125mm x 200mm',
      weight: '14kg',
      strength: '2.8 N/mm²'
    }
  },
  {
    id: '10',
    name: '4" Hollow Sandcrete Block',
    category: 'Hollow',
    price: 8.50,
    description: 'Perfect for non-load bearing partitions and internal fences. Lightweight and cost-effective.',
    image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.2,
    reviewCount: 31,
    specifications: {
      dimensions: '400mm x 100mm x 200mm',
      weight: '11kg',
      strength: '2.5 N/mm²'
    }
  },
  {
    id: '3',
    name: 'Solid Paving Stone (Classic Grey)',
    category: 'Paving',
    price: 3.20,
    description: 'Heavy-duty interlocking paving stones for driveways, walkways, and industrial floors.',
    image: 'https://images.unsplash.com/photo-1588615419842-887e5967008b?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.7,
    reviewCount: 56,
    specifications: {
      dimensions: '200mm x 100mm x 60mm',
      weight: '4kg',
      strength: '40 N/mm²'
    }
  },
  {
    id: '7',
    name: 'Standard Roadside Curb Block',
    category: 'Solid',
    price: 48.00,
    description: 'High-density concrete curb blocks for road edges and heavy-duty landscaping.',
    image: 'https://images.unsplash.com/photo-1621932953986-15fcf084da0f?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.6,
    reviewCount: 8,
    specifications: {
      dimensions: '600mm x 150mm x 300mm',
      weight: '62kg',
      strength: '30 N/mm²'
    }
  },
  {
    id: '4',
    name: 'Decorative Ventilation Block',
    category: 'Decorative',
    price: 25.00,
    description: 'Elegant design that allows for airflow and natural light while maintaining privacy.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.9,
    reviewCount: 42,
    specifications: {
      dimensions: '300mm x 300mm x 100mm',
      weight: '12kg',
      strength: '2.0 N/mm²'
    }
  },
  {
    id: '6',
    name: 'Zig-Zag Interlocking Paving',
    category: 'Paving',
    price: 4.50,
    description: 'Unique interlocking pattern provides maximum stability for high-traffic areas.',
    image: 'https://images.unsplash.com/photo-1584472251263-d30907409247?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.8,
    reviewCount: 22,
    specifications: {
      dimensions: '225mm x 112mm x 80mm',
      weight: '5kg',
      strength: '45 N/mm²'
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
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'Akua Addo',
    rating: 4,
    comment: 'Good strength, but delivery took a day longer than expected.',
    date: '2024-03-15'
  }
];

export const GHS_TO_USD_RATE = 0.063; // Mock rate: 1 GHS ≈ 0.063 USD

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'MOD-10023',
    date: '2024-02-28',
    items: [
      { ...PRODUCTS[0], quantity: 500 }
    ],
    totalGHS: 6250,
    status: 'Delivered',
    currencyAtTime: 'GHS',
    exchangeRateAtTime: 0.063
  },
  {
    id: 'MOD-11054',
    date: '2024-03-05',
    items: [
      { ...PRODUCTS[4], quantity: 1200 }
    ],
    totalGHS: 3840,
    status: 'In Production',
    currencyAtTime: 'GHS',
    exchangeRateAtTime: 0.063
  }
];
