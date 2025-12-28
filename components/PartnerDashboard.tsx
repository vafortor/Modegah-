
import React from 'react';
import { Package, TrendingUp, ShieldCheck, Factory, Clock, AlertCircle, ChevronRight, LayoutDashboard, BarChart3, Truck, Zap, CreditCard, ExternalLink, CheckCircle, BarChart, Activity, DollarSign, ArrowUpRight, MapPin, Navigation } from 'lucide-react';

const PartnerDashboard: React.FC = () => {
  const stats = [
    { label: 'Pending Assignments', value: '08', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Production (24h)', value: '3,200', icon: Factory, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Fleet', value: '03 / 05', icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Quality Score', value: '98%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentOrders = [
    { id: 'MOD-1044', client: 'John Mensah', units: '800', product: '6" Hollow', location: 'Legon', status: 'In Production', priority: 'High', eta: '4h' },
    { id: 'MOD-1042', client: 'Arch-Construct', units: '2,500', product: '8" Solid', location: 'Tema Port', status: 'Ready', priority: 'Standard', eta: 'Tomorrow' },
    { id: 'MOD-1039', client: 'Sarah Wood', units: '450', product: 'Paving Stones', location: 'Spintex', status: 'Dispatched', priority: 'Standard', eta: 'En Route' },
  ];

  const fleetStatus = [
    { id: 'T-01', type: 'DAF 15T', driver: 'Isaac', status: 'Delivering', load: '95%', dest: 'Legon' },
    { id: 'T-02', type: 'KIA 4T', driver: 'Kojo', status: 'Returning', load: '0%', dest: 'Yard' },
    { id: 'T-03', type: 'DAF 15T', driver: 'Yaw', status: 'Loading', load: '40%', dest: 'Tema Port' },
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
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Factory Command System</span>
          </div>
          <h1 className="text-5xl font-bebas tracking-wide">PARTNER <span className="text-amber-500">OPERATIONS</span></h1>
          <p className="text-slate-500 text-sm mt-1">Elite Concrete Partners (Unit 04) — <span className="text-slate-900 font-bold">GT. ACCRA HUB</span></p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Zap size={18} className="text-amber-500" fill="currentColor" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Access Level</p>
              <p className="text-sm font-bold text-amber-500">PREMIUM PARTNER</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Live Connection</span>
          </div>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-3">
                <Package className="text-amber-500" size={20} /> Active Assignments
              </h3>
              <div className="flex gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-amber-500/20">Action Required</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {recentOrders.map((order, i) => (
                <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      order.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Activity size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-extrabold text-slate-900 text-lg">{order.id}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                          order.status === 'Dispatched' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {order.units} × {order.product} — <span className="text-slate-900 font-bold">{order.location}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold flex items-center gap-1">
                        <Clock size={10} /> ETA: {order.eta}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase">Update Status</button>
                    <button className="p-2 text-slate-400 hover:text-amber-500 bg-white rounded-lg border border-slate-100"><ChevronRight size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-3">
                <Truck className="text-amber-500" size={20} /> Fleet Live Tracking
              </h3>
              <button className="text-xs font-bold text-amber-600 flex items-center gap-1">Open Fleet Map <ExternalLink size={12} /></button>
            </div>
            <div className="space-y-4">
              {fleetStatus.map((truck) => (
                <div key={truck.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                      <Navigation size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{truck.id} — {truck.driver}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{truck.type} • Destination: {truck.dest}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase mb-1 ${truck.status === 'Delivering' ? 'text-blue-600' : truck.status === 'Loading' ? 'text-amber-600' : 'text-slate-400'}`}>{truck.status}</p>
                    <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: truck.load }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bebas tracking-wide mb-6">REVENUE <span className="text-amber-500">INSIGHTS</span></h3>
              <div className="mb-8">
                <p className="text-4xl font-bebas text-white">GH₵ 68,400</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Payouts to Date</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Current Cycle</span>
                  <span className="font-bold">GH₵ 4,250</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Net Fee (2.5%)</span>
                  <span className="text-red-400 font-bold">- GH₵ 106.25</span>
                </div>
              </div>
              <button className="w-full bg-amber-500 text-slate-900 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2">
                <DollarSign size={18} /> Download Statement
              </button>
            </div>
            <BarChart className="absolute -bottom-10 -right-10 text-white/5" size={240} />
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-amber-500" size={20} /> Certification
            </h3>
            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs font-bold text-green-900">QUALITY VERIFIED</span>
              </div>
              <p className="text-[10px] text-green-700 leading-relaxed font-medium">Your blocks met the 3.5 N/mm² standard in the last vibration test (Batch 09-24).</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Avg. Strength</span>
                <span className="text-slate-900">4.1 N/mm²</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Network Rank</span>
                <span className="text-amber-600">Top 5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
