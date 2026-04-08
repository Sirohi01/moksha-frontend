'use client';

import "../../styles/admin.css";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI, removeToken } from '@/lib/api';
import { checkUserPermission } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import MobileMenu from '@/components/admin/MobileMenu';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu, ShieldAlert, Lock, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { NotificationProvider } from '@/context/NotificationContext';
import AdminNotificationHub from '@/components/admin/AdminNotificationHub';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && !pathname.includes('/auth/')) {
      router.push('/admin/auth/login');
      return;
    }
    if (token) fetchUserProfile();
    else setLoading(false);
  }, [pathname, router]);

  const fetchUserProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.data.admin);
    } catch (error) {
      removeToken();
      router.push('/admin/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      router.push('/admin/auth/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-gold-600/20 border-t-gold-600 rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(184,135,33,0.3)]"></div>
        <p className="text-gold-500 font-black uppercase text-xs tracking-widest animate-pulse italic">Moksha Admin Panel Loading...</p>
      </div>
    );
  }

  if (pathname.includes('/auth/')) return <>{children}</>;
  if (!user) return null;

  const hasAccess = checkUserPermission(user, pathname);

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-[#fcfcfc] flex font-sans selection:bg-gold-600 selection:text-navy-950 overflow-x-hidden">
        
        <AdminSidebar 
            user={user} 
            onLogout={handleLogout} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
        />

        <div className="hidden xl:block w-[320px] shrink-0 h-screen" aria-hidden="true" />
        <div className="hidden lg:block xl:hidden w-[288px] shrink-0 h-screen" aria-hidden="true" />

        <div className="flex-1 h-screen flex flex-col min-w-0 bg-[#FCFAF7] overflow-x-hidden relative">
          
          <header className="flex-shrink-0 bg-white/40 backdrop-blur-2xl border-b border-stone-200/40 px-4 sm:px-8 py-5 h-20 flex items-center justify-between relative z-30">
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => setSidebarOpen(prev => !prev)} className="lg:hidden p-2.5 text-stone-950 bg-stone-100 rounded-xl hover:bg-stone-200 transition-all active:scale-90 shadow-sm border border-stone-200/50">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hidden xs:block">Moksha System</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg sm:text-xl font-black text-stone-950 uppercase tracking-tighter truncate max-w-[120px] sm:max-w-none leading-none">
                    {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.6)] animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
              <div className="hidden lg:flex items-center gap-6 pr-8 border-r border-stone-200/60">
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-stone-400 tracking-wider leading-none">Network</p>
                  <p className="text-[11px] font-black uppercase text-emerald-600 mt-1.5 flex items-center gap-1.5 justify-end">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                    Optimal
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-stone-400 tracking-wider leading-none">Access Level</p>
                  <p className="text-[11px] font-black uppercase text-stone-950 mt-1.5">Full Clearance</p>
                </div>
              </div>

              {/* Notification Hub */}
              <AdminNotificationHub />

              <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-all duration-500 bg-white shadow-sm border border-stone-200/60 p-1.5 rounded-2xl hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5 active:scale-95">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-stone-900 flex items-center justify-center shadow-lg border border-white/10 text-gold-400 relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-black/20"></div>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 z-20">
                    <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                </div>

                <div className="hidden xs:block pl-2">
                  <p className="text-[11px] font-black text-stone-950 uppercase tracking-tight group-hover:text-gold-600 transition-colors">{user.name}</p>
                  <p className="text-[9px] font-black text-gold-600 uppercase tracking-tighter mt-0.5 opacity-80">{user.role}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar relative">
            {hasAccess ? (
              <div className="max-w-screen-2xl mx-auto w-full animate-fadeIn pb-24">
                {children}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center animate-fadeIn">
                <div className="relative group mb-8">
                  <div className="absolute -inset-10 bg-rose-600/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-rose-50 transform group-hover:scale-110 transition-transform duration-700">
                    <ShieldAlert className="w-16 h-16 text-rose-500" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-slate-50">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                </div>

                <div className="text-center space-y-4 max-w-sm px-6">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">ACCESS RESTRICTED</h2>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                    "Your current node identifier does not have clearance for this administrative sector."
                  </p>
                  <div className="pt-6">
                    <Link
                      href="/admin/dashboard"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gold-600 hover:text-navy-950 transition-all shadow-2xl"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Return to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </NotificationProvider>
  );
}