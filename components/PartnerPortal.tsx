
import React, { useState } from 'react';
import { Building2, ShieldCheck, Truck, CheckCircle, Send, Award, Users, Factory, LayoutDashboard, FileSearch, ClipboardCheck, Activity, Clock, Loader2, Zap, Crown, CreditCard, ChevronRight } from 'lucide-react';
import { View } from '../types';

interface PartnerPortalProps {
  setView: (view: View) => void;
}

const PartnerPortal: React.FC<PartnerPortalProps> = ({ setView }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'premium' | 'enterprise'>('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || loading) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const tiers = [
    {
      id: 'standard',
      name: 'Standard',
      price: '450',
      icon: CheckCircle,
      color: 'text-slate-600',
      features: ['Access to Order Network', 'Standard Marketplace Listing', 'Modegah Certification Badge']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '1,200',
      icon: Zap,
      color: 'text-amber-500',
      features: ['Priority Order Routing', 'Featured Catalogue Status', 'Monthly Quality Lab Tests', 'Logistics Dashboard Access']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '3,500',
      icon: Crown,
      color: 'text-purple-500',
      features: ['Dedicated Logistics Support', '1% Fixed Commission Cap', 'Multi-Factory Management', 'Custom API Integration']
    }
  ];

  if (submitted) {
    const statusStages = [
      { id: 1, label: 'Application Received', icon: Send, status: 'completed', desc: 'Successfully logged in our system.' },
      { id: 2, label: 'Pending Review', icon: FileSearch, status: 'active', desc: 'Our team is verifying your factory data.' },
      { id: 3, label: 'Site Inspection Scheduled', icon: ClipboardCheck, status: 'pending', desc: 'Vibration testing at your location.' },
      { id: 4, label: 'Approved & Certified', icon: Award, status: 'pending', desc: 'Access to the Modegah Order Network.' },
    ];

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bebas tracking-wide mb-3">SUCCESSFULLY <span className="text-amber-500">SUBMITTED</span></h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Your application for the <span className="text-slate-900 font-bold uppercase">{selectedTier}</span> tier is now being processed.
          </p>
        </div>

        {/* Application Status Tracker */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-12">
          <div className="bg-slate-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-4">
              <Activity className="text-amber-500" size={18} />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Application Tracker: #APP-{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-amber-500 uppercase">
              <Clock size={12} /> Live Status
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-slate-100 z-0" />
              
              {statusStages.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.id} className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                      stage.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' :
                      stage.status === 'active' ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30 animate-pulse' :
                      'bg-slate-50 text-slate-300 border border-slate-100'
                    }`}>
                      <Icon size={28} />
                    </div>
                    <h4 className={`text-sm font-bold mb-1 ${stage.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>
                      {stage.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 max-w-[120px] leading-tight">
                      {stage.desc}
                    </p>
                    
                    <div className={`mt-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter ${
                      stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                      stage.status === 'active' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                      {stage.status === 'completed' ? 'Done' : stage.status === 'active' ? 'In Progress' : 'Pending'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 border-t border-slate-100">
            <div className="flex items-start gap-4 text-slate-600">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <CreditCard className="text-amber-500" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">Billing Confirmation</p>
                <p className="text-xs leading-relaxed">
                  Upon approval, your monthly subscription of GH₵ {tiers.find(t => t.id === selectedTier)?.price} will be initiated via the provided mobile money number. No charges will be made until certification is final.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => setView(View.SHOP)}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
          >
            Return to Store
          </button>
          <button 
            onClick={() => setView(View.PARTNER_DASHBOARD)}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <LayoutDashboard size={18} className="text-amber-500" />
            Enter Partner Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bebas mb-6 leading-none">JOIN THE <span className="text-amber-500">NETWORK</span></h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Scale your block factory with the Modegah ecosystem. Choose a partnership tier that fits your production scale.
        </p>
      </div>

      {/* Subscription Tiers Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            onClick={() => setSelectedTier(tier.id as any)}
            className={`cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col ${
              selectedTier === tier.id 
                ? 'border-amber-500 bg-amber-50/50 shadow-xl shadow-amber-500/10 ring-4 ring-amber-500/5' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            {selectedTier === tier.id && (
              <div className="absolute top-4 right-4 text-amber-500">
                <CheckCircle size={24} fill="currentColor" className="text-white" />
              </div>
            )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
              selectedTier === tier.id ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 text-slate-500'
            }`}>
              <tier.icon size={28} />
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-1">{tier.name}</h3>
            
            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Monthly Subscription Fee</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bebas text-slate-900">GH₵ {tier.price}</span>
                <span className="text-xs text-slate-500 font-bold">/ Month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle size={14} className="text-green-500 mt-1 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              selectedTier === tier.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
            }`}>
              {selectedTier === tier.id ? 'PLAN SELECTED' : 'SELECT THIS PLAN'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-slate-900 p-12 text-white">
            <h3 className="text-2xl font-bebas tracking-wide mb-8">PARTNER <span className="text-amber-500">STANDARDS</span></h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <CheckCircle className="text-amber-500 flex-shrink-0" size={20} />
                <div className="text-sm">
                  <p className="font-bold">High-Vibration Molding</p>
                  <p className="text-slate-400">Must use high-frequency vibration tables for molding.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle className="text-amber-500 flex-shrink-0" size={20} />
                <div className="text-sm">
                  <p className="font-bold">Greater Accra Compliance</p>
                  <p className="text-slate-400">Factory must be within 100km of Accra.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <ShieldCheck className="text-amber-500 flex-shrink-0" size={20} />
                <div className="text-sm">
                  <p className="font-bold">Monthly Lab Verification</p>
                  <p className="text-slate-400">Mandatory for Premium and Enterprise tiers.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Selected Partnership</p>
                  <p className="text-slate-900 font-black text-xl capitalize">{selectedTier}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Subscription Fee</p>
                  <p className="text-slate-900 font-black text-xl">GH₵ {tiers.find(t => t.id === selectedTier)?.price}<span className="text-xs font-bold text-slate-400 ml-1">/mo</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Factory Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-medium" placeholder="e.g. Accra Solid Blocks Ltd" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-medium" placeholder="e.g. Tema Community 25" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Owner Contact (WhatsApp/MoMo)</label>
                <input required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-medium" placeholder="+233" />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="mt-1"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="text-xs text-amber-900 leading-relaxed font-medium">
                    I agree to the {selectedTier} tier subscription terms. I understand that my factory will undergo a certification process and my subscription fee of GH₵ {tiers.find(t => t.id === selectedTier)?.price}/month will be active upon final approval.
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={!agreed || loading}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    PROCESSING APPLICATION...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    SUBMIT {selectedTier.toUpperCase()} APPLICATION
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;
