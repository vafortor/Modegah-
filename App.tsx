
import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import OrderHistory from './components/OrderHistory';
import Cart from './components/Cart';
import BlockCalculator from './components/BlockCalculator';
import AIConsultant from './components/AIConsultant';
import { Product, CartItem, View, Currency, Review, Order } from './types';
import { PRODUCTS, GHS_TO_USD_RATE, INITIAL_REVIEWS, INITIAL_ORDERS } from './constants';
import { ArrowRight, Star, ShieldCheck, Truck, Clock, RefreshCw, AlertCircle, LayoutGrid, Box, Grid3X3, Trees, Package } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<Currency>('GHS');
  const [exchangeRate, setExchangeRate] = useState(GHS_TO_USD_RATE);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const formatPrice = useCallback((priceInGHS: number) => {
    if (currency === 'USD') {
      const converted = priceInGHS * exchangeRate;
      return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `GH₵${priceInGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency, exchangeRate]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryNavigation = (category: string) => {
    setSelectedCategory(category);
    setView(View.SHOP);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
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
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const subtotalGHS = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `MOD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      totalGHS: subtotalGHS,
      status: 'Processing',
      currencyAtTime: currency,
      exchangeRateAtTime: exchangeRate
    };

    setOrders(prev => [newOrder, ...prev]);
    alert(`Success! Order ${newOrder.id} has been placed. You can view its status in your Order History.`);
    setCart([]);
    setIsCartOpen(false);
    setView(View.ORDERS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Hollow', icon: Box },
    { name: 'Solid', icon: Grid3X3 },
    { name: 'Paving', icon: Grid3X3 },
    { name: 'Decorative', icon: Trees },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200 selection:text-slate-900">
      <Header 
        currentView={currentView} 
        setView={setView} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)} 
        currency={currency}
        setCurrency={setCurrency}
      />

      <main className="flex-1">
        {currentView === View.HOME && (
          <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
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
                  <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    <Star size={14} fill="currentColor" /> Premium Strength Guaranteed
                  </div>
                  <h1 className="text-6xl md:text-8xl font-bebas text-white leading-[0.9] mb-6">
                    BUILD WITH <span className="text-amber-500">CONFIDENCE</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
                    Modegah provides high-vibration, precision-molded blocks. <span className="text-white font-semibold">Delivery is exclusively available within the Greater Accra area.</span>
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setView(View.SHOP)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
                    >
                      Browse Products <ArrowRight size={20} />
                    </button>
                    <button 
                      onClick={() => setView(View.CALCULATOR)}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold transition-all active:scale-95"
                    >
                      Material Estimator
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Shop by Category */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-5xl font-bebas tracking-wide mb-2">SHOP BY <span className="text-amber-500">CATEGORY</span></h2>
                  <p className="text-slate-500">Fast-track your search by selecting your project's specific needs.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {categories.filter(c => c.name !== 'All').map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryNavigation(cat.name)}
                      className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 text-center flex flex-col items-center gap-4 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors" />
                      <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                        <cat.icon size={32} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">{cat.name} Blocks</h3>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">View Collection</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="group">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Superior Compressive Strength</h3>
                    <p className="text-slate-500">Every block is tested to exceed standard requirements, ensuring your structure stands the test of time in the Greater Accra climate.</p>
                  </div>
                  <div className="group border-2 border-amber-100 p-6 rounded-3xl bg-amber-50/30">
                    <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 mb-6">
                      <Truck size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Greater Accra Exclusive</h3>
                    <p className="text-slate-600 font-medium">We focus our operations locally to guarantee the fastest turnaround. Delivery is strictly limited to locations within Greater Accra.</p>
                  </div>
                  <div className="group">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                      <Clock size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Live Currency Conversion</h3>
                    <p className="text-slate-500">Toggle between GHS and USD seamlessly to manage your construction budget and international funding.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Products Mini-Grid */}
            <section className="py-20 bg-slate-50">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-bebas tracking-wide mb-2">MOST POPULAR <span className="text-amber-500">UNITS</span></h2>
                    <p className="text-slate-500">Top-rated blocks used by local contractors across the capital region.</p>
                  </div>
                  <button 
                    onClick={() => setView(View.SHOP)}
                    className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1 transition-colors"
                  >
                    View All Products <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {PRODUCTS.slice(0, 3).map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart}
                      formatPrice={formatPrice}
                      onShowDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === View.SHOP && (
          <div className="container mx-auto px-4 py-12 animate-in slide-in-from-bottom-5 duration-500">
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
              <p className="text-amber-800 text-sm font-semibold">
                Delivery Notice: We currently only deliver to sites located within the <span className="underline">Greater Accra Region</span>.
              </p>
            </div>

            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bebas mb-4">PRODUCT <span className="text-amber-500">CATALOGUE</span></h1>
                <p className="text-slate-500 max-w-xl">Find the perfect concrete units. Prices are available in {currency}.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Rate</span>
                <span className="text-sm font-bold text-slate-900">1 GH₵ = ${exchangeRate}</span>
                <button 
                  onClick={() => setExchangeRate(prev => +(prev + (Math.random() * 0.002 - 0.001)).toFixed(4))}
                  className="p-1 hover:bg-slate-100 rounded text-amber-600 transition-colors"
                  title="Refresh Rate"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Mobile Category Scroll */}
            <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedCategory === cat.name 
                      ? 'bg-amber-500 text-slate-900 shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Search</h3>
                  <input 
                    type="text"
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-sm shadow-sm transition-all"
                  />
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
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat.name ? 'bg-amber-500' : 'bg-slate-200 group-hover:bg-amber-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 bg-slate-900 rounded-2xl text-white">
                  <h4 className="font-bold text-amber-500 mb-2">Outside Accra?</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">While we don't deliver outside Greater Accra, you can arrange your own transport for pickup from our Shai Hills factory.</p>
                  <button className="w-full bg-amber-500 text-slate-900 py-2 rounded-lg font-bold text-sm hover:bg-amber-400 transition-colors">Contact Pickup Dept</button>
                </div>
              </aside>

              {/* Product Grid */}
              <div className="flex-1">
                <div className="lg:hidden mb-6">
                   <input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-sm shadow-sm"
                  />
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={addToCart}
                        formatPrice={formatPrice}
                        onShowDetails={(p) => setSelectedProduct(p)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No products match your criteria</p>
                    <button 
                      onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                      className="mt-4 text-amber-600 font-bold"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === View.CALCULATOR && (
          <div className="container mx-auto px-4 py-12 animate-in zoom-in duration-500">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 text-center">
                <h1 className="text-5xl font-bebas mb-4">BLOCK <span className="text-amber-500">ESTIMATOR</span></h1>
                <p className="text-slate-500 max-w-xl mx-auto">Calculate exactly how many blocks, bags of cement, and tons of sand you need for your wall based on its dimensions.</p>
              </div>
              <BlockCalculator />
            </div>
          </div>
        )}

        {currentView === View.ORDERS && (
          <div className="container mx-auto px-4 py-12 animate-in slide-in-from-right-10 duration-500">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 text-center">
                <h1 className="text-5xl font-bebas mb-4">ORDER <span className="text-amber-500">HISTORY</span></h1>
                <p className="text-slate-500 max-w-xl mx-auto">View and track your previous purchases from Modegah Block Factory.</p>
              </div>
              <OrderHistory orders={orders} formatPrice={formatPrice} />
            </div>
          </div>
        )}
      </main>

      <Footer 
        setView={setView} 
        onOpenChat={() => setIsChatOpen(true)}
      />
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        formatPrice={formatPrice}
      />

      <AIConsultant 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen} 
      />

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
    </div>
  );
};

export default App;
