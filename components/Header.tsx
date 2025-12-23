
import React, { useState } from 'react';
import { ShoppingCart, Menu, Calculator, MessageSquare, Package, X, Home, ShoppingBag, Building2, ChevronRight, LogOut, LayoutDashboard, Settings } from 'lucide-react';
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
  currentView, 
  setView, 
  cartCount, 
  onOpenCart, 
  onOpenChat, 
  currency, 
  setCurrency,
  onLogout,
  userRole
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
    { id: View.HOME, label: 'Public Home', icon: Home },
  ];

  const navItems = userRole === 'PARTNER' ? partnerNavItems : clientNavItems;

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-xl border-b border-slate-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView(userRole === 'PARTNER' ? View.PARTNER_DASHBOARD : View.HOME)}
        >
          <div className="bg-amber-500 p-2 rounded-lg group-hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <BlockIcon size={24} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bebas tracking-wider leading-none">MODEGAH</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500">
              {userRole === 'PARTNER' ? 'PARTNER PORTAL' : 'Block Factory'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
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

        {/* Desktop Controls & Shared Mobile Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {userRole === 'CLIENT' && (
            <div className="hidden sm:flex bg-slate-800 rounded-lg p-1 border border-slate-700">
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
          )}

          {userRole === 'CLIENT' && (
            <button 
              onClick={onOpenChat}
              className="p-2 text-slate-300 hover:text-amber-500 transition-colors hidden sm:block"
              title="Ask AI Consultant"
            >
              <MessageSquare size={20} />
            </button>
          )}
          
          {userRole === 'CLIENT' && (
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
          )}

          {userRole === 'PARTNER' && (
            <button 
              onClick={() => setView(View.PARTNER_SETTINGS)}
              className={`p-2 transition-colors hidden sm:block ${currentView === View.PARTNER_SETTINGS ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}
              title="Factory Settings"
            >
              <Settings size={20} />
            </button>
          )}

          <button 
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2 p-2 text-slate-400 hover:text-red-400 transition-colors border-l border-slate-800 ml-2 pl-4"
            title="Logout"
          >
            <LogOut size={18} />
          </button>

          {/* Hamburger Menu Icon */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-amber-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Side Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-[300px] bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-800">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-amber-500 p-1.5 rounded-lg">
                  <BlockIcon size={20} className="text-slate-900" />
                </div>
                <h2 className="text-lg font-bebas tracking-wider text-white">MODEGAH</h2>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {userRole === 'CLIENT' && (
                <div className="flex items-center justify-between mb-8 bg-slate-800 rounded-xl p-3 border border-slate-700">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Currency</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrency('GHS')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${currency === 'GHS' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 bg-slate-700'}`}
                    >
                      GHS
                    </button>
                    <button 
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${currency === 'USD' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 bg-slate-700'}`}
                    >
                      USD
                    </button>
                  </div>
                </div>
              )}

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                      isActive 
                        ? 'bg-amber-500 text-slate-900 font-bold' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={20} className={isActive ? 'text-slate-900' : 'text-amber-500'} />
                      <span className="text-sm tracking-wide">{item.label}</span>
                    </div>
                    {!isActive && <ChevronRight size={16} className="text-slate-600 group-hover:text-amber-500" />}
                  </button>
                );
              })}

              <button
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-4 border border-red-500/20"
              >
                <div className="flex items-center gap-4">
                  <LogOut size={20} />
                  <span className="text-sm tracking-wide font-bold">Sign Out</span>
                </div>
              </button>
            </div>

            {/* Footer / CTA in Menu */}
            <div className="p-6 bg-slate-950 border-t border-slate-800">
              {userRole === 'CLIENT' ? (
                <button 
                  onClick={() => { onOpenChat(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white py-4 rounded-xl font-bold border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  <MessageSquare size={18} className="text-amber-500" />
                  Ask AI Assistant
                </button>
              ) : (
                <button 
                  onClick={() => handleNavClick(View.PARTNER_SETTINGS)}
                  className={`w-full flex items-center justify-center gap-3 bg-slate-800 text-white py-4 rounded-xl font-bold border border-slate-700 hover:bg-slate-700 transition-all ${currentView === View.PARTNER_SETTINGS ? 'bg-amber-500 text-slate-900' : ''}`}
                >
                  <Settings size={18} className={currentView === View.PARTNER_SETTINGS ? 'text-slate-900' : 'text-amber-500'} />
                  Portal Settings
                </button>
              )}
              <p className="mt-4 text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                {userRole === 'PARTNER' ? 'PARTNER TERMINAL • SHAI HILLS' : 'Afienyah, Shai Hills Factory'}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
