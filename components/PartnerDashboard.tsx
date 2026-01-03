
import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, ShieldCheck, Factory, Clock, AlertCircle, ChevronRight, LayoutDashboard, BarChart3, Truck, Zap, CreditCard, ExternalLink, CheckCircle, BarChart, Activity, DollarSign, ArrowUpRight, MapPin, Navigation, Loader2, Download, ClipboardCheck, X, Check, Globe, Crosshair, AlertTriangle, PlayCircle, ZapOff, Beaker } from 'lucide-react';

interface PartnerDashboardProps {
  addNotification?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

type OrderStatus = 'In Production' | 'Ready' | 'Dispatched';

interface Assignment {
  id: string;
  client: string;
  units: string;
  product: string;
  location: string;
  status: OrderStatus;
  priority: 'High' | 'Standard';
  eta: string;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ addNotification }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  // State for Action Required tasks
  const [pendingActions, setPendingActions] = useState([
    { id: 'ACT-1', title: 'Quality Batch Verification', desc: 'Batch #88291 requires manual vibration intensity log.', type: 'quality', icon: Beaker, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'ACT-2', title: 'Fleet Authorization', desc: 'Driver Ekow Barnes (T-01) is ready for dispatch.', type: 'logistics', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'ACT-3', title: 'Inventory Alert', desc: 'Grade 42.5R Cement levels falling below 50 bags.', type: 'stock', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
  ]);
  
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 'MOD-1044', client: 'John Mensah', units: '800', product: '6" Hollow', location: 'Legon', status: 'In Production', priority: 'High', eta: '4h' },
    { id: 'MOD-1042', client: 'Arch-Construct', units: '2,500', product: '8" Solid', location: 'Tema Port', status: 'Ready', priority: 'Standard', eta: 'Tomorrow' },
    { id: 'MOD-1039', client: 'Sarah Wood', units: '450', product: 'Paving Stones', location: 'Spintex', status: 'Dispatched', priority: 'Standard', eta: 'En Route' },
  ]);

  const resolveAction = (id: string) => {
    setPendingActions(prev => prev.filter(a => a.id !== id));
    addNotification?.('success', 'Action Resolved', 'Task marked as completed in the network.');
  };

  const stats = [
    { label: 'Pending Assignments', value: assignments.filter(a => a.status !== 'Dispatched').length.toString().padStart(2, '0'), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Production (24h)', value: '3,200', icon: Factory, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Fleet', value: '03 / 05', icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Quality Score', value: '98%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const fleetStatus = [
    { id: 'T-01', type: 'DAF 15T', driver: 'Isaac', status: 'Delivering', load: '95%', dest: 'Legon', x: 35, y: 45 },
    { id: 'T-02', type: 'KIA 4T', driver: 'Kojo', status: 'Returning', load: '0%', dest: 'Yard', x: 60, y: 70 },
    { id: 'T-03', type: 'DAF 15T', driver: 'Yaw', status: 'Loading', load: '40%', dest: 'Tema Port', x: 80, y: 30 },
  ];

  const handleUpdateStatus = (id: string) => {
    setUpdatingId(id);
    setTimeout(() => {
      setAssignments(prev => prev.map(a => {
        if (a.id === id) {
          let nextStatus: OrderStatus = 'In Production';
          if (a.status === 'In Production') nextStatus = 'Ready';
          else if (a.status === 'Ready') nextStatus = 'Dispatched';
          
          if (addNotification) {
            addNotification('success', 'Network Status Updated', `${id} is now marked as ${nextStatus}.`);
          }
          return { ...a, status: nextStatus };
        }
        return a;
      }));
      setUpdatingId(null);
      setSelectedTask(null);
    }, 800);
  };

  const handleDownloadStatement = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const content = `MODEGAH BLOCK FACTORY NETWORK\nPARTNER FINANCIAL STATEMENT\nDATE: ${date}\n...`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Modegah_Statement_Sept24.txt`;
      link.click();
      setIsDownloading(false);
      addNotification?.('success', 'Statement Ready', 'Financial summary downloaded.');
    }, 1500);
  };

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

      {/* STRATEGIC ACTION CENTER */}
      {pendingActions.length > 0 && (
        <div className="mb-12 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-xl text-slate-900">
                <AlertTriangle size={18} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Action Center</h2>
            </div>
            <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase animate-pulse">
              {pendingActions.length} Critical Items
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingActions.map((action) => (
              <div key={action.id} className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-xl shadow-amber-500/5 hover:border-amber-500 transition-all group relative overflow-hidden">
                <div className="flex gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <action.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-900 mb-1">{action.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{action.desc}</p>
                    <button 
                      onClick={() => resolveAction(action.id)}
                      className="mt-4 w-full bg-slate-900 text-white font-black py-2.5 rounded-xl text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
                    >
                      <CheckCircle size={14} className="text-amber-500" />
                      Resolve Now
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity size={60} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                {assignments.some(a => a.status !== 'Dispatched') && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-amber-500/20 animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {assignments.map((order) => (
                <div key={order.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative ${
                      order.status !== 'Dispatched' ? 'ring-2 ring-amber-500/20' : ''
                    } ${
                      order.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Activity size={24} />
                      {order.status !== 'Dispatched' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-extrabold text-slate-900 text-lg">{order.id}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter transition-all ${
                          order.status === 'Dispatched' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Ready' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
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
                  <div className="flex gap-2">
                    {order.status !== 'Dispatched' ? (
                      <button 
                        onClick={() => setSelectedTask(order)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
                      >
                        {updatingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <ClipboardCheck size={14} className="text-amber-500" />}
                        Process
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl border border-green-100">
                        <CheckCircle size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Completed</span>
                      </div>
                    )}
                    <button className="p-2.5 text-slate-400 hover:text-amber-500 bg-white rounded-xl border border-slate-100 shadow-sm"><ChevronRight size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Task Processor (Modal simulation) */}
          {selectedTask && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
               <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
               <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                 <div className="bg-slate-900 p-8 flex items-center justify-between text-white">
                   <div className="flex items-center gap-4">
                     <div className="bg-amber-500 p-2.5 rounded-2xl text-slate-900">
                       <ClipboardCheck size={24} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bebas tracking-wide">Production <span className="text-amber-500">Terminal</span></h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Reference: {selectedTask.id}</p>
                     </div>
                   </div>
                   <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                 </div>
                 
                 <div className="p-8 space-y-8">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Order Requirement</p>
                      <p className="text-lg font-bold text-slate-900 leading-tight">{selectedTask.units} Units of {selectedTask.product}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Shipping to site: {selectedTask.location}</p>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Assurance Checklist</p>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl">
                           <CheckCircle size={18} className="text-green-500" />
                           <span className="text-sm font-bold text-slate-700">Vibration Molding Completed</span>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl">
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-amber-500" />
                            <span className="text-sm font-bold text-slate-700">Curing Interval Verification (Logged)</span>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl">
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-amber-500" />
                            <span className="text-sm font-bold text-slate-700">Final Pallet Load Secured</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button onClick={() => setSelectedTask(null)} className="flex-1 py-5 rounded-2xl bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200">Cancel</button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedTask.id)}
                        disabled={updatingId !== null}
                        className="flex-[2] bg-amber-500 text-slate-900 font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 hover:bg-amber-400 transition-all active:scale-[0.98]"
                      >
                        {updatingId ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        {selectedTask.status === 'In Production' ? 'Ready for Logistics' : 'Dispatch to Fleet'}
                      </button>
                   </div>
                 </div>
               </div>
            </div>
          )}

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-3">
                <Truck className="text-amber-500" size={20} /> Fleet Live Tracking
              </h3>
              <button 
                onClick={() => setIsMapOpen(true)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 active:scale-95"
              >
                Open Fleet Map <ExternalLink size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {fleetStatus.map((truck) => (
                <div key={truck.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm group-hover:text-amber-500 transition-colors">
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
                      <div className={`h-full rounded-full transition-all duration-1000 ${truck.status === 'Delivering' ? 'bg-blue-500' : 'bg-slate-900'}`} style={{ width: truck.load }} />
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
              <button 
                onClick={handleDownloadStatement}
                disabled={isDownloading}
                className="w-full bg-amber-500 text-slate-900 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10 active:scale-95"
              >
                {isDownloading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Download size={18} />
                )}
                {isDownloading ? 'Generating...' : 'Download Statement'}
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

      {/* Fleet Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsMapOpen(false)} />
          <div className="relative w-full max-w-6xl h-full max-h-[85vh] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col animate-in zoom-in-95 duration-500">
            {/* Map Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-amber-500/20">
                  <Globe size={24} className="animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bebas text-white tracking-wide uppercase">Greater Accra <span className="text-amber-500">Logistics Grid</span></h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 Active Units • GPS Real-Time Sync Enabled</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsMapOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            {/* Simulated Map Canvas */}
            <div className="flex-1 relative bg-slate-950 overflow-hidden">
               {/* Map Grid Lines */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                 <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               </div>
               
               {/* Radial Scan Effect */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none">
                 <div className="w-full h-full bg-[conic-gradient(from_0deg,_transparent_0deg,_rgba(245,158,11,0.05)_30deg,_transparent_60deg)] animate-spin-radar" />
               </div>

               {/* Simulated Land/Road Contours (SVG) */}
               <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 1000 1000">
                 <path d="M100,200 L300,450 L600,400 L850,200 L950,500 L800,800 L400,900 L100,750 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 5" />
                 <path d="M0,500 Q500,400 1000,500" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
                 <path d="M500,0 Q600,500 500,1000" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
               </svg>

               {/* Map Markers */}
               <div className="absolute inset-0">
                 {/* Hub Marker */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group">
                   <div className="relative">
                     <div className="absolute inset-0 w-12 h-12 bg-amber-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                     <div className="relative bg-amber-500 text-slate-900 p-2.5 rounded-xl border border-amber-400 shadow-2xl">
                       <Factory size={20} />
                     </div>
                     <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-[9px] font-black text-white px-2 py-1 rounded-md uppercase tracking-tighter border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                       Elite Hub GT-04
                     </div>
                   </div>
                 </div>

                 {/* Site Markers */}
                 <div className="absolute top-[45%] left-[35%] group">
                    <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center animate-ping" />
                    <div className="absolute inset-0 bg-blue-500 w-2 h-2 rounded-full m-1 shadow-[0_0_10px_#3B82F6]" />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-500 text-[8px] font-black text-white px-2 py-0.5 rounded-md uppercase tracking-tighter opacity-100">
                      Legon Site
                    </div>
                 </div>

                 <div className="absolute top-[30%] left-[80%] group">
                    <div className="w-4 h-4 bg-purple-500/20 rounded-full flex items-center justify-center animate-ping" />
                    <div className="absolute inset-0 bg-purple-500 w-2 h-2 rounded-full m-1 shadow-[0_0_10px_#A855F7]" />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-purple-500 text-[8px] font-black text-white px-2 py-0.5 rounded-md uppercase tracking-tighter opacity-100">
                      Tema Port
                    </div>
                 </div>

                 {/* Fleet Markers */}
                 {fleetStatus.map((truck) => (
                   <div 
                    key={truck.id} 
                    className="absolute transition-all duration-[3000ms] ease-in-out group"
                    style={{ left: `${truck.x}%`, top: `${truck.y}%` }}
                   >
                     <div className={`relative p-2 rounded-lg border shadow-2xl backdrop-blur-md cursor-pointer group-hover:scale-110 transition-transform ${
                       truck.status === 'Delivering' ? 'bg-blue-500/20 border-blue-400/50' : truck.status === 'Loading' ? 'bg-amber-500/20 border-amber-400/50' : 'bg-slate-700/50 border-white/10'
                     }`}>
                       <Navigation 
                        size={16} 
                        className={`transition-colors ${truck.status === 'Delivering' ? 'text-blue-400' : 'text-amber-500'} ${truck.status === 'Delivering' ? 'animate-pulse' : ''}`}
                        style={{ transform: `rotate(${truck.id === 'T-01' ? '45deg' : truck.id === 'T-02' ? '220deg' : '0deg'})` }} 
                       />
                       
                       {/* Expanded info on hover */}
                       <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none z-30">
                         <div className="bg-slate-900 border border-white/10 p-3 rounded-2xl shadow-2xl w-40">
                           <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-black text-white">{truck.id}</span>
                             <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                               truck.status === 'Delivering' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-slate-900'
                             }`}>{truck.status}</span>
                           </div>
                           <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Driver: {truck.driver}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase">Load: {truck.load}</p>
                           <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: truck.load }} />
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Map Key Overlay */}
               <div className="absolute bottom-8 left-8 space-y-3 bg-slate-900/40 backdrop-blur-md border border-white/5 p-5 rounded-[2rem] z-20">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Crosshair size={14} className="text-amber-500" /> Grid Legends
                 </h4>
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Your Production Hub</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">In-Transit / Site Delivery</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Certified Order Sites</span>
                 </div>
               </div>

               {/* Map Tech HUD Overlay */}
               <div className="absolute top-8 right-8 space-y-4 text-right z-20">
                  <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Grid Resolution</p>
                     <p className="text-xl font-bebas text-white tracking-widest">4K HIGH-PRECISION</p>
                  </div>
                  <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Ping</p>
                     <p className="text-sm font-bold text-green-500 uppercase">12ms (Stable)</p>
                  </div>
               </div>
            </div>

            {/* Map Footer Toolbar */}
            <div className="p-8 border-t border-white/5 bg-slate-900/80 backdrop-blur-xl z-20 flex flex-wrap gap-4 items-center justify-between">
               <div className="flex gap-4">
                 <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Toggle Satellite</button>
                 <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Traffic Overlay</button>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Operational Zone</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Accra East / Tema West</p>
                  </div>
                  <button className="bg-amber-500 text-slate-900 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/10 hover:bg-amber-400 transition-all active:scale-95">Initiate Grid Sweep</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-radar {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-radar {
          animation: spin-radar 10s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PartnerDashboard;
