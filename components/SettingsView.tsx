
import React, { useState, useRef } from 'react';
import { User as UserIcon, Bell, Globe, Shield, Save, Mail, CreditCard, Trash2, CheckCircle2, Camera, Loader2 } from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onTerminateAccount: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser, onTerminateAccount }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [preferences, setPreferences] = useState({
    currency: '$',
    lowStockAlerts: true,
    emailReports: false,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    // Simulate API delay
    setTimeout(() => {
      onUpdateUser({ ...user, name: formData.name, email: formData.email });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateUser({ ...user, avatar: base64String });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const SectionHeader = ({ icon: Icon, title, sub }: any) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 leading-none">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your enterprise profile and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation / Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100">
                  {isUploading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <img 
                      src={user.avatar || `https://picsum.photos/seed/${user.id}/150/150`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-90 hover:scale-110"
                  title="Change Profile Picture"
                >
                  <Camera size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
              <h4 className="font-bold text-slate-800">{user.name}</h4>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
              <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Professional Plan
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
             <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2">Plan Details</h5>
             <p className="text-xs text-blue-600 leading-relaxed font-medium">Your enterprise account is currently in good standing. Your next billing date is Oct 12, 2024.</p>
          </div>
        </div>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <SectionHeader icon={UserIcon} title="Profile Details" sub="Identity & Access" />
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    disabled={saveStatus !== 'idle'}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                      saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    {saveStatus === 'saving' ? 'Updating...' : saveStatus === 'saved' ? <><CheckCircle2 size={14} /> Updated</> : <><Save size={14} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <SectionHeader icon={Globe} title="Regional & Alerts" sub="System Behavior" />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Primary Currency</p>
                    <p className="text-xs text-slate-400">Default symbol for financial reports</p>
                  </div>
                  <select 
                    value={preferences.currency} 
                    onChange={e => setPreferences({...preferences, currency: e.target.value})}
                    className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs font-bold outline-none"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="¥">JPY (¥)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Low Stock Notifications</p>
                    <p className="text-xs text-slate-400">Alert me when items hit reorder points</p>
                  </div>
                  <button 
                    onClick={() => setPreferences({...preferences, lowStockAlerts: !preferences.lowStockAlerts})}
                    className={`w-10 h-6 rounded-full transition-colors relative ${preferences.lowStockAlerts ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.lowStockAlerts ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#FFF5F5] rounded-[32px] border border-[#FFE4E4] p-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white border border-[#FFE4E4] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Trash2 size={24} className="text-[#E11D48]" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-black text-[#991B1B] tracking-tight">
                  <span className="text-[#E11D48]">DANGER ZONE</span>
                </h4>
                <p className="text-sm text-[#991B1B] mt-2 opacity-80 leading-snug">
                  Permanently delete your account and all inventory data. This action is irreversible.
                </p>
                <button 
                  onClick={() => {
                    if(confirm("DANGER: This will permanently delete all your data and account. This cannot be undone. Continue?")) {
                       onTerminateAccount();
                    }
                  }}
                  className="mt-6 px-6 py-3 bg-[#E11D48] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#BE123C] transition-all active:scale-95 shadow-lg shadow-red-100"
                >
                  TERMINATE ENTERPRISE ACCOUNT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
