'use client';

import "../../styles/admin.css";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI, removeToken } from '@/lib/api';
import { cn } from '@/lib/utils';
import MobileMenu from '@/components/admin/MobileMenu';
import GlobalNotification from '@/components/admin/GlobalNotification';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

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
          <p className="text-gold-500 font-black uppercase text-[10px] tracking-widest animate-pulse italic">Moksha Command Center Loading...</p>
      </div>
    );
  }

  if (pathname.includes('/auth/')) return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans selection:bg-gold-600 selection:text-navy-950 overflow-x-hidden">
      
      {/* Desktop Persistent Sidebar (Spacer pushes content) */}
      <AdminSidebar user={user} onLogout={handleLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="hidden lg:block w-72 shrink-0 h-screen" aria-hidden="true" />

      {/* Main Administrative Deck */}
      <div className="flex-1 flex flex-col transition-all duration-500 min-w-0">
        
        {/* Sleek Top Deck (Navbar) */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-navy-50 px-4 sm:px-8 py-5 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
                <button onClick={() => setSidebarOpen(prev => !prev)} className="lg:hidden p-2.5 text-navy-950 bg-navy-50 rounded-xl hover:bg-navy-100 transition-all active:scale-90">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-[10px] font-black uppercase tracking-widest text-navy-400 italic hidden xs:block">Moksha Admin Platform</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-lg sm:text-xl font-black text-navy-950 uppercase italic tracking-tighter truncate max-w-[120px] sm:max-w-none">
                            {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-600 shadow-[0_0_8px_rgba(184,135,33,0.5)]"></div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
                {/* System Stats (Minimalist) */}
                <div className="hidden lg:flex items-center gap-6 pr-8 border-r border-navy-50">
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-gray-400 leading-none">Status</p>
                        <p className="text-[11px] font-black uppercase text-emerald-500 mt-1">Ready</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-gray-400 leading-none">Session</p>
                        <p className="text-[11px] font-black uppercase text-navy-950 mt-1">Active</p>
                    </div>
                </div>

                {/* Secure Profile Trigger */}
                <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer transition-all duration-300 bg-white sm:bg-navy-50/30 p-1.5 sm:p-2 pr-3 sm:pr-6 rounded-[1.5rem] border border-transparent hover:border-gold-500/20 hover:bg-white hover:shadow-[0_20px_40px_rgba(184,135,33,0.05)] active:scale-95">
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-navy-950 flex items-center justify-center shadow-xl border border-white/10 text-gold-500 relative z-10 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <p className="text-gold-500 font-black text-sm sm:text-md italic tracking-tighter">{user.name[0].toUpperCase()}</p>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white z-20 shadow-sm animate-pulse"></div>
                      <div className="absolute inset-0 bg-gold-600/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-40"></div>
                    </div>
                    
                    <div className="hidden xs:block">
                        <div className="flex items-center gap-1.5">
                           <p className="text-[10px] font-black text-navy-950 uppercase tracking-tight">{user.name}</p>
                           <div className="w-1 h-1 rounded-full bg-navy-300"></div>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                           <span className="text-[8px] font-black text-gold-600 uppercase tracking-tighter italic opacity-80">Command: {user.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* Tactical View (Page Content) */}
        <main className="p-4 sm:p-8 pb-20 w-full animate-fadeIn overflow-x-hidden">
            {children}
        </main>
      </div>

      <MobileMenu 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={{ name: user.name, role: user.role }}
        onLogout={handleLogout}
        navigationItems={[
            { name: 'Dashboard', href: '/admin/dashboard', icon: '📊', gradient: 'from-blue-500 to-indigo-600' },
            { name: 'Live Support', href: '/admin/support', icon: '💬', gradient: 'from-emerald-500 to-teal-600' },
            { name: 'Tasks', href: '/admin/tasks', icon: '📅', gradient: 'from-amber-500 to-orange-600' },
            { name: 'Volunteers', href: '/admin/volunteers', icon: '🤝', gradient: 'from-purple-500 to-pink-600' },
            { name: 'Donations', href: '/admin/donations', icon: '💰', gradient: 'from-green-500 to-emerald-600' },
            { name: 'Compliance', href: '/admin/compliance', icon: '🛡️', gradient: 'from-slate-700 to-slate-900' },
            { name: 'Visitor Analytics', href: '/admin/visitor-analytics', icon: '👁️', gradient: 'from-navy-800 to-navy-950' },
            { name: 'Content Management', href: '/admin/content', icon: '📂', gradient: 'from-gold-600 to-gold-700' },
        ]}
      />

      <GlobalNotification user={user} />

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
}