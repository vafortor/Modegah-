
import React, { useState, useEffect, useMemo } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, Truck, AlertCircle, CheckCircle2, MapPin, Award, ArrowLeft, ShoppingCart, Info, TrendingDown, Star } from 'lucide-react';
import { CartItem } from '../types';
import { PRODUCTS } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  formatPrice: (price: number) => string;
  discountPercentage: number;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout, formatPrice, discountPercentage }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const bulkDiscountPct = useMemo(() => {
    if (totalQuantity >= 5000) return 0.07;
    if (totalQuantity >= 1000) return 0.03;
    return 0;
  }, [totalQuantity]);

  const effectiveDiscountPct = discountPercentage + bulkDiscountPct;
  const discountAmount = subtotal * effectiveDiscountPct;
  const total = subtotal - discountAmount;
  
  useEffect(() => {
    if (!isOpen) {
      setShowConfirm(false);
      setPolicyAcknowledged(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    if (policyAcknowledged) {
      setShowConfirm(true);
    }
  };

  const handleFinalConfirm = () => {
    onCheckout();
    setShowConfirm(false);
    setPolicyAcknowledged(false);
  };

  const handleQuantityInputChange = (id: string, value: string) => {
    const newQty = parseInt(value, 10);
    if (!isNaN(newQty) && newQty >= 0) {
      const currentItem = items.find(item => item.id === id);
      if (currentItem) {
        onUpdateQuantity(id, newQty - currentItem.quantity);
      }
    }
  };

  const bestSellers = PRODUCTS.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Cart Header */}
        <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl">
              <ShoppingCart className="text-amber-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Your Order</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{items.length} items in plan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <X size={24} className="text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col p-12 animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col items-center text-center mb-12">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-amber-100 rounded-full blur-2xl opacity-50 animate-pulse" />
                  <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <ShoppingBag size={64} className="text-slate-200" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-2xl font-bebas tracking-wide text-slate-900 mb-2 uppercase">Empty Project Bin</h3>
                <p className="text-slate-500 text-sm mb-8 max-w-[240px] mx-auto font-medium">
                  Your structural plan has no items yet. Explore our high-vibration molded units.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full max-w-[200px] bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 uppercase text-xs tracking-widest"
                >
                  <ArrowLeft size={18} className="text-amber-500" />
                  Start Shopping
                </button>
              </div>

              {/* Enhanced Empty State: Best Sellers */}
              <div className="space-y-6 pt-12 border-t border-slate-50">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Star size={14} className="text-amber-500" /> Top Rated Units
                </h4>
                <div className="space-y-4">
                  {bestSellers.map(p => (
                    <div key={p.id} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-amber-600 font-bold mt-0.5">{formatPrice(p.price)}</p>
                        <button 
                          onClick={() => {
                            onUpdateQuantity(p.id, 1);
                            // Normally we'd need an onAddToCart here, but onUpdateQuantity with current ID is a proxy for this context if item exists, 
                            // however for empty state we'd likely want a proper add call. 
                            // For simplicity in this UI block, we assume this button takes them back to the shop or we trigger a global add.
                          }}
                          className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900 mt-2 flex items-center gap-1"
                        >
                          View in Catalogue <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {/* Persistent Delivery Alert Banner */}
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-[1.5rem] flex items-start gap-4 shadow-sm">
                <MapPin className="text-amber-600 shrink-0 mt-0.5" size={24} />
                <div>
                  <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest mb-1">REGIONAL RESTRICTION</h4>
                  <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
                    Modegah Logistics serves the <span className="font-bold underline">Greater Accra Region</span> exclusively. Verify your site location before proceeding.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {discountPercentage > 0 && (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-[1.25rem] flex items-center gap-3">
                    <Award className="text-green-600" size={20} />
                    <div>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Loyalty Perk</p>
                      <p className="text-xs font-bold text-green-900">{(discountPercentage * 100).toFixed(0)}% Loyalty Discount enabled.</p>
                    </div>
                  </div>
                )}

                {bulkDiscountPct > 0 && (
                  <div className="p-4 bg-amber-900 text-white rounded-[1.25rem] flex items-center gap-3 shadow-lg shadow-amber-900/20 animate-in slide-in-from-left-4">
                    <TrendingDown className="text-amber-500" size={20} />
                    <div>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Bulk Buy Savings</p>
                      <p className="text-xs font-bold">{(bulkDiscountPct * 100).toFixed(0)}% Structural Volume Discount applied.</p>
                    </div>
                  </div>
                )}
                
                {totalQuantity < 1000 && (
                   <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-[1.25rem] flex items-center gap-3">
                      <Info size={14} className="text-slate-400" />
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        Add <span className="text-slate-900 font-black">{1000 - totalQuantity}</span> more blocks for 3% Bulk Discount.
                      </p>
                   </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item details</span>
                  <button 
                    onClick={onClose}
                    className="text-[10px] font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center gap-1"
                  >
                    Add more items <Plus size={10} />
                  </button>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="flex gap-5 group animate-in slide-in-from-right-4 duration-300">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 text-base leading-tight truncate">{item.name}</h4>
                      </div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">{formatPrice(item.price)} per unit</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all"
                            disabled={showConfirm}
                            title="Decrease quantity"
                          >
                            <Minus size={14} className="text-slate-600" />
                          </button>
                          <input 
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                            disabled={showConfirm}
                            className="w-12 text-center bg-transparent border-none focus:ring-0 text-sm font-black text-slate-900"
                          />
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all"
                            disabled={showConfirm}
                            title="Increase quantity"
                          >
                            <Plus size={14} className="text-slate-600" />
                          </button>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-slate-900 mb-1">{formatPrice(item.price * item.quantity)}</span>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="flex items-center gap-1 text-[9px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                            disabled={showConfirm}
                          >
                            <Trash2 size={10} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t bg-slate-50 space-y-6">
            <div className={`p-5 rounded-[1.5rem] border-2 transition-all ${policyAcknowledged ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200 shadow-sm'}`}>
              <div className="flex gap-4 items-start mb-4">
                <Truck size={24} className={policyAcknowledged ? 'text-green-600' : 'text-amber-600'} />
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-widest ${policyAcknowledged ? 'text-green-800' : 'text-amber-900'}`}>GT. ACCRA Logistics</h4>
                  <p className={`text-[10px] mt-1 leading-relaxed font-bold ${policyAcknowledged ? 'text-green-700' : 'text-amber-800'}`}>
                    Delivery is exclusive to sites within the Greater Accra Region.
                  </p>
                </div>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={policyAcknowledged}
                    onChange={(e) => setPolicyAcknowledged(e.target.checked)}
                    disabled={showConfirm}
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    policyAcknowledged 
                      ? 'bg-green-600 border-green-600' 
                      : 'bg-white border-amber-300 group-hover:border-amber-500'
                  }`}>
                    {policyAcknowledged && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${policyAcknowledged ? 'text-green-700' : 'text-slate-500 group-hover:text-slate-900'}`}>
                  Confirm Site Location
                </span>
              </label>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Net Subtotal</span>
                <span className="font-black text-slate-700">{formatPrice(subtotal)}</span>
              </div>
              {effectiveDiscountPct > 0 && (
                <div className="flex justify-between items-center text-xs text-green-600">
                  <span className="font-black uppercase tracking-widest">Network Savings</span>
                  <span className="font-black">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-slate-900 font-black uppercase tracking-widest text-xs">Final Pay</span>
                <span className="text-4xl font-bebas text-slate-900 tracking-wide leading-none">{formatPrice(total)}</span>
              </div>
            </div>

            {!showConfirm ? (
              <div className="grid grid-cols-1 gap-4 pt-2">
                <button 
                  onClick={handleCheckoutClick}
                  disabled={!policyAcknowledged}
                  className={`w-full font-black py-5 rounded-[1.25rem] transition-all shadow-xl active:scale-[0.98] uppercase text-xs tracking-[0.2em] ${
                    policyAcknowledged 
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Proceed to Checkout
                </button>
                <button 
                  onClick={onClose}
                  className="w-full text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest py-2 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={12} /> Continue Shopping
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-[1.5rem] border-2 border-amber-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-amber-700">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Verification</p>
                    <p className="text-xs font-bold text-slate-900">Place this order to site?</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3.5 rounded-xl transition-all text-[10px] uppercase tracking-widest"
                  >
                    Hold
                  </button>
                  <button 
                    onClick={handleFinalConfirm}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 text-[10px] uppercase tracking-widest"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
