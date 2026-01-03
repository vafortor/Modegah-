
import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, Loader2, Key, CheckCircle2, ShieldCheck, AlertCircle, Shield, Lock } from 'lucide-react';
import { View, UserRole, UserProfile } from '../types';

interface ForgotPasswordProps {
  onBack: () => void;
  setView: (view: View) => void;
}

interface StoredAccount {
  username: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, setView }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getStoredAccounts = (): StoredAccount[] => {
    const data = localStorage.getItem('modegah_accounts');
    return data ? JSON.parse(data) : [];
  };

  const handleIdentityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const accounts = getStoredAccounts();
      const match = accounts.find(acc => acc.profile.email.toLowerCase() === email.toLowerCase());

      if (match) {
        setIsLoading(false);
        setStep(2);
      } else {
        setIsLoading(false);
        setError('No account found with this email in the network.');
      }
    }, 1200);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const accounts = getStoredAccounts();
      const updatedAccounts = accounts.map(acc => {
        if (acc.profile.email.toLowerCase() === email.toLowerCase()) {
          return { ...acc, password: newPassword };
        }
        return acc;
      });

      localStorage.setItem('modegah_accounts', JSON.stringify(updatedAccounts));
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-950 p-6 overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-blue-500/20" />
       </div>

       <div className="relative z-10 w-full max-w-md animate-in zoom-in duration-500">
         <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
           {step < 3 && (
             <button 
               onClick={onBack}
               className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-8"
             >
               <ArrowLeft size={14} /> Return to Portal
             </button>
           )}

           {step === 1 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                 <Key size={32} />
               </div>
               <h2 className="text-3xl font-bebas text-white tracking-wide uppercase">Identify <span className="text-amber-500">Account</span></h2>
               <p className="text-slate-400 text-sm leading-relaxed">Enter your registered email address to locate your credentials in the Modegah Network.</p>
               
               <form onSubmit={handleIdentityCheck} className="space-y-6">
                 {error && (
                   <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-xs font-bold animate-in shake">
                     <AlertCircle size={16} /> {error}
                   </div>
                 )}

                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Registered Email</label>
                    <div className="relative">
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold"
                        placeholder="engineer@company.com"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={isLoading || !email}
                   className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Identity'}
                   {!isLoading && <ArrowRight size={18} />}
                 </button>
               </form>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                 <Shield size={32} />
               </div>
               <h2 className="text-3xl font-bebas text-white tracking-wide uppercase">New <span className="text-blue-500">Credentials</span></h2>
               <p className="text-slate-400 text-sm leading-relaxed">Identity confirmed for <span className="text-white font-bold">{email}</span>. Please provision a new security password.</p>
               
               <form onSubmit={handlePasswordReset} className="space-y-6">
                 {error && (
                   <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-xs font-bold animate-in shake">
                     <AlertCircle size={16} /> {error}
                   </div>
                 )}

                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">New Security Password</label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                        placeholder="••••••••"
                        required
                        autoFocus
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={isLoading || !newPassword}
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Update Security Key'}
                   {!isLoading && <ShieldCheck size={18} />}
                 </button>
               </form>
             </div>
           )}

           {step === 3 && (
             <div className="text-center py-6 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                 <CheckCircle2 size={40} />
               </div>
               <h2 className="text-3xl font-bebas text-white tracking-wide mb-4">SECURITY <span className="text-amber-500">RESTORED</span></h2>
               <p className="text-slate-400 text-sm leading-relaxed mb-10">
                 Your password has been successfully updated. Your new credentials are now active across the Modegah Network.
               </p>
               <button 
                 onClick={() => setView(View.HOME)}
                 className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-xl hover:bg-amber-400 transition-all uppercase text-xs tracking-widest active:scale-95"
               >
                 Proceed to Sign In
               </button>
             </div>
           )}
         </div>
       </div>
    </div>
  );
};

export default ForgotPassword;
