
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
import LegalView from './components/LegalView';
import ReceiptModal from './components/ReceiptModal';
import NotificationTray from './components/NotificationTray';
import { Product, CartItem, View, Currency, Review, Order, SortOption, UserRole, Notification, Partner, PartnerStatus } from './types';
import { PRODUCTS, GHS_TO_USD_RATE, INITIAL_REVIEWS, INITIAL_ORDERS, SAMPLE_PARTNERS } from './constants';
import { ArrowRight, Star, ShieldCheck, Truck, Clock, RefreshCw, AlertCircle, LayoutGrid, Box, Grid3X3, Trees, Package, Building2, ArrowUpDown, ChevronDown, Filter, X, Search, Loader2, CreditCard, Award, Bell, ShieldAlert, BarChart3, Users, Globe, Edit3, Trash2, Check, Ban, Plus, CheckCircle2, DollarSign, Eye, EyeOff, TrendingUp, MapPin, Camera, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentView, setView] = useState<View>(View.HOME);
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [partners, setPartners] = useState<Partner[]>(SAMPLE_PARTNERS);
  const [cart, setCart] = useState<CartItem[]>([]);
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
  
  // Admin Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'partners'>('overview');
  const [isCameraActive, setIsCameraActive] = useState(false);
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
      const discount = subtotal * (orders.length > 0 ? 0.05 : 0);
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
    if (sortOption === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortOption === 'rating') result.sort((a, b) => b.averageRating - a.averageRating);
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
    addNotification('success', 'Catalogue Updated', `${updatedProduct.name} has been updated.`);
  };

  const handleAddProduct = (newProduct: Product) => {
    const id = Math.random().toString(36).substr(2, 9);
    setProductList(prev => [{...newProduct, id}, ...prev]);
    setEditingProduct(null);
    setIsCameraActive(false);
    addNotification('success', 'Product Added', `${newProduct.name} added to the catalogue.`);
  };

  const handleDeleteProduct = (id: string) => {
    if(confirm('Are you sure you want to remove this product from the network?')) {
      setProductList(prev => prev.filter(p => p.id !== id));
      addNotification('warning', 'Product Removed', 'The item has been permanently deleted from the catalogue.');
    }
  };

  const handleUpdatePartnerStatus = (partnerId: string, status: PartnerStatus) => {
    setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status } : p));
    addNotification('info', 'Partner Updated', `Partner status changed to ${status}.`);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({
          ...editingProduct,
          image: reader.result as string
        });
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

  if (!isAuthenticated) return <Login onLogin={handleLoginSuccess} />;

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="text-red-500" size={18} />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise Command Center</span>
                </div>
                <h1 className="text-5xl font-bebas tracking-wide">NETWORK <span className="text-amber-500">OVERSIGHT</span></h1>
              </div>
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/10 shadow-xl">
                <button onClick={() => setAdminTab('overview')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${adminTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>OVERVIEW</button>
                <button onClick={() => setAdminTab('products')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${adminTab === 'products' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>CATALOGUE</button>
                <button onClick={() => setAdminTab('partners')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${adminTab === 'partners' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>PARTNERS</button>
              </div>
            </div>

            {adminTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <BarChart3 className="text-blue-500 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Total Orders</h3>
                  <p className="text-3xl font-bebas text-slate-900">{formatPrice(totalAdminStats.revenue)}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Platform Gross Volume</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <DollarSign className="text-green-500 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Partner Fees</h3>
                  <p className="text-3xl font-bebas text-slate-900">{formatPrice(totalAdminStats.partnerFees)}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Monthly Recurring Revenue</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <Users className="text-purple-500 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Partners</h3>
                  <p className="text-3xl font-bebas text-slate-900">{totalAdminStats.activePartners} Active</p>
                  <p className="text-[10px] text-amber-500 font-bold mt-2 uppercase">{totalAdminStats.pendingPartners} Pending Applications</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <Package className="text-amber-500 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Catalogue</h3>
                  <p className="text-3xl font-bebas text-slate-900">{totalAdminStats.totalSKUs} SKUs</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Centralized Inventory</p>
                </div>
              </div>
            )}

            {adminTab === 'products' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Catalogue Control Panel</h3>
                  <button 
                    onClick={() => setEditingProduct({ id: '', name: '', category: 'Hollow', price: 0, description: '', image: '', averageRating: 5, reviewCount: 0, factoryName: 'Modegah Shai Hills', specifications: { dimensions: '', weight: '', strength: '' }, isActive: true })}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800"
                  >
                    <Plus size={18} /> Add New SKU
                  </button>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Image</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Details</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Price</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Visibility</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {productList.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-6">
                            <img src={p.image} className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm" alt={p.name} />
                          </td>
                          <td className="p-6">
                            <p className="font-bold text-slate-900 text-base">{p.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{p.category} — {p.factoryName}</p>
                            <p className="text-[10px] text-amber-600 font-black mt-1 uppercase tracking-tighter">{p.specifications.dimensions} • {p.specifications.strength}</p>
                          </td>
                          <td className="p-6 text-center">
                            <p className="font-black text-slate-900 text-lg">{formatPrice(p.price)}</p>
                          </td>
                          <td className="p-6 text-center">
                            <button 
                              onClick={() => handleUpdateProduct({ ...p, isActive: !p.isActive })}
                              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${p.isActive ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-slate-100 text-slate-400'}`}
                            >
                              {p.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                              {p.isActive ? 'Public' : 'Hidden'}
                            </button>
                          </td>
                          <td className="p-6 text-right space-x-2">
                            <button onClick={() => setEditingProduct(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"><Edit3 size={18} /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shadow-sm"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'partners' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Modegah Partner Network</h3>
                <div className="grid grid-cols-1 gap-4">
                  {partners.map(p => (
                    <div key={p.id} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${p.status === 'APPROVED' ? 'bg-green-50 text-green-600' : p.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                          <Building2 size={32} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-slate-900 text-lg">{p.name}</h4>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.tier === 'enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>{p.tier} TIER</span>
                          </div>
                          <p className="text-xs text-slate-500">{p.location} • {p.contact}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center gap-1">
                              <DollarSign size={10} /> Fee: {formatPrice(p.subscriptionFee)}/mo
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center gap-1">
                              <TrendingUp size={10} /> Rev: {formatPrice(p.revenueGenerated)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {p.status === 'PENDING' ? (
                          <>
                            <button onClick={() => handleUpdatePartnerStatus(p.id, 'REJECTED')} className="px-6 py-2.5 text-xs font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50">REJECT</button>
                            <button onClick={() => handleUpdatePartnerStatus(p.id, 'APPROVED')} className="px-6 py-2.5 text-xs font-bold bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20">APPROVE PARTNER</button>
                          </>
                        ) : (
                          <div className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold ${p.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {p.status === 'APPROVED' ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                            {p.status}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === View.SHOP && (
          <div className="container mx-auto px-4 py-12 animate-in slide-in-from-bottom-5 duration-500">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bebas mb-4">PRODUCT <span className="text-amber-500">CATALOGUE</span></h1>
                <p className="text-slate-500 max-w-xl">Certified construction materials for high-integrity builds.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search items..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm w-full md:w-64"
                    />
                 </div>
                 <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
                    <button 
                      onClick={() => setSortOption('default')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortOption === 'default' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Default
                    </button>
                    <button 
                      onClick={() => setSortOption('price-low')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortOption === 'price-low' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Price Low
                    </button>
                    <button 
                      onClick={() => setSortOption('rating')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortOption === 'rating' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Top Rated
                    </button>
                 </div>
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={(p) => addToCart(p)} formatPrice={formatPrice} onShowDetails={(p) => setSelectedProduct(p)} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No products match your search</h3>
                <p className="text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSortOption('default'); }}
                  className="mt-6 text-amber-600 font-bold uppercase tracking-widest text-xs hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === View.ORDERS && (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bebas mb-2">PROJECT <span className="text-amber-500">HISTORY</span></h1>
            <p className="text-slate-500 mb-8">Review your past orders and track current shipments.</p>
            <OrderHistory orders={orders} formatPrice={formatPrice} onViewReceipt={setSelectedReceiptOrder} />
          </div>
        )}

        {currentView === View.PARTNER && <PartnerPortal setView={setView} />}
        {userRole === 'PARTNER' && currentView === View.PARTNER_DASHBOARD && <PartnerDashboard />}
        {userRole === 'PARTNER' && currentView === View.PARTNER_SETTINGS && <PartnerSettings addNotification={addNotification} />}
        {currentView === View.CALCULATOR && <div className="max-w-4xl mx-auto py-12 px-4"><BlockCalculator onAddToCart={addToCart} cementProducts={productList.filter(p => p.category === 'Cement')} /></div>}
        {(currentView === View.PRIVACY || currentView === View.TERMS) && <LegalView type={currentView === View.PRIVACY ? 'privacy' : 'terms'} setView={setView} />}
      </main>

      <Footer setView={setView} onOpenChat={() => setIsChatOpen(true)} orders={orders} />
      
      <Cart 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} 
        onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} onCheckout={handleCheckout} 
        formatPrice={formatPrice} discountPercentage={orders.length > 0 ? 0.05 : 0} 
      />

      <AIConsultant isOpen={isChatOpen} setIsOpen={setIsChatOpen} />

      {selectedProduct && <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} formatPrice={formatPrice} onAddToCart={addToCart} reviews={reviews.filter(r => r.productId === selectedProduct.id)} onAddReview={handleAddReview} />}
      {selectedReceiptOrder && <ReceiptModal order={selectedReceiptOrder} onClose={() => setSelectedReceiptOrder(null)} formatPrice={formatPrice} />}

      {editingProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => { stopCamera(); setEditingProduct(null); }} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bebas text-slate-900">{editingProduct.id ? 'EDIT' : 'ADD'} <span className="text-amber-500">CATALOGUE ITEM</span></h3>
              <button onClick={() => { stopCamera(); setEditingProduct(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Visual</label>
                <div 
                  className="w-full aspect-square bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer"
                >
                  {isCameraActive ? (
                    <div className="w-full h-full relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
                        <button 
                          onClick={takeSnapshot}
                          className="bg-amber-500 text-slate-900 p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                          title="Capture Photo"
                        >
                          <Camera size={24} />
                        </button>
                        <button 
                          onClick={stopCamera}
                          className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                          title="Close Camera"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </div>
                  ) : editingProduct.image ? (
                    <>
                      <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center gap-4">
                        <div className="flex gap-4">
                           <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl flex flex-col items-center gap-1 min-w-[100px]"
                           >
                            <Upload size={24} />
                            <span className="text-[10px] font-bold uppercase">Replace</span>
                           </button>
                           <button 
                            onClick={startCamera}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-900 p-3 rounded-2xl flex flex-col items-center gap-1 min-w-[100px]"
                           >
                            <Camera size={24} />
                            <span className="text-[10px] font-bold uppercase">New Photo</span>
                           </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <ImageIcon size={48} className="text-slate-300" />
                      <div className="flex gap-3">
                         <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2"
                         >
                          <Upload size={14} /> Upload
                         </button>
                         <button 
                          onClick={startCamera}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2"
                         >
                          <Camera size={14} /> Camera
                         </button>
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={editingProduct.image} 
                    onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-xs text-slate-400 italic" 
                    placeholder="Or paste external Image URL..."
                  />
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                  <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-bold" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                    <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-bold">
                      {['Hollow', 'Solid', 'Paving', 'Decorative', 'Cement', 'Interlocking', 'U-Block'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Price (GHS)</label>
                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-bold" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                  <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm h-32 resize-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Factory Source</label>
                <input value={editingProduct.factoryName} onChange={e => setEditingProduct({...editingProduct, factoryName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-bold" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Dimensions</label>
                <input value={editingProduct.specifications.dimensions} onChange={e => setEditingProduct({...editingProduct, specifications: {...editingProduct.specifications, dimensions: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Strength</label>
                <input value={editingProduct.specifications.strength} onChange={e => setEditingProduct({...editingProduct, specifications: {...editingProduct.specifications, strength: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => { stopCamera(); setEditingProduct(null); }} className="flex-1 bg-slate-100 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">Discard Changes</button>
              <button 
                onClick={() => editingProduct.id ? handleUpdateProduct(editingProduct) : handleAddProduct(editingProduct)} 
                className="flex-1 bg-slate-900 py-4 rounded-2xl font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
              >
                {editingProduct.id ? 'UPDATE SKU' : 'ADD TO CATALOGUE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
