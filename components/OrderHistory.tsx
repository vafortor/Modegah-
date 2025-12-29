
import React from 'react';
import { Order } from '../types';
import { Package, Calendar, Clock, CheckCircle2, Truck, ChevronRight, ShoppingBag, Info, FileText, MapPin, Phone, User, Award, Navigation, Activity, ShieldCheck } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
  formatPrice: (price: number) => string;
  onViewReceipt: (order: Order) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, formatPrice, onViewReceipt }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Production': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return <Clock size={14} />;
      case 'In Production': return <Package size={14} />;
      case 'Out for Delivery': return <Truck size={14} />;
      case 'Delivered': return <CheckCircle2 size={14} />;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders found</h2>
        <p className="text-slate-500 max-w-sm mx-auto">Start your first project with Modegah's certified network units.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-8">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group"
        >
          {/* Header Section */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-slate-900 p-4 rounded-2xl text-amber-500 shadow-lg shadow-slate-900/10">
                <Package size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-extrabold text-slate-900 text-2xl tracking-tight">{order.id}</h3>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> {order.date} • {order.items.length} Product Types
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">TOTAL VALUATION</p>
              <div className="text-4xl font-bebas tracking-wide text-slate-900">
                {formatPrice(order.totalGHS)}
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Items Breakdown */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-amber-500" /> Order Details
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">{order.items.length} Unique SKUs</span>
                </div>
                
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group/item hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {item.quantity} Units @ {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {order.items.length === 0 && (
                    <div className="p-6 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Item details being updated</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Payment Reference</span>
                    <span className="text-slate-900 font-black">{order.transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Method</span>
                    <span className="text-slate-900 font-black">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* LIVE TRACKING SECTION */}
              {order.trackingDetails ? (
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col">
                  {/* Fake Map Background Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-500 via-transparent to-transparent opacity-20" />
                     <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                     </svg>
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
                          <Navigation size={20} className="animate-pulse" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Live Terminal Tracking</h4>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter">GPS Active</span>
                      </div>
                    </div>
                    
                    <div className="space-y-8 flex-1">
                      <div className="flex gap-5 group/track">
                        <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10 group-hover/track:bg-white/10 transition-colors">
                          <MapPin size={24} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Vehicle Position</p>
                          <p className="text-base font-bold text-white leading-tight">{order.trackingDetails.currentLocation}</p>
                          <p className="text-[10px] text-amber-500/60 font-black mt-1 uppercase tracking-tighter">Updated 2 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex gap-5 group/track">
                        <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10 group-hover/track:bg-white/10 transition-colors">
                          <User size={24} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Logistics Driver</p>
                          <p className="text-base font-bold text-white leading-tight">{order.trackingDetails.driverName}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                             <span className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                                <Phone size={12} className="text-amber-500" /> {order.trackingDetails.driverPhone}
                             </span>
                             <span className="w-1 h-1 bg-slate-700 rounded-full" />
                             <span className="text-[10px] text-slate-500 font-bold">Verified Driver</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Arrival At Site</p>
                          <p className="text-3xl font-bebas tracking-wide text-amber-500 leading-none">
                            {order.trackingDetails.estimatedArrival}
                          </p>
                        </div>
                        <a 
                          href={`tel:${order.trackingDetails.driverPhone}`}
                          className="w-14 h-14 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 hover:scale-110 active:scale-95 transition-all"
                        >
                          <Phone size={24} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-inner">
                    <Truck size={40} />
                  </div>
                  <div>
                    <h4 className="font-bebas text-2xl tracking-wide text-slate-900">WAITING FOR DISPATCH</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-[200px] mx-auto">Tracking details will activate once order leaves factory terminal.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-10 mt-10 border-t border-slate-100 gap-6">
              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => onViewReceipt(order)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  <FileText size={18} className="text-amber-500" />
                  Request Official Receipt
                </button>
                <button className="flex-1 sm:flex-none px-8 py-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">
                  Structural Support
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                {order.discountAppliedGHS > 0 && (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-2xl border border-green-100 shadow-sm animate-pulse-subtle">
                    <Award size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">NETWORK LOYALTY SAVINGS: {formatPrice(order.discountAppliedGHS)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">CERTIFIED BATCH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
