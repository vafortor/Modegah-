
import React from 'react';
import { Order } from '../types';
import { Package, Calendar, Clock, CheckCircle2, Truck, ChevronRight, ShoppingBag, Info } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
  formatPrice: (price: number) => string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, formatPrice }) => {
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

  const getDeliveryEstimate = (status: Order['status'], date: string) => {
    switch (status) {
      case 'Processing':
        return { text: 'Est. Arrival: 2-3 Working Days', icon: <Clock size={12} />, className: 'text-blue-600 bg-blue-50' };
      case 'In Production':
        return { text: 'Est. Arrival: 1-2 Working Days', icon: <Package size={12} />, className: 'text-amber-600 bg-amber-50' };
      case 'Out for Delivery':
        return { text: 'Arriving Today', icon: <Truck size={12} />, className: 'text-purple-600 bg-purple-50' };
      case 'Delivered':
        return { text: `Delivered on ${date}`, icon: <CheckCircle2 size={12} />, className: 'text-green-600 bg-green-50' };
      default:
        return { text: 'Status Pending', icon: <Info size={12} />, className: 'text-slate-500 bg-slate-50' };
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders found</h2>
        <p className="text-slate-500 max-w-sm mx-auto">You haven't placed any orders yet. Start shopping our premium blocks for your next project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const estimate = getDeliveryEstimate(order.status, order.date);
        return (
          <div 
            key={order.id} 
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 p-2.5 rounded-xl text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{order.id}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {order.date}
                    </span>
                    <span>•</span>
                    <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} Units</span>
                  </div>
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
              {/* Delivery Estimate Banner */}
              <div className={`mb-6 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold ${estimate.className} border-current opacity-80`}>
                {estimate.icon}
                <span>{estimate.text}</span>
              </div>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover/item:text-amber-600 transition-colors">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity} units</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-700">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                className="text-slate-400 hover:text-amber-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors"
                onClick={() => alert(`Tracking details for ${order.id}:\nCurrent Status: ${order.status}\nLocation: Shai Hills Factory Yard`)}
              >
                Track Shipment <ChevronRight size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistory;
