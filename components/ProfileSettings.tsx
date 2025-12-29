
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Bell, Save, Shield, CheckCircle2, Building2 } from 'lucide-react';
import { UserProfile, NotificationSettings } from '../types';

interface ProfileSettingsProps {
  profile: UserProfile;
  settings: NotificationSettings;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateSettings: (settings: NotificationSettings) => void;
  addNotification: (type: 'success' | 'info', title: string, message: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, settings, onUpdateProfile, onUpdateSettings, addNotification }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile(localProfile);
      setIsSaving(false);
      addNotification('success', 'Profile Updated', 'Your personal and logistics information has been saved.');
    }, 800);
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
    addNotification('info', 'Preference Updated', `Notification for ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated.`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in slide-in-from-bottom-5 duration-700">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <User className="text-amber-500" size={18} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personal Command Center</span>
        </div>
        <h1 className="text-5xl font-bebas tracking-wide">ACCOUNT <span className="text-amber-500">PROFILE</span></h1>
        <p className="text-slate-500 text-sm mt-1">Manage your identity, site address, and communication preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-3 uppercase text-xs tracking-widest">
                <Shield className="text-amber-500" size={18} /> Logistics Identity
              </h3>
            </div>
            <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={localProfile.fullName}
                      onChange={(e) => setLocalProfile({ ...localProfile, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
                    />
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">MoMo / Phone Number</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={localProfile.phone}
                      onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
                    />
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Official Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={localProfile.email}
                    onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Primary Site Address (GT. Accra)</label>
                <div className="relative">
                  <textarea 
                    value={localProfile.deliveryAddress}
                    onChange={(e) => setLocalProfile({ ...localProfile, deliveryAddress: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-800 resize-none"
                    placeholder="e.g. Plot 44, Spintex Road, near Coca-Cola"
                  />
                  <MapPin className="absolute right-4 top-6 text-slate-300" size={18} />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] uppercase text-xs tracking-widest"
              >
                {isSaving ? 'Updating Network...' : 'Commit Changes'}
                {!isSaving && <Save size={18} />}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-3 uppercase text-xs tracking-widest mb-8">
              <Bell className="text-amber-500" size={18} /> Notifications
            </h3>
            <div className="space-y-6">
              {[
                { key: 'orderUpdates', label: 'Order Status Log', desc: 'Real-time GPS and production logs' },
                { key: 'promotions', label: 'Bulk Buy Offers', desc: 'Flash sales and volume discounts' },
                { key: 'securityAlerts', label: 'Identity Alerts', desc: 'Secure session and billing alerts' },
                { key: 'newsletter', label: 'Building Guide', desc: 'Monthly Accra construction trends' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between group">
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleSetting(item.key as keyof NotificationSettings)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${localSettings[item.key as keyof NotificationSettings] ? 'bg-amber-500' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${localSettings[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="bg-amber-500 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl font-bebas tracking-wide mb-2 uppercase">Verified Site</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest mb-6">Your logistics profile is synchronized with Modegah Central Hub.</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase">
                <Building2 size={12} /> Priority Site Status Enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
