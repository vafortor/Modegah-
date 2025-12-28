
import { Product, Review, Order, Partner } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '6" Hollow Sandcrete Block',
    category: 'Hollow',
    price: 12.50,
    factoryName: 'Modegah Shai Hills',
    description: 'Standard high-vibration hollow block for residential and commercial load-bearing walls. Features two optimized cores for thermal insulation and conduit routing.',
    image: 'https://images.unsplash.com/photo-1517646288273-96b9624b7ecd?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.8,
    reviewCount: 24,
    specifications: {
      dimensions: '400mm x 150mm x 200mm',
      weight: '16.5kg',
      strength: '3.5 N/mm²'
    },
    isActive: true
  },
  {
    id: '2',
    name: '8" Hollow Sandcrete Block',
    category: 'Hollow',
    price: 18.50,
    factoryName: 'Modegah Shai Hills',
    description: 'Heavy-duty structural hollow block designed for multi-story buildings and industrial boundary walls. Provides maximum stability for critical load-bearing sections.',
    image: 'https://images.unsplash.com/photo-1590059393164-8846c4f5263a?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.9,
    reviewCount: 18,
    specifications: {
      dimensions: '400mm x 200mm x 200mm',
      weight: '22kg',
      strength: '5.0 N/mm²'
    },
    isActive: true
  },
  {
    id: '3',
    name: '5" Solid Foundation Block',
    category: 'Solid',
    price: 15.20,
    factoryName: 'Elite Concrete Partners',
    description: 'Ultra-dense solid block optimized for foundation footings and damp-proof courses. Designed to withstand high ground pressure and moisture.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.7,
    reviewCount: 12,
    specifications: {
      dimensions: '400mm x 125mm x 200mm',
      weight: '24kg',
      strength: '7.5 N/mm²'
    },
    isActive: true
  },
  {
    id: '4',
    name: 'Standard I-Shape Paving Stone',
    category: 'Paving',
    price: 4.50,
    factoryName: 'West Hills Masonry',
    description: 'Classic I-shaped interlocking pavers for high-traffic driveways and industrial yards. The shape ensures vertical and horizontal locking.',
    image: 'https://images.unsplash.com/photo-1536633100069-07f0653f86f6?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.6,
    reviewCount: 35,
    specifications: {
      dimensions: '200mm x 160mm x 60mm',
      weight: '3.2kg',
      strength: '40 N/mm²'
    },
    isActive: true
  },
  {
    id: '5',
    name: 'Fleur-de-Lis Decorative Block',
    category: 'Decorative',
    price: 24.00,
    factoryName: 'Modegah Shai Hills',
    description: 'Premium architectural screen block featuring a stylized Fleur-de-Lis pattern. Provides ventilation and aesthetics for balconies and compound walls.',
    image: 'https://images.unsplash.com/photo-1628744448839-3829033324f2?auto=format&fit=crop&q=80&w=800',
    averageRating: 5.0,
    reviewCount: 8,
    specifications: {
      dimensions: '300mm x 300mm x 100mm',
      weight: '8.5kg',
      strength: '2.5 N/mm²'
    },
    isActive: true
  },
  {
    id: '6',
    name: '6" Lintel U-Block',
    category: 'U-Block',
    price: 26.50,
    factoryName: 'Modegah Shai Hills',
    description: 'U-channel block designed to act as permanent formwork for concrete lintels over windows and doors. Eliminates the need for temporary timber shuttering.',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.8,
    reviewCount: 15,
    specifications: {
      dimensions: '400mm x 150mm x 200mm',
      weight: '14.2kg',
      strength: '3.5 N/mm²'
    },
    isActive: true
  },
  {
    id: '7',
    name: 'Zig-Zag Interlocking Paver',
    category: 'Interlocking',
    price: 5.80,
    factoryName: 'Elite Concrete Partners',
    description: 'High-strength zig-zag pavers (dog-bone) for heavy-duty applications like petrol stations and loading bays. Available in various colors on request.',
    image: 'https://images.unsplash.com/photo-1544911845-1f34a3ea3db3?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.9,
    reviewCount: 22,
    specifications: {
      dimensions: '225mm x 112mm x 80mm',
      weight: '4.1kg',
      strength: '45 N/mm²'
    },
    isActive: true
  },
  {
    id: 'c1',
    name: 'Ghacem Super Strong (42.5R)',
    category: 'Cement',
    price: 105.00,
    factoryName: 'Ghacem Ltd (Accra)',
    description: 'Premium Ordinary Portland Cement for high-strength structural concrete and block molding.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
    averageRating: 4.9,
    reviewCount: 120,
    specifications: {
      dimensions: '50kg Bag',
      weight: '50kg',
      strength: '42.5 N/mm²'
    },
    isActive: true
  }
];

export const SAMPLE_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Elite Concrete Partners',
    location: 'Tema Community 25',
    contact: '+233 24 555 0101',
    status: 'APPROVED',
    tier: 'premium',
    appliedDate: '2024-03-01',
    subscriptionFee: 1200,
    revenueGenerated: 68400,
    activeFleetCount: 5,
    productionCapacity: 5000
  },
  {
    id: 'p2',
    name: 'West Hills Masonry',
    location: 'Weija, Accra',
    contact: '+233 20 888 0202',
    status: 'PENDING',
    tier: 'standard',
    appliedDate: '2024-03-15',
    subscriptionFee: 450,
    revenueGenerated: 0,
    activeFleetCount: 1,
    productionCapacity: 1200
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
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'MOD-88291',
    transactionId: 'TXN-ACC-99221',
    date: '12 Sep 2024',
    items: [],
    subtotalGHS: 4500,
    discountAppliedGHS: 0,
    totalGHS: 4500,
    status: 'Out for Delivery',
    currencyAtTime: 'GHS',
    exchangeRateAtTime: 0.063,
    paymentMethod: 'Mobile Money',
    trackingDetails: {
      currentLocation: 'Spintex Road, Accra',
      estimatedArrival: 'Today, 4:00 PM',
      driverName: 'Ekow Barnes',
      driverPhone: '+233 24 000 1122'
    }
  }
];
