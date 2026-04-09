'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Mail, 
  Zap, 
  Database, 
  CreditCard, 
  Globe, 
  Bell, 
  Save, 
  RefreshCw,
  Server,
  Lock,
  AppWindow,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

interface SystemConfig {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    ipWhitelisting: boolean;
    allowedIPs: string[];
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
    enableTestMode: boolean;
  };
  features: {
    enableDonations: boolean;
    enableVolunteers: boolean;
    enableGallery: boolean;
    enablePress: boolean;
    enableAnalytics: boolean;
  };
  institutional: {
    organizationName: string;
    address: string;
    pan: string;
    gstin: string;
    registrationNo: string;
    eightyGNo: string;
    twelveANo: string;
    fcraNo: string;
    authorizedSignatory: string;
    designation: string;
    contactPhone: string;
    contactEmail: string;
  };
}

export default function SystemConfiguration() {
  const { success: showSuccess, error: showError } = useToast();
  const [config, setConfig] = useState<SystemConfig>({
    general: { siteName: '', siteUrl: '', adminEmail: '', timezone: 'Asia/Kolkata', language: 'en', maintenanceMode: false },
    security: { sessionTimeout: 24, maxLoginAttempts: 5, passwordMinLength: 8, requireTwoFactor: false, ipWhitelisting: false, allowedIPs: [] },
    email: { smtpHost: '', smtpPort: 587, smtpUser: '', smtpPassword: '', fromEmail: '', fromName: '' },
    razorpay: { keyId: '', keySecret: '', webhookSecret: '', enableTestMode: true },
    features: { enableDonations: true, enableVolunteers: true, enableGallery: true, enablePress: true, enableAnalytics: true },
    institutional: {
        organizationName: '',
        address: '',
        pan: '',
        gstin: '',
        registrationNo: '',
        eightyGNo: '',
        twelveANo: '',
        fcraNo: '',
        authorizedSignatory: '',
        designation: '',
        contactPhone: '',
        contactEmail: '',
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data;
        
        // Merge with defaults to prevent undefined crashes
        setConfig(prev => ({
          general: { ...prev.general, ...data.general },
          security: { ...prev.security, ...data.security },
          email: { ...prev.email, ...data.email },
          razorpay: { ...prev.razorpay, ...data.razorpay },
          features: { ...prev.features, ...data.features },
          institutional: { ...prev.institutional, ...data.institutional },
        }));
      }
    } catch (error) {
      showError('Failed to load system architecture data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        showSuccess('System configuration protocols updated');
        loadConfiguration();
      } else {
        throw new Error('Update rejected by server');
      }
    } catch (error) {
      showError('System update failed');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section: keyof SystemConfig, data: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe, description: 'Core identity and location settings' },
    { id: 'email', label: 'SMTP Config', icon: Mail, description: 'Communication node and mail bridges' },
    { id: 'razorpay', label: 'Payment Gateway', icon: CreditCard, description: 'Razorpay credentials and transaction logic' },
    { id: 'security', label: 'Security Protocols', icon: Shield, description: 'Access control and session integrity' },
    { id: 'features', label: 'System Features', icon: Zap, description: 'Modular platform feature toggles' },
    { id: 'institutional', label: 'Institutional Data', icon: AppWindow, description: 'Organization legal credentials and receipt layout details' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-navy-500 italic">Syncing with Core Architecture...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-navy-50 overflow-hidden">
      
      {/* Component Sidebar */}
      <div className="w-full lg:w-72 bg-[#fcfcfc] border-r border-navy-50 p-6 flex flex-col gap-2">
        <div className="px-4 mb-6 pt-2">
          <h3 className="text-navy-950 font-black text-xs uppercase tracking-tighter italic flex items-center gap-2">
            <Server className="w-4 h-4 text-rose-500" />
            Config Matrix
          </h3>
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group text-left",
              activeTab === tab.id 
                ? "bg-navy-950 text-rose-500 shadow-xl shadow-navy-200" 
                : "text-navy-700 hover:bg-navy-50"
            )}
          >
            <tab.icon className={cn(
               "w-5 h-5 transition-all duration-500",
               activeTab === tab.id ? "scale-110" : "opacity-40 group-hover:opacity-100 group-hover:scale-110"
            )} />
            <div className="flex flex-col gap-0.5">
               <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </div>
          </button>
        ))}

        <div className="mt-auto pt-8 px-4">
           <button 
             onClick={handleSave}
             disabled={saving}
             className="w-full bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:grayscale"
           >
             {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Deploy Changes
           </button>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
         {/* Tab Header */}
         <div className="mb-10 animate-fadeIn">
            <h2 className="text-2xl font-serif font-black text-navy-950 uppercase italic tracking-tighter">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-navy-500 font-bold uppercase tracking-widest mt-1 opacity-60 italic">
               {tabs.find(t => t.id === activeTab)?.description}
            </p>
         </div>

         <div className="space-y-8 animate-slideUp">
            
            {activeTab === 'general' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ConfigInput 
                    label="Platform Name" 
                    value={config.general.siteName} 
                    onChange={(val: string) => updateSection('general', { siteName: val })} 
                  />
                  <ConfigInput 
                    label="Canonical Base URL" 
                    value={config.general.siteUrl} 
                    onChange={(val: string) => updateSection('general', { siteUrl: val })} 
                  />
                  <ConfigInput 
                    label="Administrative Contact" 
                    value={config.general.adminEmail} 
                    onChange={(val: string) => updateSection('general', { adminEmail: val })} 
                  />
                   <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-navy-500 ml-1">Synchronized Timezone</label>
                    <select 
                      value={config.general.timezone}
                      onChange={(e) => updateSection('general', { timezone: e.target.value })}
                      className="w-full bg-navy-50/50 border border-navy-100 rounded-xl px-5 py-3 text-xs font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">Universal Time (UTC)</option>
                    </select>
                  </div>
                  <ConfigToggle 
                    label="Platform Lock (Maintenance)" 
                    description="Prevent public access to the UI while active."
                    checked={config.general.maintenanceMode} 
                    onChange={(val: boolean) => updateSection('general', { maintenanceMode: val })} 
                  />
               </div>
            )}

            {activeTab === 'email' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ConfigInput 
                    label="SMTP Uplink Host" 
                    value={config.email.smtpHost} 
                    onChange={(val: string) => updateSection('email', { smtpHost: val })} 
                    placeholder="e.g. smtp.gmail.com"
                  />
                  <ConfigInput 
                    label="Communication Port" 
                    type="number"
                    value={config.email.smtpPort} 
                    onChange={(val: string) => updateSection('email', { smtpPort: parseInt(val) })} 
                  />
                  <ConfigInput 
                    label="Credential Username" 
                    value={config.email.smtpUser} 
                    onChange={(val: string) => updateSection('email', { smtpUser: val })} 
                  />
                  <ConfigInput 
                    label="System Password" 
                    type="password"
                    isSecret
                    value={config.email.smtpPassword} 
                    onChange={(val: string) => updateSection('email', { smtpPassword: val })} 
                  />
                  <ConfigInput 
                    label="Origin Address (Sender)" 
                    value={config.email.fromEmail} 
                    onChange={(val: string) => updateSection('email', { fromEmail: val })} 
                  />
                  <ConfigInput 
                    label="Display Alias" 
                    value={config.email.fromName} 
                    onChange={(val: string) => updateSection('email', { fromName: val })} 
                  />
               </div>
            )}

            {activeTab === 'razorpay' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ConfigInput 
                    label="Razorpay Public Key (Key ID)" 
                    value={config.razorpay.keyId} 
                    onChange={(val: string) => updateSection('razorpay', { keyId: val })} 
                    placeholder="rzp_test_..."
                  />
                  <ConfigInput 
                    label="Private Shield Key (Secret)" 
                    type="password"
                    isSecret
                    value={config.razorpay.keySecret} 
                    onChange={(val: string) => updateSection('razorpay', { keySecret: val })} 
                  />
                  <ConfigInput 
                    label="Incoming Webhook Secret" 
                    type="password"
                    isSecret
                    value={config.razorpay.webhookSecret} 
                    onChange={(val: string) => updateSection('razorpay', { webhookSecret: val })} 
                  />
                  <ConfigToggle 
                    label="Simulation Mode (Test)" 
                    description="Use test credentials for dry-run transactions."
                    checked={config.razorpay.enableTestMode} 
                    onChange={(val: boolean) => updateSection('razorpay', { enableTestMode: val })} 
                  />
               </div>
            )}

            {activeTab === 'security' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ConfigInput 
                    label="Auth Session TTL (Hours)" 
                    type="number"
                    value={config.security.sessionTimeout} 
                    onChange={(val: string) => updateSection('security', { sessionTimeout: parseInt(val) })} 
                  />
                  <ConfigInput 
                    label="Max Unauthorized Attempts" 
                    type="number"
                    value={config.security.maxLoginAttempts} 
                    onChange={(val: string) => updateSection('security', { maxLoginAttempts: parseInt(val) })} 
                  />
                  <ConfigToggle 
                    label="IP Validation Layer" 
                    description="Enforce IP-based bridge filtering for admin access."
                    checked={config.security.ipWhitelisting} 
                    onChange={(val: boolean) => updateSection('security', { ipWhitelisting: val })} 
                  />
               </div>
            )}

            {activeTab === 'features' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ConfigToggle 
                    label="Financial Uplink (Donations)" 
                    description="Activate payment modules across the platform."
                    checked={config.features.enableDonations} 
                    onChange={(val: boolean) => updateSection('features', { enableDonations: val })} 
                  />
                  <ConfigToggle 
                    label="Human Resource (Volunteers)" 
                    description="Allow registration and management of human assets."
                    checked={config.features.enableVolunteers} 
                    onChange={(val: boolean) => updateSection('features', { enableVolunteers: val })} 
                  />
                  <ConfigToggle 
                    label="Visual Archive (Gallery)" 
                    description="Enable image and documentary showcase modules."
                    checked={config.features.enableGallery} 
                    onChange={(val: boolean) => updateSection('features', { enableGallery: val })} 
                  />
                  <ConfigToggle 
                    label="Public Relations (Press)" 
                    description="Enable media kit and press release features."
                    checked={config.features.enablePress} 
                    onChange={(val: boolean) => updateSection('features', { enablePress: val })} 
                  />
                  <ConfigToggle 
                    label="Operational Intel (Analytics)" 
                    description="Track visitor traffic and interaction logs."
                    checked={config.features.enableAnalytics} 
                    onChange={(val: boolean) => updateSection('features', { enableAnalytics: val })} 
                  />
               </div>
            )}

            {activeTab === 'institutional' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   <div className="md:col-span-2 border-b border-navy-50 pb-2 mb-2">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Legal Credentials</h4>
                   </div>
                  <ConfigInput 
                    label="Organization Legal Name" 
                    value={config.institutional.organizationName} 
                    onChange={(val: string) => updateSection('institutional', { organizationName: val })} 
                    placeholder="e.g. Moksha Sewa Foundation"
                  />
                  <ConfigInput 
                    label="PAN Number" 
                    value={config.institutional.pan} 
                    onChange={(val: string) => updateSection('institutional', { pan: val })} 
                  />
                  <ConfigInput 
                    label="Registration Number" 
                    value={config.institutional.registrationNo} 
                    onChange={(val: string) => updateSection('institutional', { registrationNo: val })} 
                  />
                  <ConfigInput 
                    label="80G Registration" 
                    value={config.institutional.eightyGNo} 
                    onChange={(val: string) => updateSection('institutional', { eightyGNo: val })} 
                  />
                  <ConfigInput 
                    label="12A Registration" 
                    value={config.institutional.twelveANo} 
                    onChange={(val: string) => updateSection('institutional', { twelveANo: val })} 
                  />
                  <ConfigInput 
                    label="FCRA Number" 
                    value={config.institutional.fcraNo} 
                    onChange={(val: string) => updateSection('institutional', { fcraNo: val })} 
                  />
                  
                  <div className="md:col-span-2 border-b border-navy-50 pb-2 mb-2 mt-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Signatory & Contact</h4>
                  </div>
                  <ConfigInput 
                    label="Authorized Signatory" 
                    value={config.institutional.authorizedSignatory} 
                    onChange={(val: string) => updateSection('institutional', { authorizedSignatory: val })} 
                  />
                  <ConfigInput 
                    label="Designation" 
                    value={config.institutional.designation} 
                    onChange={(val: string) => updateSection('institutional', { designation: val })} 
                  />
                  <ConfigInput 
                    label="Official Address" 
                    value={config.institutional.address} 
                    onChange={(val: string) => updateSection('institutional', { address: val })} 
                  />
                  <ConfigInput 
                    label="Contact Phone" 
                    value={config.institutional.contactPhone} 
                    onChange={(val: string) => updateSection('institutional', { contactPhone: val })} 
                  />
                  <ConfigInput 
                    label="Contact Email" 
                    value={config.institutional.contactEmail} 
                    onChange={(val: string) => updateSection('institutional', { contactEmail: val })} 
                  />
               </div>
            )}

         </div>
      </div>

    </div>
  );
}

