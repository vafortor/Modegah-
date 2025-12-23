
import React from 'react';
import { Package, TrendingUp, ShieldCheck, Factory, Clock, AlertCircle, ChevronRight, LayoutDashboard, BarChart3, Truck, Zap, CreditCard, ExternalLink, CheckCircle, BarChart, Activity, DollarSign, ArrowUpRight } from 'lucide-react';

const PartnerDashboard: React.FC = () => {
  const stats = [
    { label: 'Pending Assignments', value: '08', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Production (24h)', value: '3,200', icon: Factory, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Fleet', value: '03 / 05', icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Quality Score', value: '98%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentOrders = [
    { id: 'MOD-1044', client: 'John Mensah', units: '800', product: '6" Hollow', location: 'Legon', status: 'In Production', priority: 'High' },
    { id: 'MOD-1042', client: 'Arch-Construct', units: '2,500', product: '8" Solid', location: 'Tema Port', status: 'Ready', priority: 'Standard' },
    { id: 'MOD-1039', client: 'Sarah Wood', units: '450', product: 'Paving Stones', location: 'Spintex', status: 'Dispatched', priority: 'Standard' },
  ];

  const revenueByMonth = [
    { month: 'May', amount: 45 },
    { month: 'Jun', amount: 52 },
    { month: 'Jul', amount: 48 },
    { month: 'Aug', amount: 61 },
    { month: 'Sep', amount: 68 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-amber-500" size={18} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Factory Management System</span>
          </div>
          <h1 className="text-5xl font-bebas tracking-wide">PARTNER <span className="text-amber-500">COMMAND CENTER</span></h1>
          <p className="text-slate-500 text-sm mt-1">Modegah Certified Partner: <span className="text-slate-900 font-bold">Elite Concrete Partners (Unit 04)</span></p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Zap size={18} className="text-amber-500" fill="currentColor" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Status</p>
              <p className="text-sm font-bold">CERTIFIED PREMIUM</p>
            </div>
          </div>
          <button className="bg-white border border-slate-200 p-3 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
              <stat.icon size={28} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 mb-10 overflow-hidden relative group">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-500" size={20} />
              <h3 className="font-bold text-slate-900">Monthly Revenue Analytics</h3>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bebas text-slate-900">GH₵ 68.4k</span>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
                <ArrowUpRight size={14} /> +12.5%
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-2">Current billing cycle: September 2024</p>
          </div>
          
          <div className="flex items-end gap-3 h-32 md:h-24">
            {revenueByMonth.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group/bar">
                <div 
                  className={`w-10 md:w-12 bg-slate-100 rounded-t-lg transition-all duration-500 relative ${
                    i === revenueByMonth.length - 1 ? 'bg-amber-500' : 'hover:bg-slate-200'
                  }`}
                  style={{ height: `${(item.amount / 70) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
                    GH₵ {item.amount}k
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 z-0 group-hover:scale-110 transition-transform duration-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Active Assignments */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-3">
                <Package className="text-amber-500" size={20} /> Active Network Assignments
              </h3>
              <div className="flex gap-2">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">8 Pending</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {recentOrders.map((order, i) => (
                <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      order.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-extrabold text-slate-900">{order.id} • {order.client}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                          order.status === 'Dispatched' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{order.units} units of {order.product} — <span className="text-slate-400">{order.location}</span></p>
                    </div>
                  </div>
                  <button className="p-3 text-slate-300 hover:text-amber-500 hover:bg-white rounded-xl shadow-sm transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full p-4 bg-slate-50 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-100 uppercase tracking-widest">
              View All Order Queue
            </button>
          </div>

          {/* Logistics Tracking */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-3">
                <Truck className="text-amber-500" size={20} /> Logistics & Fleet
              </h3>
              <button className="text-xs font-bold text-amber-600 flex items-center gap-1">Manage Fleet <ExternalLink size={12} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Available Trucks</span>
                  <span className="text-lg font-bold text-slate-900">03 / 05</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                  <div className="h-full w-3/5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
                </div>
                <p className="text-xs text-slate-500 italic">2 Trucks currently dispatched to Madina & Tema.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Load Efficiency</span>
                  <span className="text-lg font-bold text-slate-900">92%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                  <div className="h-full w-[92%] bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                </div>
                <p className="text-xs text-slate-500 italic">Optimal grouping achieved for current routes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Quality & Lab Results */}
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bebas tracking-wide mb-6">CERTIFICATION <span className="text-amber-500">STATUS</span></h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Compressive Strength: PASS</p>
                    <p className="text-xs text-slate-400">Batch 2024-09 test: 4.2 N/mm²</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Next Audit: Oct 12</p>
                    <p className="text-xs text-slate-400">Scheduled site vibration test.</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-amber-500 text-slate-900 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10">
                  Submit Lab Sample
                </button>
              </div>
            </div>
            <BarChart className="absolute -bottom-10 -right-10 text-white/5" size={240} />
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3">
              <CreditCard className="text-amber-500" size={20} /> Account & Fees
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Subscription Tier</span>
                <span className="font-bold text-amber-600">PREMIUM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Net Commission</span>
                <span className="font-bold">2.5%</span>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Next Billing</p>
                <p className="font-bold text-slate-900">Oct 15, 2024 — GH₵ 1,200</p>
              </div>
              <button className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
                View Billing History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default PartnerDashboard;
