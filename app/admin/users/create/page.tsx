'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import IPSelector from '@/components/admin/IPSelector';
import {
  UserPlus,
  ShieldCheck,
  ArrowLeft,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Users,
  FileText,
  Mail,
  Heart,
  TrendingUp,
  UserCheck,
  CreditCard,
  Database,
  Globe,
  Shield,
  ShieldAlert,
  BarChart3,
  Settings,
  Image,
  Lock,
  CheckCircle2,
  Zap,
  Layout,
  PlayCircle,
  Layers,
  Video,
  Bell,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PAGE_PERMISSIONS = [
  // 1. Core Overview
  { id: 'page_dashboard', label: 'Main Dashboard', icon: LayoutDashboard, group: 'Core' },
  { id: 'page_tasks', label: 'Operations Calendar', icon: Calendar, group: 'Core' },
  { id: 'page_users', label: 'Personnel Mgmt', icon: UserPlus, group: 'Core' },

  // 2. People & Operations
  { id: 'page_board', label: 'Board Applications', icon: Users, group: 'Management' },
  { id: 'page_volunteers', label: 'Volunteer Assets', icon: UserCheck, group: 'Management' },
  { id: 'page_donations', label: 'Financial Donations', icon: CreditCard, group: 'Management' },

  // 3. Website Content
  { id: 'page_blogs', label: 'Blog Publication', icon: FileText, group: 'Content' },
  { id: 'page_editorial', label: 'Editorial Hub', icon: Zap, group: 'Content' },
  { id: 'page_content', label: 'Base Page Content', icon: Database, group: 'Content' },
  { id: 'page_pageconfig', label: 'UI Configuration', icon: Layout, group: 'Content' },
  { id: 'page_seo', label: 'Technical SEO', icon: Globe, group: 'Content' },
  { id: 'page_banners', label: 'Hero Banners', icon: PlayCircle, group: 'Content' },

  // 4. Multimedia & Press
  { id: 'page_galleryhub', label: 'Asset Management', icon: Layers, group: 'Media' },
  { id: 'page_gallery', label: 'Image Archives', icon: Image, group: 'Media' },
  { id: 'page_documentaries', label: 'Video Catalog', icon: Video, group: 'Media' },
  { id: 'page_press', label: 'Press Releases', icon: ShieldCheck, group: 'Media' },

  // 5. Communications
  { id: 'page_whatsapp', label: 'WhatsApp Bridge', icon: MessageSquare, group: 'Communication' },
  { id: 'page_support', label: 'Inbound Support', icon: Bell, group: 'Communication' },
  { id: 'page_newsletter', label: 'Bulk Newsletters', icon: Mail, group: 'Communication' },

  // 6. Forms & CRM
  { id: 'page_reports', label: 'Inbound Reports', icon: BarChart3, group: 'Forms & CRM' },
  { id: 'page_feedback', label: 'User Feedback', icon: MessageSquare, group: 'Forms & CRM' },
  { id: 'page_schemes', label: 'Scheme Apps', icon: FileText, group: 'Forms & CRM' },
  { id: 'page_contacts', label: 'Contact Leades', icon: Mail, group: 'Forms & CRM' },
  { id: 'page_legacy', label: 'Legacy Requests', icon: Heart, group: 'Forms & CRM' },
  { id: 'page_expansion', label: 'Expansion Nodes', icon: TrendingUp, group: 'Forms & CRM' },

  // 7. System & Intelligence
  { id: 'page_settings', label: 'Global Settings', icon: Settings, group: 'System' },
  { id: 'page_analytics', label: 'Visual Analytics', icon: BarChart3, group: 'System' },
  { id: 'page_logs', label: 'Security Audits', icon: Lock, group: 'System' },
  { id: 'page_system', label: 'System Health', icon: Activity, group: 'System' },
  { id: 'page_email_logs', label: 'Email Traffic', icon: Mail, group: 'System' },
  { id: 'page_comm_logs', label: 'Interaction Logs', icon: MessageSquare, group: 'System' },
];

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'technical_support',
    permissions: ['page_dashboard'] as string[],
    allowedIPs: [] as string[]
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto pb-32 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-navy-50 p-8 shadow-xl">
        <div className="flex items-center gap-6">
          <Link href="/admin/users" className="p-4 bg-navy-50 text-navy-700 hover:bg-navy-950 hover:text-gold-500 rounded-2xl transition-all active:scale-90">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-navy-950 uppercase tracking-tighter italic italic">Establish New Node</h1>
            <p className="text-[10px] text-navy-700 font-bold uppercase tracking-widest mt-1">Personnel Authorization Form</p>
          </div>
        </div>
        <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center shadow-2xl">
          <UserPlus className="text-gold-500" size={32} />
        </div>
      </div>

      <form onSubmit={handleCreateUser} className="space-y-8">
        {/* Personal Intel */}
        <div className="bg-white rounded-[3rem] border border-navy-50 p-10 shadow-lg space-y-10">
          <div className="flex items-center gap-4 border-b border-navy-50 pb-6">
            <div className="w-10 h-10 bg-gold-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gold-100">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xs font-black text-navy-950 uppercase tracking-widest italic">Identity Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Identity Label</label>
              <input
                type="text" required placeholder="Node Name"
                value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Network ID (Email)</label>
              <input
                type="email" required placeholder="secure@node.org"
                value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Comm Channel (Phone)</label>
              <input
                type="tel" required placeholder="+91 XXXX XXXX"
                value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Access Key (Password)</label>
              <input
                type="password" required placeholder="••••••••"
                value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1 text-center block leading-none">Primary Authority Level</label>
            <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border-2 border-slate-100">
              {['technical_support', 'seo_team', 'media_team', 'manager'].map((role) => (
                <button
                  key={role} type="button" onClick={() => setNewUser({ ...newUser, role })}
                  className={cn(
                    "flex-1 py-4 px-6 rounded-3xl text-[9px] font-black uppercase tracking-widest transition-all",
                    newUser.role === role ? "bg-navy-950 text-gold-500 shadow-2xl scale-105" : "text-navy-700 hover:bg-white"
                  )}
                >
                  {role.split('_')[0]} Node
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Page Clearance */}
        <div className="bg-white rounded-[3rem] border border-navy-50 p-10 shadow-lg space-y-10">
          <div className="flex items-center justify-between border-b border-navy-50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-navy-950 rounded-xl flex items-center justify-center text-gold-500 shadow-xl">
                <Lock size={20} />
              </div>
              <h3 className="text-xs font-black text-navy-950 uppercase tracking-widest italic">Granular Page Clearance</h3>
            </div>
            <p className="text-[9px] text-navy-700 font-bold uppercase tracking-widest">Toggle Sector Access</p>
          </div>

          {['Core', 'Management', 'Content', 'Media', 'Communication', 'Forms & CRM', 'System'].map(group => (
            <div key={group} className="space-y-6">
              <h5 className="text-[8px] font-black text-navy-300 uppercase tracking-[0.4em] ml-2 leading-none border-l-2 border-gold-600 pl-4">{group} Operations</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {PAGE_PERMISSIONS.filter(p => p.group === group).map((perm) => {
                  const isChecked = newUser.permissions.includes(perm.id);
                  return (
                    <label
                      key={perm.id}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group hover:-translate-y-2",
                        isChecked ? "bg-gold-50/50 border-gold-400 shadow-2xl shadow-gold-100" : "bg-white border-navy-50 hover:border-navy-200"
                      )}
                    >
                      <input
                        type="checkbox" className="hidden" checked={isChecked}
                        onChange={(e) => {
                          const list = [...newUser.permissions];
                          const newList = e.target.checked ? [...list, perm.id] : list.filter(p => p !== perm.id);
                          setNewUser({ ...newUser, permissions: newList });
                        }}
                      />
                      <div className={cn(
                        "w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all duration-500 shadow-lg",
                        isChecked ? "bg-gold-500 text-navy-950 scale-110 rotate-12 shadow-gold-200" : "bg-navy-50 text-navy-700 group-hover:bg-navy-950 group-hover:text-gold-500"
                      )}>
                        <perm.icon size={22} />
                      </div>
                      <span className={cn("text-[9px] font-black uppercase tracking-tight text-center", isChecked ? "text-gold-700" : "text-navy-700")}>{perm.label}</span>
                      {isChecked && (
                        <div className="absolute top-4 right-4 translate-x-1 -translate-y-1">
                          <CheckCircle2 size={18} className="text-gold-600 fill-white" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* IP Node Constraint */}
        <div className="bg-navy-950 rounded-[3rem] p-10 border border-white/10 shadow-3xl text-white space-y-8">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="w-10 h-10 bg-gold-600 rounded-xl flex items-center justify-center text-white shadow-xl">
              <Globe size={20} />
            </div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest italic">IP Node Constraints</h3>
          </div>
          <IPSelector
            selectedIPs={newUser.allowedIPs}
            onIPsChange={(ips) => setNewUser({ ...newUser, allowedIPs: ips })}
          />
        </div>

        {/* Action Deck */}
        <div className="flex items-center gap-6 pt-10">
          <Link href="/admin/users" className="flex-1 py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-navy-700 bg-white border border-navy-50 text-center hover:bg-slate-50 transition-all active:scale-95 shadow-lg">
            Terminate Setup
          </Link>
          <button
            type="submit" disabled={loading}
            className="flex-[2] py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-white bg-navy-950 hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl active:scale-95 shadow-navy-200"
          >
            {loading ? 'Initializing...' : 'Authorize Access Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
