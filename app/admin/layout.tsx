'use client';

import "../../styles/admin.css";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI, removeToken } from '@/lib/api';
import { checkUserPermission } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import MobileMenu from '@/components/admin/MobileMenu';
import GlobalNotification from '@/components/admin/GlobalNotification';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu, ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

  // Check if user has permission to view current page
  const hasAccess = checkUserPermission(user, pathname);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans selection:bg-gold-600 selection:text-navy-950 overflow-x-hidden">

      {/* Desktop Persistent Sidebar */}
      <AdminSidebar user={user} onLogout={handleLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="hidden lg:block w-72 shrink-0 h-screen" aria-hidden="true" />

      {/* Main Administrative Deck */}
      <div className="flex-1 h-screen flex flex-col min-w-0 bg-[#fcfcfc] overflow-x-hidden">

        {/* Sleek Top Deck (Navbar) */}
        <header className="flex-shrink-0 bg-white/70 backdrop-blur-xl border-b border-navy-50 px-4 sm:px-8 py-5 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setSidebarOpen(prev => !prev)} className="lg:hidden p-2.5 text-navy-950 bg-navy-50 rounded-xl hover:bg-navy-100 transition-all active:scale-90">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xs font-black uppercase tracking-widest text-navy-700 italic hidden xs:block">Moksha Admin Platform</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-navy-950 uppercase italic tracking-tighter truncate max-w-[120px] sm:max-w-none py-1 px-2 mb-2 inline-block leading-none">
                  {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-gold-600 shadow-[0_0_8px_rgba(184,135,33,0.5)]"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden lg:flex items-center gap-6 pr-8 border-r border-navy-50">
              <div className="text-right">
                <p className="text-[11px] font-black uppercase text-gray-400 leading-none">Status</p>
                <p className="text-[13px] font-black uppercase text-emerald-500 mt-1">Ready</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black uppercase text-gray-400 leading-none">Session</p>
                <p className="text-[13px] font-black uppercase text-navy-950 mt-1">Active</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-all duration-300 bg-white sm:bg-navy-50/30 p-1.5 sm:p-2 pr-3 sm:pr-6 rounded-[1.5rem] border border-transparent hover:border-gold-500/20 hover:bg-white hover:shadow-[0_20px_40px_rgba(184,135,33,0.05)] active:scale-95">
              <div className="relative group-hover:scale-105 transition-all duration-500">
                <div className="w-11 h-11 rounded-2xl bg-navy-950 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/10 text-gold-500 relative z-10 overflow-hidden group/avatar">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-600/10 via-transparent to-navy-900/50 opacity-50"></div>
                  <svg className="w-7 h-7 relative z-20 drop-shadow-lg transform group-hover/avatar:rotate-[360deg] transition-transform duration-1000 ease-in-out" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" className="stroke-gold-600/30" strokeWidth="1" />
                    <circle cx="12" cy="11" r="3" className="fill-gold-500 animate-pulse" />
                    <path d="M7 18C7 16.3431 8.34315 15 10 15H14C15.6569 15 17 16.3431 17 18" className="stroke-gold-500" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 z-20 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white relative z-10 shadow-sm shadow-emerald-500/50"></div>
                </div>
              </div>

              <div className="hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-navy-950 uppercase tracking-tight group-hover:text-gold-600 transition-colors">{user.name}</p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-black text-gold-600 uppercase tracking-tighter italic opacity-80">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tactical View (Page Content) */}
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

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
}