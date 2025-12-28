
import React from 'react';
import { Order } from '../types';
// Added Award icon to imports
import { Package, Calendar, Clock, CheckCircle2, Truck, ChevronRight, ShoppingBag, Info, FileText, MapPin, Phone, User, Award } from 'lucide-react';

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
    <div className="space-y-6 mt-8">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-3 rounded-2xl text-amber-500">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{order.id}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{order.date} • {order.items.length} Product Types</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border-2 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
              <div className="text-2xl font-bebas tracking-wide text-slate-900">
                {formatPrice(order.totalGHS)}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Breakdown</h4>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-slate-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{item.name} <span className="text-slate-400 font-medium">× {item.quantity}</span></span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.trackingDetails && (
                <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <Truck className="text-amber-500" size={20} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Live Delivery Tracking</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin size={20} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Location</p>
                          <p className="text-sm font-bold">{order.trackingDetails.currentLocation}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Driver</p>
                          <p className="text-sm font-bold">{order.trackingDetails.driverName}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{order.trackingDetails.driverPhone}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Estimate Arrival</p>
                          <p className="text-lg font-bebas tracking-wide text-amber-500 mt-1">{order.trackingDetails.estimatedArrival}</p>
                        </div>
                        <button className="bg-amber-500 text-slate-900 p-2 rounded-xl">
                          <Phone size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 opacity-5">
                    <Truck size={200} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-slate-100 gap-4">
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => onViewReceipt(order)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold transition-all hover:bg-slate-800"
                >
                  <FileText size={16} className="text-amber-500" />
                  Official Receipt
                </button>
                <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-100">
                  Help / Support
                </button>
              </div>
              {order.discountAppliedGHS > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg">
                  <Award size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">LOYALTY SAVINGS: {formatPrice(order.discountAppliedGHS)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