interface ConfigInputProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  isSecret?: boolean;
}

function ConfigInput({ label, value, onChange, type = 'text', placeholder = '', isSecret = false }: ConfigInputProps) {
   const [show, setShow] = useState(false);
   const inputType = isSecret ? (show ? 'text' : 'password') : type;

   return (
      <div className="space-y-2 group">
         <label className="text-[9px] font-black uppercase tracking-widest text-navy-500 ml-1 group-focus-within:text-rose-500 transition-colors">
            {label}
         </label>
         <div className="relative">
            <input 
               type={inputType}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder={placeholder}
               className="w-full bg-navy-50/30 border border-navy-100 rounded-2xl px-5 py-4 text-xs font-bold text-navy-950 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-mono"
            />
            {isSecret && (
               <button 
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-navy-400 hover:text-navy-950 transition-colors"
               >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
            )}
         </div>
      </div>
   );
}

interface ConfigToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function ConfigToggle({ label, description, checked, onChange }: ConfigToggleProps) {
   return (
      <div 
        onClick={() => onChange(!checked)}
        className={cn(
          "flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-500 cursor-pointer group",
          checked ? "bg-white border-rose-500 shadow-xl shadow-rose-900/5" : "bg-navy-50/30 border-transparent hover:border-navy-100"
        )}
      >
         <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-navy-950">{label}</h4>
            <p className="text-[10px] font-bold text-navy-500 tracking-tight italic opacity-60">{description}</p>
         </div>
         <div className={cn(
            "w-12 h-6 rounded-full relative transition-colors duration-500",
            checked ? "bg-rose-500" : "bg-navy-200"
         )}>
            <div className={cn(
               "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-sm",
               checked ? "left-7" : "left-1"
            )} />
         </div>
      </div>
   );
}