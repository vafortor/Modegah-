
import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, Loader2, Key, CheckCircle2, ShieldCheck } from 'lucide-react';
import { View } from '../types';

interface ForgotPasswordProps {
  onBack: () => void;
  setView: (view: View) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, setView }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-950 p-6 overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-blue-500/20" />
       </div>

       <div className="relative z-10 w-full max-w-md animate-in zoom-in duration-500">
         <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
           <button 
             onClick={onBack}
             className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-8"
           >
             <ArrowLeft size={14} /> Return to Portal
           </button>

           {step === 1 ? (
             <div className="space-y-6 animate-in fade-in duration-300">
               <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                 <Key size={32} />
               </div>
               <h2 className="text-3xl font-bebas text-white tracking-wide">RESET <span className="text-amber-500">SECURITY KEY</span></h2>
               <p className="text-slate-400 text-sm leading-relaxed">Enter your registered email address. We will send you a secure link to reset your structural access credentials.</p>
               
               <form onSubmit={handleResetRequest} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email Address</label>
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
                   {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Recovery Link'}
                   {!isLoading && <ArrowRight size={18} />}
                 </button>
               </form>
             </div>
           ) : (
             <div className="text-center py-6 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                 <CheckCircle2 size={40} />
               </div>
               <h2 className="text-3xl font-bebas text-white tracking-wide mb-4">RECOVERY <span className="text-amber-500">INITIATED</span></h2>
               <p className="text-slate-400 text-sm leading-relaxed mb-10">
                 A secure link has been dispatched to <span className="text-white font-bold">{email}</span>. Valid for 15 minutes.
               </p>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 text-left mb-8">
                 <ShieldCheck className="text-amber-500 shrink-0" size={20} />
                 <p className="text-[10px] text-slate-400 uppercase font-black leading-tight">Check your spam folder if the transmission is delayed.</p>
               </div>
               <button 
                 onClick={() => setView(View.HOME)}
                 className="w-full bg-slate-900 text-white font-black py-4 rounded-xl border border-white/10 hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
               >
                 Back to Main Site
               </button>
             </div>
           )}
         </div>
       </div>
    </div>
  );
};

export default ForgotPassword;
