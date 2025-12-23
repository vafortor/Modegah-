
import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  formatPrice: (price: number) => string;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout, formatPrice }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Reset states when cart closes
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-amber-500" />
            <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <ShoppingBag size={64} className="mb-4 text-slate-300" />
              <p className="text-slate-500 font-medium">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="mt-4 text-amber-600 font-bold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h4>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500"
                        disabled={showConfirm}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-slate-500 text-xs mb-2">{formatPrice(item.price)} per unit</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:bg-slate-200 rounded-l-lg disabled:opacity-30"
                          disabled={showConfirm}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-bold w-10 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-slate-200 rounded-r-lg disabled:opacity-30"
                          disabled={showConfirm}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-slate-50 space-y-4">
            <div className={`p-4 rounded-xl border-2 transition-all ${policyAcknowledged ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200 shadow-sm animate-pulse-subtle'}`}>
              <div className="flex gap-3 items-start mb-3">
                <Truck size={20} className={policyAcknowledged ? 'text-green-600' : 'text-amber-600'} />
                <div>
                  <h4 className={`text-sm font-bold ${policyAcknowledged ? 'text-green-800' : 'text-amber-900'}`}>Delivery Limitation</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${policyAcknowledged ? 'text-green-700' : 'text-amber-800'}`}>
                    Modegah delivers exclusively within the <strong>Greater Accra Region</strong>. Customers outside this area must arrange their own transport from our Shai Hills factory.
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
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    policyAcknowledged 
                      ? 'bg-green-600 border-green-600' 
                      : 'bg-white border-amber-300 group-hover:border-amber-500'
                  }`}>
                    {policyAcknowledged && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                </div>
                <span className={`text-xs font-bold ${policyAcknowledged ? 'text-green-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  I confirm my site is in Greater Accra or I will arrange pickup.
                </span>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bebas text-slate-900 tracking-wide">{formatPrice(subtotal)}</span>
            </div>

            {!showConfirm ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <p className="text-[10px] text-slate-400">Final total excludes specific site offloading surcharges if applicable.</p>
                <button 
                  onClick={handleCheckoutClick}
                  disabled={!policyAcknowledged}
                  className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                    policyAcknowledged 
                      ? 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-amber-500/20' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold">Are you sure you want to place this order?</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleFinalConfirm}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
                  >
                    Yes, Place Order
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
