
import React, { useState, useEffect } from 'react';
// Added Factory to the imports
import { Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2, UserPlus, ShieldAlert, Key, Shield, Info, Factory, LifeBuoy } from 'lucide-react';
import { UserRole, View, UserProfile } from '../types';
import BlockIcon from './BlockIcon';

interface LoginProps {
  onLogin: (role: UserRole, profile?: UserProfile) => void;
  setView: (view: View) => void;
}

const MASTER_ADMIN_SECRET = 'MODEGAH_ROOT_ADMIN_2025';

const BACKGROUNDS: Record<UserRole, string> = {
  CLIENT: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2000",
  PARTNER: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=2000",
  ADMIN: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
};

interface StoredAccount {
  username: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
}

const Login: React.FC<LoginProps> = ({ onLogin, setView }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('CLIENT');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminToken, setAdminToken] = useState('');

  // Local Storage Logic
  const getStoredAccounts = (): StoredAccount[] => {
    const data = localStorage.getItem('modegah_accounts');
    return data ? JSON.parse(data) : [];
  };

  const saveAccount = (account: StoredAccount) => {
    const accounts = getStoredAccounts();
    accounts.push(account);
    localStorage.setItem('modegah_accounts', JSON.stringify(accounts));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const accounts = getStoredAccounts();
      const lowerUser = username.toLowerCase();

      if (isSignUp) {
        if (!fullName || !phone || !username || !password) {
          setError('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }

        if (accounts.some(acc => acc.username.toLowerCase() === lowerUser)) {
          setError('Username already exists in the network.');
          setIsLoading(false);
          return;
        }
        
        if (activeTab === 'ADMIN') {
          if (!adminToken) {
            setError('Admin Authorization Token is required.');
            setIsLoading(false);
            return;
          }
          if (adminToken !== MASTER_ADMIN_SECRET) {
            setError('Invalid Authorization Token.');
            setIsLoading(false);
            return;
          }
        }

        const newProfile: UserProfile = {
          fullName,
          phone,
          email: `${lowerUser}@modegah.com`,
          deliveryAddress: activeTab === 'CLIENT' ? 'Enter site address in settings' : 'Factory Registered Hub',
          businessName: activeTab === 'PARTNER' ? fullName : ''
        };

        const newAccount: StoredAccount = {
          username: lowerUser,
          password,
          role: activeTab,
          profile: newProfile
        };

        saveAccount(newAccount);
        setIsSuccess(true);
        setTimeout(() => onLogin(activeTab, newProfile), 1500);
      } else {
        const match = accounts.find(acc => acc.username.toLowerCase() === lowerUser && acc.password === password);
        
        if (match) {
          onLogin(match.role, match.profile);
        } else {
          if (activeTab === 'ADMIN' && lowerUser === 'admin' && password === 'modegah_admin') {
            onLogin('ADMIN');
          } else if (activeTab === 'PARTNER' && lowerUser === 'partner' && password === 'modegah_partner') {
            onLogin('PARTNER');
          } else if (activeTab === 'CLIENT' && lowerUser === 'client' && password === 'modegah_client') {
            onLogin('CLIENT');
          } else {
            setError('Invalid credentials. Check identification and try again.');
            setIsLoading(false);
          }
        }
      }
    }, 1200);
  };

  const handleQuickLogin = (role: UserRole) => {
    if (role === 'ADMIN') return; // Forbid automated admin login for security
    
    setIsLoading(true);
    setActiveTab(role);
    setIsSignUp(false);
    
    if (role === 'PARTNER') {
      setUsername('partner');
      setPassword('modegah_partner');
    } else {
      setUsername('client');
      setPassword('modegah_client');
    }

    setTimeout(() => {
      onLogin(role);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <img 
          src={BACKGROUNDS[activeTab]} 
          alt="Portal Background" 
          className="w-full h-full object-cover opacity-20 scale-105 transition-all duration-1000 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-4">
            <BlockIcon size={48} className="text-slate-900" />
          </div>
          <h1 className="text-5xl font-bebas text-white tracking-widest leading-none">MODEGAH</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-amber-500 mt-1">Industrial Portal Access</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500 text-slate-900 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bebas text-white mb-2">WELCOME TO MODEGAH</h2>
              <p className="text-slate-400 text-sm">Account provisioned successfully.</p>
            </div>
          ) : (
            <>
              {!isSignUp && (
                <div className="flex bg-slate-900/50 p-1 rounded-2xl mb-8 border border-white/5">
                  <button 
                    onClick={() => setActiveTab('CLIENT')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all ${activeTab === 'CLIENT' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    CUSTOMER
                  </button>
                  <button 
                    onClick={() => setActiveTab('PARTNER')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all ${activeTab === 'PARTNER' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    PARTNER
                  </button>
                  <button 
                    onClick={() => setActiveTab('ADMIN')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all ${activeTab === 'ADMIN' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    ADMIN
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {isSignUp ? <UserPlus size={18} className={activeTab === 'ADMIN' ? "text-red-500" : "text-amber-500"} /> : activeTab === 'ADMIN' ? <ShieldAlert size={18} className="text-red-500" /> : <Lock size={18} className="text-amber-500" />} 
                  {isSignUp ? (activeTab === 'ADMIN' ? 'Provision Admin' : 'Create Account') : activeTab === 'CLIENT' ? 'Customer Sign In' : activeTab === 'PARTNER' ? 'Partner Portal' : 'Administrator Login'}
                </h2>
                
                <button 
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                    isSignUp ? 'text-slate-400 border-white/10 hover:text-white' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                  }`}
                >
                  {isSignUp ? 'BACK' : 'SIGN UP'}
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-xs font-bold animate-in shake duration-300">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                {isSignUp && (
                  <>
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                      <input 
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="Legal Name"
                        required
                      />
                    </div>
                    <div className="animate-in slide-in-from-top-2 duration-400">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone (Contact)</label>
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="+233"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      placeholder="Access identifier"
                      required
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  </div>
                </div>

                {isSignUp && activeTab === 'ADMIN' && (
                  <div className="animate-in slide-in-from-top-2 duration-500">
                    <label className="block text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 ml-1">Master Security Token</label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={adminToken}
                        onChange={(e) => setAdminToken(e.target.value)}
                        className="w-full bg-slate-900/50 border border-red-500/30 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Security Token"
                        required
                      />
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/50" size={18} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Security Password</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] ${
                    activeTab === 'CLIENT' ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' :
                    activeTab === 'PARTNER' ? 'bg-slate-800 hover:bg-slate-700 text-amber-500' :
                    'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <> {isSignUp ? 'REGISTER ACCOUNT' : 'SECURE ACCESS'} <ArrowRight size={20} /> </>}
                </button>

                {!isSignUp && (
                  <div className="text-center mt-2">
                    <button 
                      type="button"
                      onClick={() => setView(View.FORGOT_PASSWORD)}
                      className="text-[10px] font-black text-amber-500/60 hover:text-amber-500 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                      <LifeBuoy size={14} /> Forgot security password?
                    </button>
                  </div>
                )}
              </form>

              {!isSignUp && !isLoading && (
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Quick Demo Access</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { role: 'CLIENT' as UserRole, label: 'Client', icon: User },
                      { role: 'PARTNER' as UserRole, label: 'Partner', icon: Factory },
                    ].map((demo) => (
                      <button 
                        key={demo.role}
                        onClick={() => handleQuickLogin(demo.role)}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 py-3 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all group"
                      >
                        <demo.icon size={14} className="group-hover:text-amber-500" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter">{demo.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
           <Info className="text-amber-500 shrink-0 mt-0.5" size={16} />
           <p className="text-[10px] text-amber-200/70 font-medium leading-relaxed">
             <span className="text-amber-500 font-black">DEMO ENVIRONMENT:</span> Accounts created here are stored in your browser's local memory. For production, these will be moved to a secure cloud database.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
