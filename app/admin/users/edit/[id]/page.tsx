'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Edit3,
  Power,
  Zap,
  Layout,
  PlayCircle,
  Layers,
  Bell,
  Activity,
  Video
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { adminAPI } from '@/lib/api';

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

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'technical_support',
    permissions: [] as string[],
    allowedIPs: [] as string[],
    isActive: true
  });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getUser(id as string);
      const user = data.data;
      setEditUser({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions || [],
        allowedIPs: user.allowedIPs || [],
        isActive: user.isActive
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-gold-600/20 border-t-gold-600 rounded-full animate-spin mb-4 shadow-xl shadow-gold-100"></div>
        <p className="text-navy-700 font-bold uppercase text-[10px] tracking-widest italic animate-pulse text-center">Decrypting Node Information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto pb-32 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-navy-50 p-8 shadow-xl">
        <div className="flex items-center gap-6">
          <Link href="/admin/users" className="p-4 bg-navy-50 text-navy-700 hover:bg-navy-950 hover:text-gold-500 rounded-2xl transition-all active:scale-90">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-navy-950 uppercase tracking-tighter italic italic">Modify Access Profile</h1>
            <p className="text-[10px] text-navy-700 font-bold uppercase tracking-widest mt-1">Personnel Reconfiguration Terminal</p>
          </div>
        </div>
        <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center shadow-2xl">
          <Edit3 className="text-gold-500" size={32} />
        </div>
      </div>

      <form onSubmit={handleUpdateUser} className="space-y-8">
        {/* Personal Intel */}
        <div className="bg-white rounded-[3rem] border border-navy-50 p-10 shadow-lg space-y-10">
          <div className="flex items-center justify-between border-b border-navy-50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gold-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gold-100">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xs font-black text-navy-950 uppercase tracking-widest italic">Identity Configuration</h3>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[8px] text-navy-700 font-bold uppercase tracking-widest">Sector Access Control</p>
              <button
                type="button"
                onClick={() => setEditUser({ ...editUser, isActive: !editUser.isActive })}
                className={cn(
                  "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all",
                  editUser.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                )}
              >
                <Power size={12} />
                {editUser.isActive ? 'Access: Granted' : 'Access: Revoked'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Identity Label</label>
              <input
                type="text" required placeholder="Node Name"
                value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Network ID (Email)</label>
              <input
                type="email" required placeholder="secure@node.org"
                value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Comm Channel (Phone)</label>
              <input
                type="tel" required placeholder="+91 XXXX XXXX"
                value={editUser.phone} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-700 uppercase tracking-widest ml-1">Administrative Role</label>
              <div className="relative">
                <select
                  value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="w-full h-16 px-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold text-navy-900 focus:border-gold-600 outline-none transition-all shadow-inner appearance-none"
                >
                  <option value="technical_support">Technical Support</option>
                  <option value="seo_team">SEO Team</option>
                  <option value="media_team">Media Team</option>
                  <option value="manager">Manager</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-navy-700">
                  <ChevronRight className="rotate-90 w-5 h-5" />
                </div>
              </div>
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
                  const isChecked = editUser.permissions.includes(perm.id);
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
                          const list = [...editUser.permissions];
                          const newList = e.target.checked ? [...list, perm.id] : list.filter(p => p !== perm.id);
                          setEditUser({ ...editUser, permissions: newList });
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
            selectedIPs={editUser.allowedIPs}
            onIPsChange={(ips) => setEditUser({ ...editUser, allowedIPs: ips })}
          />
        </div>

        {/* Action Deck */}
        <div className="flex items-center gap-6 pt-10">
          <Link href="/admin/users" className="flex-1 py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-navy-700 bg-white border border-navy-50 text-center hover:bg-slate-50 transition-all active:scale-95 shadow-lg">
            Discard Changes
          </Link>
          <button
            type="submit" disabled={saving}
            className="flex-[2] py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-white bg-navy-950 hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl active:scale-95 shadow-navy-200"
          >
            {saving ? 'Synchronizing...' : 'Update Clearance Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Add missing ChevronRight for select box
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
