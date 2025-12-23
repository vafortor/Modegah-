
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import LegalView from './components/LegalView';
import ReceiptModal from './components/ReceiptModal';
import NotificationTray from './components/NotificationTray';
import { Product, CartItem, View, Currency, Review, Order, SortOption, UserRole, Notification } from './types';
import { PRODUCTS, GHS_TO_USD_RATE, INITIAL_REVIEWS, INITIAL_ORDERS } from './constants';
import { ArrowRight, Star, ShieldCheck, Truck, Clock, RefreshCw, AlertCircle, LayoutGrid, Box, Grid3X3, Trees, Package, Building2, ArrowUpDown, ChevronDown, Filter, X, Search, Loader2, CreditCard, Award, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentView, setView] = useState<View>(View.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currency, setCurrency] = useState<Currency>('GHS');
  const [exchangeRate, setExchangeRate] = useState(GHS_TO_USD_RATE);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Security Redirection
  useEffect(() => {
    if (isAuthenticated && userRole === 'PARTNER') {
      const allowedViews = [View.PARTNER_DASHBOARD, View.SHOP, View.HOME, View.PARTNER_SETTINGS];
      if (!allowedViews.includes(currentView)) {
        setView(View.PARTNER_DASHBOARD);
      }
    }
  }, [isAuthenticated, userRole, currentView]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('modegah_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('modegah_orders', JSON.stringify(orders));
  }, [orders]);

  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, title, message, timestamp: Date.now() }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.totalGHS, 0);
  }, [orders]);

  const loyaltyTier = useMemo(() => {
    if (totalSpent >= 20000) return { name: 'Gold Builder', discount: 0.05, next: 'Maxed' };
    if (totalSpent >= 5000) return { name: 'Silver Builder', discount: 0.02, next: '20,000 GH₵ for Gold' };
    return { name: 'Bronze Builder', discount: 0, next: '5,000 GH₵ for Silver' };
  }, [totalSpent]);

  // Effect to notify user of loyalty tier upgrades
  useEffect(() => {
    if (totalSpent >= 20000) {
      // Could add logic to only notify once
    } else if (totalSpent >= 5000) {
      // Similarly for Silver
    }
  }, [totalSpent, addNotification]);

  const formatPrice = useCallback((priceInGHS: number) => {
    if (currency === 'USD') {
      const converted = priceInGHS * exchangeRate;
      return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `GH₵${priceInGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency, exchangeRate]);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS].filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }

    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  const handleCategoryNavigation = (category: string) => {
    setSelectedCategory(category);
    setView(View.SHOP);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    addNotification('success', 'Cart Updated', `Added ${quantity} units of ${product.name} to your cart.`);
    setIsCartOpen(true);
  };

  const handleAddReview = (productId: string, rating: number, comment: string, userName: string) => {
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);
    addNotification('info', 'Review Posted', 'Thank you for your feedback! Your review is now live.');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (delta > 0) addNotification('info', 'Quantity Increased', `Increased ${item.name} to ${newQty} units.`);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    const item = cart.find(i => i.id === id);
    if (item) {
      setCart(prev => prev.filter(item => item.id !== id));
      addNotification('warning', 'Item Removed', `${item.name} has been removed from your cart.`);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsProcessingCheckout(true);
    addNotification('info', 'Payment Initiated', 'Please check your phone for the MoMo prompt.');

    // Simulate MoMo Payment Processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const subtotalGHS = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountApplied = subtotalGHS * loyaltyTier.discount;
    
    const newOrder: Order = {
      id: `MOD-${Math.floor(10000 + Math.random() * 90000)}`,
      transactionId: `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotalGHS: subtotalGHS,
      discountAppliedGHS: discountApplied,
      totalGHS: subtotalGHS - discountApplied,
      status: 'Processing',
      currencyAtTime: currency,
      exchangeRateAtTime: exchangeRate,
      paymentMethod: 'Mobile Money'
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsProcessingCheckout(false);
    setCart([]);
    setIsCartOpen(false);
    setView(View.ORDERS);
    addNotification('success', 'Order Confirmed', `Order ${newOrder.id} has been placed successfully.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setView(role === 'PARTNER' ? View.PARTNER_DASHBOARD : View.HOME);
    addNotification('success', 'Welcome Back', `Logged in successfully as a ${role === 'PARTNER' ? 'Certified Partner' : 'Customer'}.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setView(View.HOME);
    setNotifications([]);
    addNotification('info', 'Signed Out', 'You have been safely logged out of your Modegah account.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Hollow', icon: Box },
    { name: 'Solid', icon: Grid3X3 },
    { name: 'Paving', icon: Grid3X3 },
    { name: 'Decorative', icon: Trees },
    { name: 'Cement', icon: Package },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Featured', value: 'default' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
  ];

  if (!isAuthenticated) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900 animate-in fade-in duration-1000">
      <NotificationTray notifications={notifications} onDismiss={dismissNotification} />
      
      <Header 
        currentView={currentView} 
        setView={setView} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)} 
        currency={currency}
        setCurrency={setCurrency}
        onLogout={handleLogout}
        userRole={userRole}
      />

      <main className="flex-1">
        {currentView === View.HOME && (
          <div className="animate-in fade-in duration-700">
            <section className="relative h-[80vh] flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=2000" 
                  alt="Construction Site Background" 
                  className="w-full h-full object-cover brightness-[0.4]"
                />
              </div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl">
                  {userRole === 'CLIENT' && (
                    <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-amber-500/20">
                      <Award size={14} fill="currentColor" /> {loyaltyTier.name} Status
                    </div>
                  )}
                  <h1 className="text-6xl md:text-8xl font-bebas text-white leading-[0.9] mb-6">
                    BUILD WITH <span className="text-amber-500">CONFIDENCE</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
                    Modegah provides high-vibration, precision-molded blocks. <span className="text-white font-semibold">Our certified partner network delivers across Greater Accra.</span>
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {userRole === 'CLIENT' ? (
                      <>
                        <button 
                          onClick={() => setView(View.SHOP)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
                        >
                          Browse Products <ArrowRight size={20} />
                        </button>
                        <button 
                          onClick={() => setView(View.PARTNER)}
                          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"
                        >
                          <Building2 size={20} /> Factory Partnership
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setView(View.PARTNER_DASHBOARD)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
                      >
                        Enter Factory Dashboard <LayoutGrid size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
            
            <section className="py-20 bg-slate-50 border-y border-slate-200">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-5xl font-bebas tracking-wide mb-2">SHOP BY <span className="text-amber-500">CATEGORY</span></h2>
                  <p className="text-slate-500">Fast-track your search by selecting your project's specific needs.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
                  {categories.filter(c => c.name !== 'All').map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryNavigation(cat.name)}
                      className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 text-center flex flex-col items-center gap-4 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors" />
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                        <cat.icon size={24} />
                      </div>
                      <h3 className="font-bold text-sm md:text-base text-slate-800">{cat.name}</h3>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">View All</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === View.SHOP && (
          <div className="container mx-auto px-4 py-12 animate-in slide-in-from-bottom-5 duration-500">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bebas mb-4">{userRole === 'PARTNER' ? 'MARKETPLACE' : 'CATALOGUE'} <span className="text-amber-500">ACCESS</span></h1>
                <p className="text-slate-500 max-w-xl">
                  {userRole === 'PARTNER' 
                    ? "Monitor competitor unit pricing and cement brand standards."
                    : "Find premium units and certified cement brands from Modegah and our partners."
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {userRole === 'CLIENT' && loyaltyTier.discount > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                    <Award className="text-amber-600" size={20} />
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase">Loyalty Reward Applied</p>
                      <p className="text-sm font-bold text-amber-900">{(loyaltyTier.discount * 100).toFixed(0)}% Discount active</p>
                    </div>
                  </div>
                )}
                
                {/* Sorting Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <label htmlFor="sort-select" className="sr-only">Sort by</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-amber-500 transition-all">
                    <ArrowUpDown size={16} className="text-slate-400" />
                    <select 
                      id="sort-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer pr-4"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Search</h3>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-sm shadow-sm transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                          selectedCategory === cat.name 
                            ? 'bg-slate-900 text-white font-bold shadow-lg' 
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <cat.icon size={18} className={selectedCategory === cat.name ? 'text-amber-500' : 'text-slate-400'} />
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                {/* Mobile Search & Filter Trigger */}
                <div className="lg:hidden flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-sm shadow-sm transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                  <button 
                    onClick={() => setIsFilterMobileOpen(true)}
                    className="p-3 bg-slate-900 text-white rounded-xl shadow-lg"
                  >
                    <Filter size={20} />
                  </button>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={(p) => userRole === 'CLIENT' ? addToCart(p) : {}}
                        formatPrice={formatPrice}
                        onShowDetails={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No items found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {userRole === 'CLIENT' && (
          <>
            {currentView === View.CALCULATOR && (
              <div className="container mx-auto px-4 py-12 animate-in zoom-in duration-500">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bebas mb-4">SMART <span className="text-amber-500">ESTIMATOR</span></h1>
                    <p className="text-slate-500 max-w-xl mx-auto">Calculate material requirements for your Accra-based site and add directly to cart.</p>
                  </div>
                  <BlockCalculator 
                    onAddToCart={addToCart} 
                    cementProducts={PRODUCTS.filter(p => p.category === 'Cement')}
                  />
                </div>
              </div>
            )}

            {currentView === View.ORDERS && (
              <div className="container mx-auto px-4 py-12 animate-in slide-in-from-right-10 duration-500">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-12 flex flex-col items-center text-center">
                    <h1 className="text-5xl font-bebas mb-4">ORDER <span className="text-amber-500">HISTORY</span></h1>
                    <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-xl p-6 mt-4 flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-20 h-20 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                        <Award size={40} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-black text-slate-900">{loyaltyTier.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mb-3">Total Investment: {formatPrice(totalSpent)}</p>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                          <div 
                            className="bg-amber-500 h-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, (totalSpent / (totalSpent >= 20000 ? totalSpent : totalSpent >= 5000 ? 20000 : 5000)) * 100)}%` }} 
                          />
                        </div>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                          {loyaltyTier.next !== 'Maxed' ? `NEXT: ${loyaltyTier.next}` : 'MAXIMUM DISCOUNT REACHED'}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Reward</p>
                        <p className="text-2xl font-bebas text-slate-900">{(loyaltyTier.discount * 100).toFixed(0)}% OFF</p>
                      </div>
                    </div>
                  </div>
                  <OrderHistory 
                    orders={orders} 
                    formatPrice={formatPrice} 
                    onViewReceipt={(order) => setSelectedReceiptOrder(order)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {userRole === 'PARTNER' && currentView === View.PARTNER_DASHBOARD && (
          <PartnerDashboard />
        )}

        {userRole === 'PARTNER' && currentView === View.PARTNER_SETTINGS && (
          <PartnerSettings addNotification={addNotification} />
        )}

        {currentView === View.PRIVACY && (
          <LegalView type="privacy" setView={setView} />
        )}

        {currentView === View.TERMS && (
          <LegalView type="terms" setView={setView} />
        )}
      </main>

      {/* Mobile Category Filter Modal */}
      {isFilterMobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFilterMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bebas tracking-wide">FILTER <span className="text-amber-500">CATEGORIES</span></h3>
              <button onClick={() => setIsFilterMobileOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => { setSelectedCategory(cat.name); setIsFilterMobileOpen(false); }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selectedCategory === cat.name 
                      ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold' 
                      : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <cat.icon size={18} className={selectedCategory === cat.name ? 'text-amber-600' : 'text-slate-400'} />
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {userRole === 'CLIENT' && (
        <>
          <Footer setView={setView} onOpenChat={() => setIsChatOpen(true)} orders={orders} />
          <Cart 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
            formatPrice={formatPrice}
            discountPercentage={loyaltyTier.discount}
          />
          <AIConsultant isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
          {selectedProduct && (
            <ProductDetailsModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              formatPrice={formatPrice}
              onAddToCart={addToCart}
              reviews={reviews.filter(r => r.productId === selectedProduct.id)}
              onAddReview={handleAddReview}
            />
          )}
          {selectedReceiptOrder && (
            <ReceiptModal 
              order={selectedReceiptOrder} 
              onClose={() => setSelectedReceiptOrder(null)} 
              formatPrice={formatPrice}
            />
          )}
        </>
      )}

      {isProcessingCheckout && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="animate-spin" size={40} />
            </div>
            <h3 className="text-2xl font-bebas tracking-wide mb-2">SECURE <span className="text-amber-500">PAYMENT</span></h3>
            <p className="text-slate-500 text-sm mb-6">Processing your MoMo transaction via Modegah secure gateway...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
