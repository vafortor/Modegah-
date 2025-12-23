
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Search, X, Package, Loader2, Truck, ShieldCheck, Info, Map, Clock, Building2, Award, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import BlockIcon from './BlockIcon';
import { View, Order } from '../types';

interface FooterProps {
  setView: (view: View) => void;
  onOpenChat: () => void;
  orders: Order[];
}

const Footer: React.FC<FooterProps> = ({ setView, onOpenChat, orders }) => {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<null | 'loading' | 'found' | 'not_found'>(null);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [activePolicy, setActivePolicy] = useState<null | 'delivery' | 'returns'>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (view: View) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setTrackingStatus('loading');
    
    // Find in local state
    const match = orders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase());
    
    setTimeout(() => {
      if (match) {
        setFoundOrder(match);
        setTrackingStatus('found');
      } else {
        setTrackingStatus('not_found');
      }
    }, 1200);
  };

  const closeTracking = () => {
    setIsTrackingOpen(false);
    setOrderId('');
    setTrackingStatus(null);
    setFoundOrder(null);
  };

  const closePolicy = () => {
    setActivePolicy(null);
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <BlockIcon size={20} className="text-slate-900" />
              </div>
              <h1 className="text-xl font-bebas tracking-wider leading-none">MODEGAH</h1>
            </div>
            <p className="text-sm leading-relaxed">
              Ghana's premier high-vibration block factory and certified partner network. Setting the benchmark for construction durability.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 hover:text-slate-900 transition-all"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 hover:text-slate-900 transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-amber-500 hover:text-slate-900 transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <button onClick={() => handleNavigate(View.SHOP)} className="hover:text-amber-500 transition-colors text-left">
                  Our Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(View.CALCULATOR)} className="hover:text-amber-500 transition-colors text-left">
                  Block Estimator
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(View.ORDERS)} className="hover:text-amber-500 transition-colors text-left">
                  Order History
                </button>
              </li>
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-amber-500 transition-colors text-left font-bold text-amber-500">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate(View.PARTNER)} className="text-slate-300 font-bold hover:text-amber-400 transition-colors text-left flex items-center gap-2">
                  <Building2 size={16} /> Factory Partner Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Customer Support</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={onOpenChat} className="hover:text-amber-500 transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => setActivePolicy('delivery')} className="hover:text-amber-500 transition-colors text-left">Delivery Policy</button></li>
              <li><button onClick={() => setActivePolicy('returns')} className="hover:text-amber-500 transition-colors text-left">Return Policy</button></li>
              <li><button onClick={onOpenChat} className="hover:text-amber-500 transition-colors text-left">AI Assistant</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><MapPin size={16} className="text-amber-500" /> Afienyah, Shai Hills Ghana Industrial Area</li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-amber-500" /> +233 800 MODEGAH</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-amber-500" /> sales@modegah.com</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© {new Date().getFullYear()} Modegah Block Factory Ltd. All Rights Reserved.</p>
          <div className="flex gap-8">
            <button onClick={() => handleNavigate(View.PRIVACY)} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => handleNavigate(View.TERMS)} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 bg-amber-500 text-slate-900 p-3 rounded-xl shadow-2xl hover:bg-amber-400 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 border border-amber-600/20 active:scale-95"
          title="Back to Top"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {isTrackingOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeTracking} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Package className="text-amber-500" />
                <h3 className="font-bold">Track Your Shipment</h3>
              </div>
              <button onClick={closeTracking} className="hover:text-amber-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              {!trackingStatus || trackingStatus === 'not_found' ? (
                <form onSubmit={handleTrackOrderSubmit} className="space-y-4">
                  {trackingStatus === 'not_found' && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in shake duration-500">
                      <AlertCircle size={14} /> Order ID not found. Try 'MOD-12345'
                    </div>
                  )}
                  <p className="text-sm text-slate-500 mb-4">Enter your order ID (found in your confirmation or History) to check real-time status.</p>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. MOD-88291"
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 font-bold"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-2 p-1.5 bg-slate-900 text-amber-500 rounded-lg"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </form>
              ) : trackingStatus === 'loading' ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-amber-500" size={40} />
                  <p className="text-slate-500 font-medium">Querying Network database...</p>
                </div>
              ) : foundOrder && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status for {foundOrder.id}</p>
                        <p className="text-amber-800 font-bold text-lg">{foundOrder.status}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-amber-900/60">
                        <span>Production</span>
                        <span>Quality Check</span>
                        <span>Dispatch</span>
                      </div>
                      <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-amber-600 transition-all duration-1000 ${
                          foundOrder.status === 'Processing' ? 'w-1/3' : 
                          foundOrder.status === 'In Production' ? 'w-1/2' : 
                          foundOrder.status === 'Out for Delivery' ? 'w-4/5' : 'w-full'
                        }`} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm">
                    <Truck className="text-slate-400 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-bold text-slate-700">Estimated Delivery</p>
                      <p className="text-slate-500">
                        {foundOrder.status === 'Delivered' 
                          ? `Arrived on ${foundOrder.date}` 
                          : 'Within the next 24-48 hours.'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={closeTracking}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Close Tracking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activePolicy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closePolicy} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                {activePolicy === 'delivery' ? (
                  <Truck className="text-amber-500" />
                ) : (
                  <ShieldCheck className="text-amber-500" />
                )}
                <h3 className="font-bold text-xl font-bebas tracking-wide">
                  {activePolicy === 'delivery' ? 'Delivery Policy' : 'Return & Replacement Policy'}
                </h3>
              </div>
              <button onClick={closePolicy} className="hover:text-amber-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8 text-slate-600">
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-3 mb-4">
                <Award size={20} className="text-amber-500" />
                <p className="text-xs font-bold uppercase tracking-wider">Certified Network Standards Applied</p>
              </div>

              {activePolicy === 'delivery' ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Map className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Greater Accra Coverage</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Modegah and all certified partners provide standard delivery exclusively within the Greater Accra Region. This includes Accra Metropolis, Tema, Kasoa, Adenta, Madina, and surrounding areas.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Unified Logistics</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Regardless of which partner produces your blocks, the delivery fee and schedule are managed centrally to ensure consistent service levels.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Timelines</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Standard delivery takes 24-48 hours. By utilizing a network of factories, we often achieve faster delivery by fulfilling orders from the factory closest to your site.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Network-Wide Guarantee</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        All partners are bound by our Zero-Breakage Guarantee. If more than 2% of your order is damaged during transit, the producing factory will replace the units at zero cost to you.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Truck className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Inspection at Site</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Damages must be documented with the delivery driver before offloading completion. Our central customer support handles claims across all partner factories.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Strength Assurance</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Every partner is required to submit monthly compressive strength test results to the Modegah quality control department to maintain their partnership status.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                onClick={closePolicy}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
