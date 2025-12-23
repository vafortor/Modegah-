
import React from 'react';
import { ShoppingCart, Menu, Calculator, MessageSquare, Package } from 'lucide-react';
import { View, Currency } from '../types';
import BlockIcon from './BlockIcon';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, cartCount, onOpenCart, onOpenChat, currency, setCurrency }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-xl border-b border-slate-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView(View.HOME)}
        >
          <div className="bg-amber-500 p-2 rounded-lg group-hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <BlockIcon size={24} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bebas tracking-wider leading-none">MODEGAH</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500">Block Factory</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          {[
            { id: View.HOME, label: 'Home' },
            { id: View.SHOP, label: 'Shop Blocks' },
            { id: View.CALCULATOR, label: 'Estimator' },
            { id: View.ORDERS, label: 'Orders' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`transition-colors hover:text-amber-500 ${currentView === item.id ? 'text-amber-500' : 'text-slate-300'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setCurrency('GHS')}
              className={`px-2 py-1 text-[10px] font-bold rounded ${currency === 'GHS' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              GHS
            </button>
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 text-[10px] font-bold rounded ${currency === 'USD' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              USD
            </button>
          </div>

          <button 
            onClick={onOpenChat}
            className="p-2 text-slate-300 hover:text-amber-500 transition-colors hidden sm:block"
            title="Ask AI Consultant"
          >
            <MessageSquare size={20} />
          </button>
          <button 
            onClick={() => setView(View.ORDERS)}
            className="p-2 text-slate-300 hover:text-amber-500 transition-colors hidden sm:block"
            title="Your Orders"
          >
            <Package size={20} />
          </button>
          <button 
            onClick={onOpenCart}
            className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 text-slate-300">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
