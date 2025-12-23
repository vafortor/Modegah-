
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Search, X, Package, Loader2, Truck, ShieldCheck, Info, Map, Clock } from 'lucide-react';
import BlockIcon from './BlockIcon';
import { View } from '../types';

interface FooterProps {
  setView: (view: View) => void;
  onOpenChat: () => void;
}

const Footer: React.FC<FooterProps> = ({ setView, onOpenChat }) => {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<null | 'loading' | 'found'>(null);
  const [activePolicy, setActivePolicy] = useState<null | 'delivery' | 'returns'>(null);

  const handleTrackOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setTrackingStatus('loading');
    // Simulate API delay
    setTimeout(() => {
      setTrackingStatus('found');
    }, 1500);
  };

  const handleBulkPricing = () => {
    onOpenChat();
  };

  const closeTracking = () => {
    setIsTrackingOpen(false);
    setOrderId('');
    setTrackingStatus(null);
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
              Ghana's leading high-vibration block factory. We set the standard for durability, strength, and precision in construction materials.
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
                <button onClick={() => setView(View.SHOP)} className="hover:text-amber-500 transition-colors text-left">
                  Our Products
                </button>
              </li>
              <li>
                <button onClick={() => setView(View.CALCULATOR)} className="hover:text-amber-500 transition-colors text-left">
                  Block Estimator
                </button>
              </li>
              <li>
                <button onClick={() => setView(View.ORDERS)} className="hover:text-amber-500 transition-colors text-left">
                  Order History
                </button>
              </li>
              <li>
                <button onClick={() => setIsTrackingOpen(true)} className="hover:text-amber-500 transition-colors text-left">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={handleBulkPricing} className="hover:text-amber-500 transition-colors text-left">
                  Bulk Pricing
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
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Track Order Overlay */}
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
              {!trackingStatus ? (
                <form onSubmit={handleTrackOrderSubmit} className="space-y-4">
                  <p className="text-sm text-slate-500 mb-4">Enter your order ID (found in your confirmation email) to check the real-time status of your blocks.</p>
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
                  <p className="text-slate-500 font-medium">Connecting to Shai Hills Factory database...</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status for {orderId}</p>
                        <p className="text-amber-800 font-bold">In Production</p>
                      </div>
                    </div>
                    <p className="text-sm text-amber-900 leading-relaxed">
                      Good news! Your order is being processed at the Shai Hills factory. The blocks are currently in the curing stage to ensure maximum compressive strength.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm">
                    <Truck className="text-slate-400 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-bold text-slate-700">Estimated Delivery</p>
                      <p className="text-slate-500">Within the next 48 hours (Greater Accra area only).</p>
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

      {/* Policy Modal Overlay */}
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
            
            <div className="p-8 overflow-y-auto space-y-8">
              {activePolicy === 'delivery' ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Map className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Greater Accra Coverage</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Modegah Block Factory provides standard delivery exclusively within the Greater Accra Region. This includes Accra Metropolis, Tema, Kasoa, Adenta, Madina, and surrounding areas.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Outside Region Pickup</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        For projects outside Greater Accra, clients must arrange their own transportation. Pickup is available from our Afienyah/Shai Hills factory gates 24/7 with prior confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {/* Fixed: Use Clock icon after adding to imports */}
                      <Clock className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Timelines</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Standard delivery takes 24-48 hours from order confirmation. During high-demand periods or curing stages, this may extend slightly. You will receive an SMS when your blocks are dispatched.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                    <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 font-medium">
                      Delivery rates are calculated based on the distance from our Shai Hills facility. Offloading is included in the service for accessible sites.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Zero-Breakage Guarantee</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        We pride ourselves on the strength of our high-vibration blocks. If more than 2% of your order is damaged during transit managed by Modegah, we will replace the damaged units free of charge.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Truck className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Reporting Damages</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Claims for damaged blocks must be made at the point of offloading. Please inspect the delivery with our driver and note any damages on the delivery note.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="text-slate-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Structural Defects</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        If blocks fail to meet the specified compressive strength (as per independent lab testing), we will offer a full refund or exchange for the affected batch.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-500 font-medium italic">
                      Note: Returns are not accepted for "change of mind" once the curing process is complete and the order is custom-produced.
                    </p>
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
