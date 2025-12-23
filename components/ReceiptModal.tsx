
import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import { Order } from '../types';
import BlockIcon from './BlockIcon';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
  formatPrice: (price: number) => string;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose, formatPrice }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <div className="bg-slate-900 p-6 flex items-center justify-between text-white flex-shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <FileIcon />
            <h3 className="font-bold text-xl font-bebas tracking-wide">Official <span className="text-amber-500">Receipt</span></h3>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-slate-800 rounded-lg text-amber-500 transition-colors"
              title="Print Receipt"
            >
              <Printer size={20} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={receiptRef}
          className="p-10 overflow-y-auto bg-white print:p-0"
        >
          {/* Receipt Header */}
          <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2.5 rounded-2xl">
                <BlockIcon size={32} className="text-slate-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bebas tracking-wider text-slate-900">MODEGAH</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industrial Block Factory</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bebas text-slate-900 mb-1">RECEIPT</h2>
              <p className="text-sm font-bold text-amber-600">{order.id}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{order.date}</p>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issued By</p>
                <p className="text-sm font-bold text-slate-800">Modegah Industrial Systems</p>
                <p className="text-xs text-slate-500">Shai Hills Factory, Unit 01</p>
                <p className="text-xs text-slate-500">Greater Accra, Ghana</p>
              </div>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 inline-flex">
                <CheckCircle size={16} />
                <span className="text-xs font-bold uppercase">Payment Confirmed</span>
              </div>
            </div>
            <div className="text-right space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Ref</p>
                <p className="text-sm font-bold text-slate-800">{order.transactionId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                <p className="text-sm font-bold text-slate-800">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-12">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                  <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                  <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-4">
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.category} • Certified High-Vibration</p>
                    </td>
                    <td className="py-4 text-center text-sm font-bold text-slate-600">{item.quantity}</td>
                    <td className="py-4 text-right text-sm text-slate-500">{formatPrice(item.price)}</td>
                    <td className="py-4 text-right text-sm font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-full max-w-[240px] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold">{formatPrice(order.subtotalGHS)}</span>
              </div>
              {order.discountAppliedGHS > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="font-medium">Loyalty Discount</span>
                  <span className="font-bold">-{formatPrice(order.discountAppliedGHS)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">NHIL (2.5%)</span>
                <span className="font-medium">{formatPrice(order.totalGHS * 0.025)}</span>
              </div>
              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center">
                <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-2xl font-bebas text-slate-900">{formatPrice(order.totalGHS)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="border-t border-slate-100 pt-8 grid grid-cols-2 gap-8 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100">
                <ShieldCheck size={20} />
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                Thank you for building with Modegah. This document serves as a valid proof of payment for your project records.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Regional Delivery</p>
              <div className="flex items-center justify-end gap-1 text-amber-600 text-[10px] font-bold">
                <MapPin size={10} /> GREATER ACCRA EXCLUSIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default ReceiptModal;
