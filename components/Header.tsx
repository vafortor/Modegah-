
import React, { useState } from 'react';
import { ShoppingCart, Menu, Calculator, MessageSquare, Package, X, Home, ShoppingBag, Building2, ChevronRight, LogOut, LayoutDashboard, Settings, ShieldAlert } from 'lucide-react';
import { View, Currency, UserRole } from '../types';
import BlockIcon from './BlockIcon';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onLogout: () => void;
  userRole: UserRole | null;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, setView, cartCount, onOpenCart, onOpenChat, currency, setCurrency, onLogout, userRole
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const clientNavItems = [
    { id: View.HOME, label: 'Home', icon: Home },
    { id: View.SHOP, label: 'Shop Products', icon: ShoppingBag },
    { id: View.CALCULATOR, label: 'Estimator', icon: Calculator },
    { id: View.ORDERS, label: 'Orders', icon: Package },
    { id: View.PARTNER, label: 'Partner Portal', icon: Building2 }
  ];

  const partnerNavItems = [
    { id: View.PARTNER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.SHOP, label: 'Marketplace View', icon: ShoppingBag },
    { id: View.PARTNER_SETTINGS, label: 'Factory Settings', icon: Settings },
  ];

  const adminNavItems = [
    { id: View.ADMIN_DASHBOARD, label: 'Admin Console', icon: ShieldAlert },
    { id: View.SHOP, label: 'Product Inventory', icon: ShoppingBag },
    { id: View.PARTNER_DASHBOARD, label: 'Simulate Partner', icon: LayoutDashboard },
  ];

  const navItems = userRole === 'ADMIN' ? adminNavItems : userRole === 'PARTNER' ? partnerNavItems : clientNavItems;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-xl border-b border-slate-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView(userRole === 'ADMIN' ? View.ADMIN_DASHBOARD : userRole === 'PARTNER' ? View.PARTNER_DASHBOARD : View.HOME)}
        >
          <div className={`${userRole === 'ADMIN' ? 'bg-red-600' : 'bg-amber-500'} p-2 rounded-lg transition-all`}>
            <BlockIcon size={24} className={userRole === 'ADMIN' ? 'text-white' : 'text-slate-900'} />
          </div>
          <div>
            <h1 className="text-xl font-bebas tracking-wider leading-none">MODEGAH</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500">
              {userRole === 'ADMIN' ? 'NETWORK ADMIN' : userRole === 'PARTNER' ? 'PARTNER TERMINAL' : 'BLOCK FACTORY'}
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`transition-colors hover:text-amber-500 whitespace-nowrap ${currentView === item.id ? 'text-amber-500' : 'text-slate-300'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {userRole === 'CLIENT' && (
            <button onClick={onOpenCart} className="relative p-2 bg-slate-800 rounded-full border border-slate-700">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          )}
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
