
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import OrderHistory from './components/OrderHistory';
import Cart from './components/Cart';
import BlockCalculator from './components/BlockCalculator';
import AIConsultant from './components/AIConsultant';
import PartnerPortal from './components/PartnerPortal';
import PartnerDashboard from './components/PartnerDashboard';
import PartnerSettings from './components/PartnerSettings';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ProfileSettings from './components/ProfileSettings';
import LegalView from './components/LegalView';
import ReceiptModal from './components/ReceiptModal';
import NotificationTray from './components/NotificationTray';
import { Product, CartItem, View, Currency, Review, Order, SortOption, UserRole, Notification, Partner, PartnerStatus, UserProfile, NotificationSettings } from './types';
import { PRODUCTS, GHS_TO_USD_RATE, INITIAL_REVIEWS, INITIAL_ORDERS, SAMPLE_PARTNERS } from './constants';
// Added Factory to imports to resolve the missing component reference error
import { ArrowRight, Star, ShieldCheck, Truck, Clock, RefreshCw, AlertCircle, LayoutGrid, Box, Grid3X3, Trees, Package, Building2, ArrowUpDown, ChevronDown, Filter, X, Search, Loader2, CreditCard, Award, Bell, ShieldAlert, BarChart3, Users, Globe, Edit3, Trash2, Check, Ban, Plus, CheckCircle2, DollarSign, Eye, EyeOff, TrendingUp, MapPin, Camera, Upload, Image as ImageIcon, RotateCcw, Heart, Trash, Copy, MoveUp, MoveDown, Layout, Settings2, GripVertical, User, Briefcase, Zap, Crown, Factory } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentView, setView] = useState<View>(View.HOME);
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [partners, setPartners] = useState<Partner[]>(SAMPLE_PARTNERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currency, setCurrency] = useState<Currency>('GHS');
  const [exchangeRate, setExchangeRate] = useState(GHS_TO_USD_RATE);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'Guest User',
    phone: '+233 00 000 0000',
    email: 'guest@modegah.com',
    deliveryAddress: 'Greater Accra, Ghana',
    businessName: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
    newsletter: false
  });

  // Admin Customization State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'partners' | 'catalogue_designer'>('overview');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkAdjustmentPct, setBulkAdjustmentPct] = useState(0);
  const [adminPreviewMode, setAdminPreviewMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Security Redirection Logic
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'PARTNER') {
        const allowed = [View.PARTNER_DASHBOARD, View.SHOP, View.HOME, View.PARTNER_SETTINGS];
        if (!allowed.includes(currentView)) setView(View.PARTNER_DASHBOARD);
      } else if (userRole === 'ADMIN') {
        const allowed = [View.ADMIN_DASHBOARD, View.PARTNER_DASHBOARD, View.SHOP, View.HOME];
        if (!allowed.includes(currentView)) setView(View.ADMIN_DASHBOARD);
      }
    }
  }, [isAuthenticated, userRole, currentView]);

  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, title, message, timestamp: Date.now() }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const formatPrice = useCallback((priceInGHS: number) => {
    if (currency === 'USD') {
      const converted = priceInGHS * exchangeRate;
      return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `GH₵${priceInGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency, exchangeRate]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    addNotification('success', 'Added to Cart', `${product.name} has been added to your order.`);
  }, [addNotification]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        addNotification('info', 'Removed from Wishlist', `${product.name} has been removed.`);
        return prev.filter(p => p.id !== product.id);
      }
      addNotification('success', 'Saved to Wishlist', `${product.name} is now in your saved list.`);
      return [...prev, product];
    });
  }, [addNotification]);

  const updateCartQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleCheckout = useCallback(() => {
    setIsProcessingCheckout(true);
    setTimeout(() => {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      
      let bulkDiscountPct = 0;
      if (totalQty >= 5000) bulkDiscountPct = 0.07;
      else if (totalQty >= 1000) bulkDiscountPct = 0.03;
      
      const loyaltyPct = orders.length > 0 ? 0.05 : 0;
      const totalDiscountPct = loyaltyPct + bulkDiscountPct;
      const discount = subtotal * totalDiscountPct;
      const total = subtotal - discount;
      
      const newOrder: Order = {
        id: `MOD-${Math.floor(10000 + Math.random() * 90000)}`,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...cart],
        subtotalGHS: subtotal,
        discountAppliedGHS: discount,
        totalGHS: total,
        status: 'Processing',
        currencyAtTime: currency,
        exchangeRateAtTime: exchangeRate,
        paymentMethod: 'Mobile Money',
        trackingDetails: {
          currentLocation: 'Central Hub, Shai Hills',
          estimatedArrival: 'Pending Dispatch',
          driverName: 'TBD',
          driverPhone: 'TBD'
        }
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setIsCartOpen(false);
      setIsProcessingCheckout(false);
      addNotification('success', 'Order Placed', 'Your request has been sent to the Modegah Network.');
      setSelectedReceiptOrder(newOrder);
    }, 2000);
  }, [cart, orders.length, currency, exchangeRate, addNotification]);

  const filteredProducts = useMemo(() => {
    let result = [...productList].filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isVisible = userRole === 'ADMIN' ? true : p.isActive;
      return matchesCategory && matchesSearch && isVisible;
    });
    
    result.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.averageRating - a.averageRating;
      return a.displayOrder - b.displayOrder;
    });
    
    return result;
  }, [selectedCategory, searchQuery, sortOption, productList, userRole]);

  const categories = useMemo(() => {
    const cats = new Set(productList.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [productList]);

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    if (role === 'ADMIN') setView(View.ADMIN_DASHBOARD);
    else if (role === 'PARTNER') setView(View.PARTNER_DASHBOARD);
    else setView(View.HOME);
    addNotification('success', 'Access Granted', `Identity verified: ${role} access level enabled.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setView(View.HOME);
    setNotifications([]);
    addNotification('info', 'Secure Sign Out', 'Your session has been terminated safely.');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProductList(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setIsCameraActive(false);
    setIsUploading(false);
    addNotification('success', 'Catalogue Updated', `${updatedProduct.name} has been updated in the network.`);
  };

  const handleAddProduct = (newProduct: Product) => {
    const id = Math.random().toString(36).substr(2, 9);
    const displayOrder = productList.length + 1;
    setProductList(prev => [{...newProduct, id, displayOrder}, ...prev]);
    setEditingProduct(null);
    setIsCameraActive(false);
    setIsUploading(false);
    addNotification('success', 'Product Added', `${newProduct.name} added to the catalogue.`);
  };

  const handleDeleteProduct = (id: string) => {
    if(confirm('Are you sure you want to remove this product from the network?')) {
      setProductList(prev => prev.filter(p => p.id !== id));
      addNotification('warning', 'Product Removed', 'The item has been permanently deleted from the catalogue.');
    }
  };

  const handleCloneProduct = (product: Product) => {
    const cloned = { ...product, id: Math.random().toString(36).substr(2, 9), name: `${product.name} (Clone)`, displayOrder: productList.length + 1 };
    setProductList(prev => [cloned, ...prev]);
    addNotification('success', 'Product Cloned', `Created a copy of ${product.name}.`);
  };

  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const newList = [...productList].sort((a, b) => a.displayOrder - b.displayOrder);
    if (direction === 'up' && index > 0) {
      [newList[index].displayOrder, newList[index-1].displayOrder] = [newList[index-1].displayOrder, newList[index].displayOrder];
    } else if (direction === 'down' && index < newList.length - 1) {
      [newList[index].displayOrder, newList[index+1].displayOrder] = [newList[index+1].displayOrder, newList[index].displayOrder];
    }
    setProductList(newList);
  };

  const handleApplyBulkPrice = () => {
    const multiplier = 1 + (bulkAdjustmentPct / 100);
    setProductList(prev => prev.map(p => ({
      ...p,
      price: Number((p.price * multiplier).toFixed(2))
    })));
    setShowBulkPriceModal(false);
    addNotification('success', 'Bulk Update Complete', `All catalogue prices adjusted by ${bulkAdjustmentPct}%.`);
  };

  const handleUpdatePartner = (updatedPartner: Partner) => {
    setPartners(prev => prev.map(p => p.id === updatedPartner.id ? updatedPartner : p));
    setEditingPartner(null);
    addNotification('success', 'Partner Profile Updated', `${updatedPartner.name} has been updated in the network.`);
  };

  const handleUpdatePartnerStatus = (partnerId: string, status: PartnerStatus) => {
    setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status } : p));
    addNotification('info', 'Partner Status Shift', `Network status changed to ${status}.`);
  };

  const handleAddReview = (productId: string, rating: number, comment: string, userName: string) => {
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      rating,
      comment,
      userName,
      date: new Date().toLocaleDateString()
    };
    setReviews(prev => [newReview, ...prev]);
    addNotification('success', 'Review Posted', 'Thank you for your feedback!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({
          ...editingProduct,
          image: reader.result as string
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      addNotification('error', 'Camera Error', 'Could not access your device camera.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current && editingProduct) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setEditingProduct({ ...editingProduct, image: dataUrl });
        stopCamera();
        addNotification('success', 'Photo Captured', 'Live visual applied to product.');
      }
    }
  };

  const totalAdminStats = useMemo(() => {
    return {
      revenue: orders.reduce((sum, o) => sum + o.totalGHS, 0),
      partnerFees: partners.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.subscriptionFee, 0),
      activePartners: partners.filter(p => p.status === 'APPROVED').length,
      pendingPartners: partners.filter(p => p.status === 'PENDING').length,
      totalSKUs: productList.length
    };
  }, [orders, partners, productList]);

  if (currentView === View.FORGOT_PASSWORD) {
     return <ForgotPassword onBack={() => setView(View.HOME)} setView={setView} />;
  }

  if (!isAuthenticated) return <Login onLogin={handleLoginSuccess} setView={setView} />;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900 animate-in fade-in duration-1000">
      <div className="bg-amber-500 text-slate-900 py-2 px-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 sticky top-0 z-[60] shadow-md">
        <MapPin size={14} fill="currentColor" />
        DELIVERING TO GREATER ACCRA EXCLUSIVELY • EST. DELIVERY: 24-48 HOURS
      </div>
      <NotificationTray notifications={notifications} onDismiss={dismissNotification} />
      <Header 
        currentView={currentView} setView={setView} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout} userRole={userRole}
      />

      <main className="flex-1">
        {currentView === View.HOME && (
          <div className="animate-in fade-in duration-700">
            <section className="relative h-[90vh] flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover brightness-[0.4]" />
              </div>
              <div className="container mx-auto px-4 relative z-10 text-center lg:text-left">
                <div className="max-w-2xl">
                  <h1 className="text-7xl md:text-9xl font-bebas text-white leading-[0.85] mb-6">BUILD WITH <span className="text-amber-500">PRECISION</span></h1>
                  <p className="text-lg md:text-2xl text-slate-300 mb-10 leading-relaxed font-light">The definitive network for high-vibration, precision-molded masonry across Greater Accra.</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    {userRole === 'CLIENT' ? (
                      <button onClick={() => setView(View.SHOP)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-amber-500/20 active:scale-95">Explore Catalogue</button>
                    ) : userRole === 'ADMIN' ? (
                      <button onClick={() => setView(View.ADMIN_DASHBOARD)} className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl active:scale-95">Admin Console</button>
                    ) : (
                      <button onClick={() => setView(View.PARTNER_DASHBOARD)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl active:scale-95">Partner Hub</button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === View.SHOP && (
          <div className="container mx-auto px-4 py-20 animate-in slide-in-from-bottom-5 duration-700">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <h1 className="text-5xl md:text-7xl font-bebas mb-4">ENGINEERING <span className="text-amber-500">CATALOGUE</span></h1>
                <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">Certified industrial materials with guaranteed compressive strength and regional delivery.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                 <div className="relative group flex items-center">
                    <Search className="absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search items..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-amber-500/10 text-sm w-full md:w-80 font-bold transition-all shadow-sm"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                      >
                        <X size={16} />
                      </button>
                    )}
                 </div>
                 <div className="flex items-center bg-white border border-slate-100 rounded-[2rem] p-2 shadow-sm">
                    {['default', 'price-low', 'rating'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setSortOption(opt as any)}
                        className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${sortOption === opt ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {opt.replace('-', ' ')}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-6 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-2 ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-xl shadow-amber-500/20' 
                      : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200 hover:text-slate-600 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={(p) => addToCart(p)} 
                  formatPrice={formatPrice} 
                  onShowDetails={(p) => setSelectedProduct(p)}
                  isWishlisted={wishlist.some(wp => wp.id === product.id)}
                  onToggleWishlist={toggleWishlist}
                  isAdmin={userRole === 'ADMIN'}
                  onEdit={(p) => setEditingProduct(p)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-32 text-center animate-in zoom-in duration-500">
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="text-slate-300" size={40} />
                </div>
                <h3 className="text-3xl font-bebas tracking-wide text-slate-900">NO MATCHES FOUND</h3>
                <p className="text-slate-500 mt-2 font-medium">Try refining your structural parameters or keyword.</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSortOption('default'); }}
                  className="mt-8 bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === View.PROFILE && (
          <ProfileSettings 
            profile={userProfile} 
            settings={notificationSettings} 
            onUpdateProfile={setUserProfile}
            onUpdateSettings={setNotificationSettings}
            addNotification={addNotification}
          />
        )}

        {currentView === View.WISHLIST && (
          <div className="container mx-auto px-4 py-20 animate-in fade-in duration-700">
            <div className="mb-16">
              <h1 className="text-5xl md:text-7xl font-bebas mb-4">SAVED <span className="text-amber-500">PROJECTS</span></h1>
              <p className="text-slate-500 max-w-xl text-lg font-medium">Your curated list of masonry for upcoming structural phases.</p>
            </div>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {wishlist.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={(p) => addToCart(p)} 
                    formatPrice={formatPrice} 
                    onShowDetails={(p) => setSelectedProduct(p)}
                    isWishlisted={true}
                    onToggleWishlist={toggleWishlist}
                    isAdmin={userRole === 'ADMIN'}
                    onEdit={(p) => setEditingProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <Heart className="mx-auto text-slate-100 mb-6" size={80} strokeWidth={1} />
                <h3 className="text-3xl font-bebas tracking-wide text-slate-900">WISHLIST IS EMPTY</h3>
                <p className="text-slate-500 mt-2">Saved items will appear here for easy project planning.</p>
                <button 
                  onClick={() => setView(View.SHOP)}
                  className="mt-10 bg-amber-500 text-slate-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 active:scale-95"
                >
                  Browse Catalogue
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === View.ORDERS && (
          <div className="container mx-auto px-4 py-20">
            <h1 className="text-5xl md:text-7xl font-bebas mb-4">SITE <span className="text-amber-500">HISTORY</span></h1>
            <p className="text-slate-500 mb-12 text-lg font-medium">Review past shipments and current transit logs.</p>
            <OrderHistory orders={orders} formatPrice={formatPrice} onViewReceipt={setSelectedReceiptOrder} />
          </div>
        )}

        {currentView === View.ADMIN_DASHBOARD && userRole === 'ADMIN' && (
           <div className="container mx-auto px-6 py-20 animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="text-red-500" size={20} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Command Center</span>
                </div>
                <h1 className="text-6xl font-bebas tracking-wide">NETWORK <span className="text-amber-500">OVERSIGHT</span></h1>
              </div>
              <div className="flex flex-wrap bg-slate-900 p-2 rounded-[2rem] border border-white/10 shadow-2xl">
                <button onClick={() => setAdminTab('overview')} className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all uppercase ${adminTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-400 hover:text-white'}`}>OVERVIEW</button>
                <button onClick={() => setAdminTab('products')} className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all uppercase ${adminTab === 'products' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-400 hover:text-white'}`}>INVENTORY</button>
                <button onClick={() => setAdminTab('catalogue_designer')} className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all uppercase ${adminTab === 'catalogue_designer' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-400 hover:text-white'}`}>DESIGNER</button>
                <button onClick={() => setAdminTab('partners')} className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all uppercase ${adminTab === 'partners' ? 'bg-amber-500 text-slate-950 shadow-xl' : 'text-slate-400 hover:text-white'}`}>PARTNERS</button>
              </div>
            </div>

            {adminTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm transition-all hover:shadow-xl group">
                  <BarChart3 className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="font-black text-slate-900 mb-1 uppercase tracking-tighter">Gross Volume</h3>
                  <p className="text-4xl font-bebas text-slate-900">{formatPrice(totalAdminStats.revenue)}</p>
                  <p className="text-[10px] text-slate-400 font-black mt-4 uppercase tracking-[0.2em]">Platform-wide Revenue</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm transition-all hover:shadow-xl group">
                  <DollarSign className="text-green-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="font-black text-slate-900 mb-1 uppercase tracking-tighter">Network Fees</h3>
                  <p className="text-4xl font-bebas text-slate-900">{formatPrice(totalAdminStats.partnerFees)}</p>
                  <p className="text-[10px] text-slate-400 font-black mt-4 uppercase tracking-[0.2em]">Monthly SaaS Revenue</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm transition-all hover:shadow-xl group">
                  <Users className="text-purple-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="font-black text-slate-900 mb-1 uppercase tracking-tighter">Active Partners</h3>
                  <p className="text-4xl font-bebas text-slate-900">{totalAdminStats.activePartners}</p>
                  <p className="text-[10px] text-amber-500 font-black mt-4 uppercase tracking-[0.2em]">{totalAdminStats.pendingPartners} Applications Pending</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm transition-all hover:shadow-xl group">
                  <Package className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="font-black text-slate-900 mb-1 uppercase tracking-tighter">Global SKUs</h3>
                  <p className="text-4xl font-bebas text-slate-900">{totalAdminStats.totalSKUs}</p>
                  <p className="text-[10px] text-slate-400 font-black mt-4 uppercase tracking-[0.2em]">Live Catalogue Items</p>
                </div>
              </div>
            )}

            {adminTab === 'products' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <h3 className="text-2xl font-bebas tracking-wide text-slate-800 uppercase">Catalogue Master Control</h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setShowBulkPriceModal(true)}
                      className="bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                    >
                      <TrendingUp size={18} className="text-amber-500" /> Adjust Pricing
                    </button>
                    <button 
                      onClick={() => setEditingProduct({ id: '', name: '', category: 'Hollow', price: 0, description: '', image: '', averageRating: 5, reviewCount: 0, factoryName: 'Modegah Shai Hills', specifications: { dimensions: '', weight: '', strength: '' }, isActive: true, isFeatured: false, displayOrder: productList.length + 1 })}
                      className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                      <Plus size={18} /> Provision New SKU
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Visual</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Metadata</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Price</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Pro Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {productList.sort((a,b) => a.displayOrder - b.displayOrder).map((p, idx) => (
                        <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${p.isFeatured ? 'bg-amber-50/20' : ''}`}>
                          <td className="p-8">
                            <div className="relative group/img w-24 h-24">
                              <img src={p.image} className="w-full h-full rounded-3xl object-cover border border-slate-100 shadow-sm" alt={p.name} />
                              <button 
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e: any) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        handleUpdateProduct({ ...p, image: reader.result as string });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  };
                                  input.click();
                                }}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-3xl text-white"
                                title="Change Image"
                              >
                                <Upload size={18} />
                              </button>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="flex items-center gap-2">
                              <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{p.name}</p>
                              {p.isFeatured && <Award size={16} className="text-amber-500" fill="currentColor" />}
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{p.category} — {p.factoryName}</p>
                            <p className="text-[10px] text-amber-600 font-black mt-2 uppercase tracking-tighter flex items-center gap-1">
                              <Box size={10} /> {p.specifications.dimensions} • {p.specifications.strength}
                            </p>
                          </td>
                          <td className="p-8 text-center">
                            <p className="font-black text-slate-900 text-xl font-bebas tracking-wide">{formatPrice(p.price)}</p>
                          </td>
                          <td className="p-8 text-center space-y-2">
                            <button 
                              onClick={() => handleUpdateProduct({ ...p, isActive: !p.isActive })}
                              className={`w-full inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${p.isActive ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-slate-100 text-slate-400'}`}
                            >
                              {p.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                              {p.isActive ? 'ACTIVE' : 'DORMANT'}
                            </button>
                            <button 
                              onClick={() => handleUpdateProduct({ ...p, isFeatured: !p.isFeatured })}
                              className={`w-full inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${p.isFeatured ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/10' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                            >
                              <Award size={14} />
                              {p.isFeatured ? 'FEATURED' : 'STANDARD'}
                            </button>
                          </td>
                          <td className="p-8 text-right">
                             <div className="flex justify-end gap-2">
                              <button onClick={() => handleCloneProduct(p)} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors shadow-sm" title="Clone SKU"><Copy size={20} /></button>
                              <button onClick={() => setEditingProduct(p)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors shadow-sm" title="Edit SKU"><Edit3 size={20} /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors shadow-sm" title="Delete SKU"><Trash2 size={20} /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'catalogue_designer' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bebas tracking-wide text-slate-800 uppercase">Catalogue Sequencing</h3>
                    <p className="text-slate-500 text-sm">Drag-free manual reordering of products for high-performance merchandising.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-slate-400">Live Preview</span>
                    <button 
                      onClick={() => setAdminPreviewMode(!adminPreviewMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${adminPreviewMode ? 'bg-amber-500' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adminPreviewMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="bg-slate-900 p-5 rounded-t-3xl text-white flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">Master Sequence List</span>
                      <Layout size={18} className="text-amber-500" />
                    </div>
                    <div className="bg-white border border-slate-100 shadow-sm divide-y divide-slate-50 rounded-b-3xl overflow-hidden">
                      {productList.sort((a,b) => a.displayOrder - b.displayOrder).map((p, idx) => (
                        <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                           <div className="flex flex-col items-center text-slate-300 group-hover:text-slate-500 transition-colors">
                             <button onClick={() => handleMoveProduct(idx, 'up')} className="p-1 hover:text-amber-500 disabled:opacity-0" disabled={idx === 0}><MoveUp size={16} /></button>
                             <GripVertical size={18} className="my-1" />
                             <button onClick={() => handleMoveProduct(idx, 'down')} className="p-1 hover:text-amber-500 disabled:opacity-0" disabled={idx === productList.length - 1}><MoveDown size={16} /></button>
                           </div>
                           <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                           <div className="flex-1">
                             <p className="text-sm font-black text-slate-900">{p.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">{p.category} — POS: {p.displayOrder}</p>
                           </div>
                           <div className="flex gap-2">
                             {p.isFeatured && <Award size={14} className="text-amber-500" fill="currentColor" />}
                             {!p.isActive && <EyeOff size={14} className="text-slate-300" />}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
                       <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Settings2 size={18} /> Global Designer Logic
                       </h4>
                       <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-amber-800">Featured Items Stick to Top</p>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Always Active</span>
                         </div>
                         <div className="p-4 bg-white/50 rounded-2xl border border-amber-200 text-[10px] text-amber-800 leading-relaxed italic">
                           "The catalogue automatically prioritizes Featured products. Within those groups, items are sequenced by their manual Display Order."
                         </div>
                       </div>
                    </div>

                    {adminPreviewMode && (
                      <div className="border-4 border-dashed border-amber-300 rounded-[3rem] p-4 bg-slate-50 animate-in slide-in-from-right-4">
                         <p className="text-[10px] font-black text-center text-amber-500 uppercase mb-4 tracking-[0.3em]">Client View Simulation</p>
                         <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                           {filteredProducts.map(p => (
                             <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                               <div className="flex gap-4">
                                 <img src={p.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                 <div>
                                   <p className="text-sm font-black text-slate-900">{p.name}</p>
                                   <p className="text-sm font-bebas tracking-wide text-amber-600 mt-2">{formatPrice(p.price)}</p>
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'partners' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bebas tracking-wide text-slate-800 uppercase">Network Partners Control</h3>
                </div>
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Partner Identity</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tier & Logistics</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Financials</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                        <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {partners.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-8">
                            <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{p.name}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                              <MapPin size={10} /> {p.location}
                            </p>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-2 mb-1">
                               <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                 p.tier === 'enterprise' ? 'bg-purple-100 text-purple-700' : p.tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                               }`}>
                                 {p.tier}
                               </span>
                               <p className="text-xs font-bold text-slate-600">{p.activeFleetCount} Fleet Units</p>
                             </div>
                             <p className="text-[10px] text-slate-400 font-black uppercase">Capacity: {p.productionCapacity.toLocaleString()} / Day</p>
                          </td>
                          <td className="p-8">
                             <p className="text-sm font-black text-slate-900">{formatPrice(p.revenueGenerated)}</p>
                             <p className="text-[10px] text-green-600 font-black uppercase mt-1">Fee: {formatPrice(p.subscriptionFee)}</p>
                          </td>
                          <td className="p-8 text-center">
                            <button 
                              onClick={() => handleUpdatePartnerStatus(p.id, p.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')}
                              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                p.status === 'APPROVED' ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-700' : p.status === 'PENDING' ? 'bg-amber-100 text-amber-700 hover:bg-green-50' : 'bg-red-100 text-red-700 hover:bg-green-50'
                              }`}
                            >
                              {p.status}
                            </button>
                          </td>
                          <td className="p-8 text-right">
                             <div className="flex justify-end gap-2">
                               <button 
                                onClick={() => setEditingPartner(p)}
                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                title="Edit Partner Profile"
                               >
                                 <Edit3 size={18} />
                               </button>
                               <button className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-colors">
                                 <Ban size={18} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              </div>
            )}
           </div>
        )}

        {currentView === View.PARTNER && <PartnerPortal setView={setView} />}
        {userRole === 'PARTNER' && currentView === View.PARTNER_DASHBOARD && <PartnerDashboard addNotification={addNotification} />}
        {userRole === 'PARTNER' && currentView === View.PARTNER_SETTINGS && <PartnerSettings addNotification={addNotification} />}
        {currentView === View.CALCULATOR && <div className="max-w-4xl mx-auto py-20 px-4"><BlockCalculator onAddToCart={addToCart} cementProducts={productList.filter(p => p.category === 'Cement')} /></div>}
        {(currentView === View.PRIVACY || currentView === View.TERMS) && <LegalView type={currentView === View.PRIVACY ? 'privacy' : 'terms'} setView={setView} />}
      </main>

      <Footer setView={setView} onOpenChat={() => setIsChatOpen(true)} orders={orders} />
      
      <Cart 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} 
        onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} onCheckout={handleCheckout} 
        formatPrice={formatPrice} discountPercentage={orders.length > 0 ? 0.05 : 0} 
      />

      <AIConsultant isOpen={isChatOpen} setIsOpen={setIsChatOpen} />

      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          formatPrice={formatPrice} 
          onAddToCart={addToCart} 
          isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
          onToggleWishlist={toggleWishlist}
          reviews={reviews.filter(r => r.productId === selectedProduct.id)} 
          onAddReview={handleAddReview} 
          isAdmin={userRole === 'ADMIN'}
          onEdit={(p) => { setSelectedProduct(null); setEditingProduct(p); }}
        />
      )}
      {selectedReceiptOrder && <ReceiptModal order={selectedReceiptOrder} onClose={() => setSelectedReceiptOrder(null)} formatPrice={formatPrice} />}

      {/* Bulk Price Adjustment Modal */}
      {showBulkPriceModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowBulkPriceModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-3xl font-bebas text-slate-900 mb-6 uppercase">Bulk Price <span className="text-amber-500">Adjustment</span></h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">Shift all catalogue prices based on market volatility. Use positive values for increases and negative for discounts.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Percentage Change (%)</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setBulkAdjustmentPct(prev => prev - 1)} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"><MoveDown size={20} /></button>
                  <input 
                    type="number" 
                    value={bulkAdjustmentPct} 
                    onChange={e => setBulkAdjustmentPct(parseFloat(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 font-black text-2xl text-center" 
                  />
                  <button onClick={() => setBulkAdjustmentPct(prev => prev + 1)} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"><MoveUp size={20} /></button>
                </div>
              </div>

              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Projection Example</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Standard Block (GH₵ 12.50)</span>
                  <span className="text-sm font-black text-slate-900">→ GH₵ {(12.50 * (1 + bulkAdjustmentPct/100)).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowBulkPriceModal(false)} className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all">Cancel</button>
                <button 
                  onClick={handleApplyBulkPrice}
                  className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
                >
                  Confirm Global Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Edit Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setEditingPartner(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-10">
               <h3 className="text-4xl font-bebas text-slate-900 uppercase">Manage <span className="text-amber-500">Partner Node</span></h3>
               <button onClick={() => setEditingPartner(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Entity Name</label>
                    <div className="relative">
                      <input 
                        value={editingPartner.name} 
                        onChange={e => setEditingPartner({...editingPartner, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                      />
                      <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Operational Tier</label>
                    <select 
                      value={editingPartner.tier}
                      onChange={e => setEditingPartner({...editingPartner, tier: e.target.value as any})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800"
                    >
                      <option value="standard">Standard Node</option>
                      <option value="premium">Premium Node</option>
                      <option value="enterprise">Enterprise Node</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fleet Count</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={editingPartner.activeFleetCount} 
                        onChange={e => setEditingPartner({...editingPartner, activeFleetCount: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                      />
                      <Truck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Production Cap (Units/Day)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={editingPartner.productionCapacity} 
                        onChange={e => setEditingPartner({...editingPartner, productionCapacity: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                      />
                      <Factory className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                  </div>
                </div>
             </div>

             <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Network Verification</p>
                     <p className="text-white font-bold">Node Identity Status: {editingPartner.status}</p>
                   </div>
                </div>
                <button 
                  onClick={() => setEditingPartner({...editingPartner, status: editingPartner.status === 'APPROVED' ? 'REJECTED' : 'APPROVED'})}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    editingPartner.status === 'APPROVED' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {editingPartner.status === 'APPROVED' ? 'Suspend Node' : 'Authorize Node'}
                </button>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setEditingPartner(null)} className="flex-1 bg-slate-100 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-200">Discard</button>
                <button 
                  onClick={() => handleUpdatePartner(editingPartner)}
                  className="flex-[2] bg-slate-900 text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 flex items-center justify-center gap-2"
                >
                  Update Global Record <Check size={18} className="text-amber-500" />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => { stopCamera(); setEditingProduct(null); }} />
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] p-10 sm:p-16 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-bebas text-slate-900 uppercase tracking-wide">{editingProduct.id ? 'UPDATE' : 'PROVISION'} <span className="text-amber-500">CATALOGUE UNIT</span></h3>
              <button onClick={() => { stopCamera(); setEditingProduct(null); }} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><X size={28} /></button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset</label>
                <div className="w-full aspect-square bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                  {isCameraActive ? (
                    <div className="w-full h-full relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
                        <button onClick={takeSnapshot} className="bg-amber-500 text-slate-900 p-5 rounded-full shadow-2xl hover:scale-110 transition-transform"><Camera size={32} /></button>
                        <button onClick={stopCamera} className="bg-red-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform"><X size={32} /></button>
                      </div>
                    </div>
                  ) : editingProduct.image ? (
                    <>
                      <img src={editingProduct.image} className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`} alt="Preview" />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
                          <Loader2 className="animate-spin text-amber-500" size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 p-8">
                           <button onClick={() => fileInputRef.current?.click()} className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-4 rounded-3xl flex flex-col items-center gap-2 flex-1"><Upload size={24} className="text-white" /><span className="text-[9px] font-black text-white uppercase">Replace File</span></button>
                           <button onClick={startCamera} className="bg-amber-500 hover:bg-amber-400 px-6 py-4 rounded-3xl flex flex-col items-center gap-2 flex-1"><Camera size={24} className="text-slate-900" /><span className="text-[9px] font-black text-slate-900 uppercase">Live Capture</span></button>
                      </div>
                      <button 
                        onClick={() => setEditingProduct({...editingProduct, image: ''})}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                        title="Clear Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <ImageIcon size={64} className="text-slate-200" />
                      <div className="flex gap-4">
                         <button onClick={() => fileInputRef.current?.click()} className="bg-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-slate-100 hover:bg-slate-50 flex items-center gap-2 transition-all"><Upload size={16} /> Load Image</button>
                         <button onClick={startCamera} className="bg-amber-500 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-amber-400 hover:bg-amber-400 flex items-center gap-2 transition-all"><Camera size={16} /> Open Camera</button>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CDN Asset Link</label>
                  <input 
                    type="text" 
                    value={editingProduct.image} 
                    onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 text-xs text-slate-400 font-bold" 
                    placeholder="Direct image URL..."
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Asset Nomenclature</label>
                  <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 font-black text-lg" placeholder="Product Name" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Category</label>
                    <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold text-sm">
                      {['Hollow', 'Solid', 'Paving', 'Decorative', 'Cement', 'Interlocking', 'U-Block'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Unit Price (GHS)</label>
                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 font-black text-xl" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Featured Status</p>
                    <p className="text-[10px] text-slate-400 font-bold">Promote this SKU to top of catalogue</p>
                  </div>
                  <button 
                    onClick={() => setEditingProduct({...editingProduct, isFeatured: !editingProduct.isFeatured})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${editingProduct.isFeatured ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editingProduct.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Technical Brief</label>
                  <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-5 outline-none focus:ring-4 focus:ring-amber-500/10 text-sm font-medium h-48 resize-none leading-relaxed" placeholder="Detailed product specifications and usage guidance..." />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Origin Factory</label>
                <input value={editingProduct.factoryName} onChange={e => setEditingProduct({...editingProduct, factoryName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Metric Dimensions</label>
                <input value={editingProduct.specifications.dimensions} onChange={e => setEditingProduct({...editingProduct, specifications: {...editingProduct.specifications, dimensions: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 text-sm font-bold" placeholder="e.g. 400x200x150mm" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Lab Tested Strength</label>
                <input value={editingProduct.specifications.strength} onChange={e => setEditingProduct({...editingProduct, specifications: {...editingProduct.specifications, strength: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 text-sm font-bold" placeholder="e.g. 3.5 N/mm²" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-16">
              <button onClick={() => { stopCamera(); setEditingProduct(null); }} className="flex-1 bg-slate-100 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all active:scale-95">Discard Changes</button>
              <button 
                onClick={() => {
                  if (editingProduct.id) {
                    handleUpdateProduct(editingProduct);
                  } else {
                    handleAddProduct(editingProduct);
                  }
                }} 
                className="flex-[2] bg-slate-900 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest text-white shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {editingProduct.id ? 'COMMIT NETWORK UPDATE' : 'PROVISION UNIT TO NETWORK'}
                <Check size={20} className="text-amber-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
