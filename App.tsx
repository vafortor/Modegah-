
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
import { ArrowRight, Star, ShieldCheck, Truck, Clock, RefreshCw, AlertCircle, LayoutGrid, Box, Grid3X3, Trees, Package, Building2, ArrowUpDown, ChevronDown, Filter, X, Search, Loader2, CreditCard, Award, Bell, ShieldAlert, BarChart3, Users, Globe } from 'lucide-react';

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

  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + order.totalGHS, 0), [orders]);

  const loyaltyTier = useMemo(() => {
    if (totalSpent >= 20000) return { name: 'Gold Builder', discount: 0.05, next: 'Maxed' };
    if (totalSpent >= 5000) return { name: 'Silver Builder', discount: 0.02, next: '20,000 GH₵ for Gold' };
    return { name: 'Bronze Builder', discount: 0, next: '5,000 GH₵ for Silver' };
  }, [totalSpent]);

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
    if (sortOption === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortOption === 'rating') result.sort((a, b) => b.averageRating - a.averageRating);
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
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    addNotification('success', 'Cart Updated', `Added ${quantity} units of ${product.name} to your cart.`);
    setIsCartOpen(true);
  };

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

  if (!isAuthenticated) return <Login onLogin={handleLoginSuccess} />;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900 animate-in fade-in duration-1000">
      <NotificationTray notifications={notifications} onDismiss={dismissNotification} />
      <Header 
        currentView={currentView} setView={setView} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)} 
        currency={currency} setCurrency={setCurrency}
        onLogout={handleLogout} userRole={userRole}
      />

      <main className="flex-1">
        {currentView === View.HOME && (
          <div className="animate-in fade-in duration-700">
            <section className="relative h-[80vh] flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover brightness-[0.4]" />
              </div>
              <div className="container mx-auto px-4 relative z-10 text-center lg:text-left">
                <div className="max-w-2xl">
                  {userRole === 'CLIENT' && (
                    <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                      <Award size={14} fill="currentColor" /> {loyaltyTier.name} Status
                    </div>
                  )}
                  <h1 className="text-6xl md:text-8xl font-bebas text-white leading-[0.9] mb-6">BUILD WITH <span className="text-amber-500">CONFIDENCE</span></h1>
                  <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">Modegah provides high-vibration, precision-molded blocks. <span className="text-white font-semibold">Certified partner network delivers across Greater Accra.</span></p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    {userRole === 'CLIENT' ? (
                      <button onClick={() => setView(View.SHOP)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">Browse Products</button>
                    ) : userRole === 'ADMIN' ? (
                      <button onClick={() => setView(View.ADMIN_DASHBOARD)} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">Admin Console</button>
                    ) : (
                      <button onClick={() => setView(View.PARTNER_DASHBOARD)} className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">Partner Hub</button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === View.ADMIN_DASHBOARD && userRole === 'ADMIN' && (
          <div className="container mx-auto px-6 py-12 animate-in slide-in-from-bottom-5 duration-700">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="text-red-500" size={18} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Administration</span>
              </div>
              <h1 className="text-5xl font-bebas tracking-wide">NETWORK <span className="text-amber-500">OVERSIGHT</span></h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <BarChart3 className="text-blue-500 mb-4" size={32} />
                <h3 className="font-bold text-slate-900 mb-1">Global Revenue</h3>
                <p className="text-3xl font-bebas text-slate-900">GH₵ 412.5k</p>
                <p className="text-xs text-green-600 font-bold mt-2">+18% vs Last Month</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <Users className="text-purple-500 mb-4" size={32} />
                <h3 className="font-bold text-slate-900 mb-1">Active Partners</h3>
                <p className="text-3xl font-bebas text-slate-900">14 Factories</p>
                <p className="text-xs text-slate-400 font-medium mt-2">2 Applications Pending</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <Globe className="text-amber-500 mb-4" size={32} />
                <h3 className="font-bold text-slate-900 mb-1">Total Deliveries</h3>
                <p className="text-3xl font-bebas text-slate-900">1,245 Sites</p>
                <p className="text-xs text-slate-400 font-medium mt-2">Greater Accra Coverage</p>
              </div>
            </div>
          </div>
        )}

        {currentView === View.SHOP && (
          <div className="container mx-auto px-4 py-12 animate-in slide-in-from-bottom-5 duration-500">
            {/* Standard Shop Content Rendering */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bebas mb-4">PRODUCT <span className="text-amber-500">CATALOGUE</span></h1>
                <p className="text-slate-500 max-w-xl">Certified construction materials for high-integrity builds.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={(p) => addToCart(p)} formatPrice={formatPrice} onShowDetails={(p) => setSelectedProduct(p)} />
              ))}
            </div>
          </div>
        )}

        {userRole === 'PARTNER' && currentView === View.PARTNER_DASHBOARD && <PartnerDashboard />}
        {userRole === 'PARTNER' && currentView === View.PARTNER_SETTINGS && <PartnerSettings addNotification={addNotification} />}
        {currentView === View.CALCULATOR && userRole === 'CLIENT' && <div className="max-w-4xl mx-auto py-12 px-4"><BlockCalculator onAddToCart={addToCart} cementProducts={PRODUCTS.filter(p => p.category === 'Cement')} /></div>}
        {currentView === View.ORDERS && userRole === 'CLIENT' && <div className="max-w-4xl mx-auto py-12 px-4"><OrderHistory orders={orders} formatPrice={formatPrice} onViewReceipt={(o) => setSelectedReceiptOrder(o)} /></div>}
      </main>

      <Footer setView={setView} onOpenChat={() => setIsChatOpen(true)} orders={orders} />
      
      <Cart 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        items={cart} onUpdateQuantity={(id, d) => {}} onRemoveItem={(id) => {}}
        onCheckout={() => {}} formatPrice={formatPrice} discountPercentage={loyaltyTier.discount} 
      />
    </div>
  );
};

export default App;
