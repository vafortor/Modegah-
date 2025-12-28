
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

  const handleMobileNav = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

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
            <button onClick={onOpenCart} className="relative p-2 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          )}
          <button onClick={onLogout} className="hidden md:flex p-2 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
          <button className="md:hidden p-2 text-slate-300" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[280px] bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-amber-500">Navigation</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNav(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                        currentView === item.id 
                          ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/10' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950/50">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={18} />
                Secure Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
