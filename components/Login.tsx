
import React, { useState } from 'react';
import { Lock, User, ArrowRight, Loader2, AlertCircle, ShieldCheck, Phone, UserPlus, LogIn, CheckCircle2, Factory, Briefcase } from 'lucide-react';
import { UserRole } from '../types';
import BlockIcon from './BlockIcon';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated Authentication Logic
    setTimeout(() => {
      if (isSignUp) {
        // Registration Logic (Client only for this demo)
        if (!fullName || !phone || !username || !password) {
          setError('Please fill in all fields to register.');
          setIsLoading(false);
          return;
        }
        setIsSuccess(true);
        setTimeout(() => onLogin('CLIENT'), 1500);
      } else {
        // Login Logic
        if (activeTab === 'CLIENT') {
          // Default client demo credentials: admin / modegah2024
          if (username.toLowerCase() === 'admin' && password === 'modegah2024') {
            onLogin('CLIENT');
          } else {
            setError('Invalid client credentials. Hint: use admin / modegah2024');
            setIsLoading(false);
          }
        } else {
          // Default partner demo credentials: partner / modegah_partner
          if (username.toLowerCase() === 'partner' && password === 'modegah_partner') {
            onLogin('PARTNER');
          } else {
            setError('Invalid partner credentials. Hint: use partner / modegah_partner');
            setIsLoading(false);
          }
        }
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={activeTab === 'CLIENT' 
            ? "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2000"
            : "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=2000"
          } 
          alt="Construction Background" 
          className="w-full h-full object-cover opacity-30 scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-4">
            <BlockIcon size={48} className="text-slate-900" />
          </div>
          <h1 className="text-5xl font-bebas text-white tracking-widest leading-none">MODEGAH</h1>
          <p className="text-xs uppercase tracking-[0.4em] font-bold text-amber-500 mt-1">Industrial Portal Access</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500 text-slate-950 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bebas text-white mb-2">WELCOME TO MODEGAH</h2>
              <p className="text-slate-400 text-sm">Account created successfully. Redirecting to your workspace...</p>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              {!isSignUp && (
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-white/5">
                  <button 
                    onClick={() => setActiveTab('CLIENT')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-widest transition-all ${activeTab === 'CLIENT' ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/10' : 'text-slate-400 hover:text-white'}`}
                  >
                    <User size={16} /> CUSTOMER
                  </button>
                  <button 
                    onClick={() => setActiveTab('PARTNER')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-widest transition-all ${activeTab === 'PARTNER' ? 'bg-slate-800 text-amber-500 shadow-lg shadow-slate-950/20' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Factory size={16} /> PARTNER
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {isSignUp ? <UserPlus size={18} className="text-amber-500" /> : <Lock size={18} className="text-amber-500" />} 
                  {isSignUp ? 'Create Account' : activeTab === 'CLIENT' ? 'Sign In' : 'Partner Login'}
                </h2>
                
                {activeTab === 'CLIENT' && (
                  <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/20"
                  >
                    {isSignUp ? 'BACK TO LOGIN' : 'SIGN UP'}
                  </button>
                )}
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
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-slate-600"
                          placeholder="Your full name"
                          required
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      </div>
                    </div>

                    <div className="animate-in slide-in-from-top-2 duration-400">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">MoMo Enabled Number</label>
                      <div className="relative">
                        <input 
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-slate-600"
                          placeholder="+233"
                          required
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {activeTab === 'CLIENT' ? 'Username / Email' : 'Factory Key / Partner ID'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      placeholder={activeTab === 'CLIENT' ? "Enter username" : "Enter partner ID"}
                      required
                    />
                    {activeTab === 'CLIENT' ? (
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    ) : (
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-[0.98] ${
                    activeTab === 'CLIENT' 
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20' 
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-500 shadow-slate-950/20 border border-amber-500/20'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'CREATE ACCOUNT' : activeTab === 'CLIENT' ? 'SIGN IN' : 'ACCESS DASHBOARD'} 
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {activeTab === 'PARTNER' && (
                <div className="mt-6 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">New Factory Partner?</p>
                  <button 
                    onClick={() => {
                      // Navigate directly to the partner portal application flow
                      // This will effectively bypass login for the application form if logic allows
                      // but here we just show a hint.
                      setError('Please use "partner / modegah_partner" for testing or complete the registration form.');
                    }}
                    className="text-xs font-bold text-amber-500 hover:underline"
                  >
                    Apply for Modegah Certification
                  </button>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-amber-500/50" /> Encrypted Industrial Connection
                </div>
                <p className="text-slate-600 text-[10px] text-center leading-relaxed">
                  Modegah Identity Manager. Unauthorized access attempts are monitored and logged. © 2024.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
