
import React, { useState } from 'react';
import { Settings, ShieldCheck, Factory, MapPin, Phone, Save, Loader2, Bell, Lock, Truck, Zap, Activity } from 'lucide-react';

interface PartnerSettingsProps {
  addNotification: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

const PartnerSettings: React.FC<PartnerSettingsProps> = ({ addNotification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [factoryName, setFactoryName] = useState('Elite Concrete Partners');
  const [location, setLocation] = useState('Tema Community 25, Gt. Accra');
  const [phone, setPhone] = useState('+233 24 555 0101');
  const [productionStatus, setProductionStatus] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    addNotification('success', 'Settings Updated', 'Your factory profile and operational status have been saved.');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="text-amber-500" size={18} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portal Configuration</span>
        </div>
        <h1 className="text-5xl font-bebas tracking-wide">FACTORY <span className="text-amber-500">SETTINGS</span></h1>
        <p className="text-slate-500 text-sm mt-1">Manage your identity and operational capacity on the Modegah Network.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Factory Identity Section */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-3">
              <Factory className="text-amber-500" size={20} /> Factory Identity
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={factoryName}
                    onChange={(e) => setFactoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
                  />
                  <Factory className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
                  />
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Official Contact</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Status Section */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-3">
              <Activity className="text-amber-500" size={20} /> Operational Controls
            </h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Production Capacity</p>
                <p className="text-xs text-slate-500">Enable/disable new order assignments from the central network.</p>
              </div>
              <button 
                type="button"
                onClick={() => setProductionStatus(!productionStatus)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${productionStatus ? 'bg-amber-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${productionStatus ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Auto-Accept Orders</p>
                <p className="text-xs text-slate-500">Automatically accept orders within 10km radius of your location.</p>
              </div>
              <button 
                type="button"
                onClick={() => setAutoAccept(!autoAccept)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${autoAccept ? 'bg-amber-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoAccept ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Fleet & Logistics Section */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-3">
              <Truck className="text-amber-500" size={20} /> Fleet Configuration
            </h3>
          </div>
          <div className="p-8">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
              <Zap className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">Logistics Tier: Premium</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your enterprise subscription includes real-time GPS tracking for up to 5 fleet vehicles. New vehicles must be inspected at the Shai Hills depot.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            SAVE CONFIGURATION
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerSettings;
