
import React from 'react';
import { Order } from '../types';
import { Package, Calendar, Clock, CheckCircle2, Truck, ChevronRight, ShoppingBag, Info, FileText } from 'lucide-react';

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
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-2.5 rounded-xl text-amber-500">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{order.id}</h3>
                <p className="text-xs text-slate-500 font-medium">{order.date} • {order.items.length} Product Types</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
              <div className="text-xl font-bebas tracking-wide text-slate-900">
                {formatPrice(order.totalGHS)}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.name} <span className="text-slate-400 font-normal">× {item.quantity}</span></span>
                  </div>
                  <span className="text-sm font-bold text-slate-500">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex gap-4">
                <button 
                  onClick={() => onViewReceipt(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  <FileText size={16} className="text-amber-600" />
                  View Receipt
                </button>
                <button 
                  className="text-slate-400 hover:text-amber-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors"
                  onClick={() => alert(`Tracking details for ${order.id}:\nCurrent Status: ${order.status}\nLocation: Shai Hills Factory Yard`)}
                >
                  Track Shipment <ChevronRight size={14} />
                </button>
              </div>
              {order.discountAppliedGHS > 0 && (
                <div className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-1 rounded">
                  Discount: -{formatPrice(order.discountAppliedGHS)}
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
