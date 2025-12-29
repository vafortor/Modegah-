
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Calculator, Package, X, Home, ShoppingBag, Building2, LogOut, ShieldAlert, Heart, LayoutDashboard, Settings, User, Search } from 'lucide-react';
import { View, Currency, UserRole } from '../types';
import BlockIcon from './BlockIcon';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onLogout: () => void;
  userRole: UserRole | null;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, setView, cartCount, wishlistCount, onOpenCart, onLogout, userRole
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clientNavItems = [
    { id: View.HOME, label: 'Home', icon: Home },
    { id: View.SHOP, label: 'Catalogue', icon: ShoppingBag },
    { id: View.CALCULATOR, label: 'Estimator', icon: Calculator },
    { id: View.ORDERS, label: 'Orders', icon: Package }
  ];

  const partnerNavItems = [
    { id: View.PARTNER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.SHOP, label: 'Marketplace', icon: ShoppingBag },
    { id: View.PARTNER_SETTINGS, label: 'Settings', icon: Settings },
  ];

  const adminNavItems = [
    { id: View.ADMIN_DASHBOARD, label: 'Admin Console', icon: ShieldAlert },
    { id: View.SHOP, label: 'Inventory', icon: ShoppingBag },
  ];

  const navItems = userRole === 'ADMIN' ? adminNavItems : userRole === 'PARTNER' ? partnerNavItems : clientNavItems;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md border-slate-800 shadow-2xl py-2' 
        : 'bg-slate-900 border-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView(userRole === 'ADMIN' ? View.ADMIN_DASHBOARD : userRole === 'PARTNER' ? View.PARTNER_DASHBOARD : View.HOME)}
        >
          <div className={`${userRole === 'ADMIN' ? 'bg-red-600' : 'bg-amber-500'} p-2 rounded-xl transition-transform group-hover:scale-110 shadow-lg`}>
            <BlockIcon size={24} className={userRole === 'ADMIN' ? 'text-white' : 'text-slate-900'} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bebas tracking-wider leading-none text-white">MODEGAH</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-amber-500">
              {userRole === 'ADMIN' ? 'NETWORK ADMIN' : userRole === 'PARTNER' ? 'PARTNER TERMINAL' : 'BLOCK FACTORY'}
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 font-bold text-xs uppercase tracking-widest">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`transition-all hover:text-amber-500 relative ${
                currentView === item.id ? 'text-amber-500' : 'text-slate-400'
              }`}
            >
              {item.label}
              {currentView === item.id && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {userRole === 'CLIENT' && (
            <>
              <button 
                onClick={() => setView(View.SHOP)}
                className="hidden md:flex p-2.5 text-slate-400 hover:text-amber-500 transition-all"
                title="Search Catalogue"
              >
                <Search size={20} />
              </button>
              <button 
                onClick={() => setView(View.WISHLIST)}
                className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                title="Wishlist"
              >
                <Heart size={20} className={currentView === View.WISHLIST ? 'fill-amber-500 text-amber-500' : ''} />
                {wishlistCount > 0 && <span className="absolute top-1 right-1 bg-white text-slate-900 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-slate-900">{wishlistCount}</span>}
              </button>
              <button 
                onClick={() => setView(View.PROFILE)}
                className={`p-2.5 rounded-xl transition-all ${currentView === View.PROFILE ? 'bg-white/10 text-amber-500 shadow-xl shadow-black/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                title="Your Profile"
              >
                <User size={20} />
              </button>
              <button 
                onClick={onOpenCart} 
                className="relative p-2.5 bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-95"
                title="Order Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-white text-slate-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">{cartCount}</span>}
              </button>
            </>
          )}
          
          <button onClick={onLogout} className="hidden sm:flex p-2.5 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
          
          <button className="lg:hidden p-2.5 text-slate-300 hover:bg-white/5 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-[300px] bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Main Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                        currentView === item.id 
                          ? 'bg-amber-500 text-slate-900 shadow-xl shadow-amber-500/20' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  );
                })}
                {userRole === 'CLIENT' && (
                  <>
                   <button
                    onClick={() => { setView(View.PROFILE); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      currentView === View.PROFILE 
                        ? 'bg-white/10 text-amber-500' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <User size={20} />
                    Account Profile
                  </button>
                  <button
                    onClick={() => { setView(View.WISHLIST); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      currentView === View.WISHLIST 
                        ? 'bg-pink-500 text-white shadow-xl shadow-pink-500/20' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Heart size={20} />
                    Wishlist ({wishlistCount})
                  </button>
                  </>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-800 bg-slate-950/30">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
              >
                <LogOut size={18} />
                Terminate Session
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
