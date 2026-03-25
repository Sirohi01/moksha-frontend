'use client';

import "../../styles/admin.css";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI, removeToken } from '@/lib/api';
import MobileMenu from '@/components/admin/MobileMenu';

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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile first - closed by default
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true); // Auto-open on desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && !pathname.includes('/auth/')) {
      router.push('/admin/auth/login');
      return;
    }

    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  const fetchUserProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.data.admin);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
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

  // Navigation items based on role
  const getNavigationItems = () => {
    if (!user) return [];
    const baseItems = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: '💎', gradient: 'from-blue-600 to-indigo-700' },
      { name: 'Tasks', href: '/admin/tasks', icon: '⚡', gradient: 'from-purple-600 to-pink-600' },
      { name: 'Reports', href: '/admin/reports', icon: '📈', gradient: 'from-emerald-600 to-teal-700' },
      { name: 'Board Applications', href: '/admin/board', icon: '🏛️', gradient: 'from-navy-900 to-navy-700' },
      { name: 'Feedback', href: '/admin/feedback', icon: '💬', gradient: 'from-rose-500 to-pink-600' },
      { name: 'Government Schemes', href: '/admin/schemes', icon: '📜', gradient: 'from-amber-600 to-orange-700' },
      { name: 'Contacts', href: '/admin/contacts', icon: '📱', gradient: 'from-sky-500 to-blue-700' },
      { name: 'Legacy Giving', href: '/admin/legacy', icon: '✨', gradient: 'from-gold-600 to-amber-700' },
      { name: 'Expansion Requests', href: '/admin/expansion', icon: '🗺️', gradient: 'from-green-600 to-emerald-700' },
      { name: 'Volunteers', href: '/admin/volunteers', icon: '🤝', gradient: 'from-orange-600 to-red-700' },
      { name: 'Donations', href: '/admin/donations', icon: '💳', gradient: 'from-yellow-500 to-orange-600' },
      { name: 'Newsletter', href: '/admin/newsletter', icon: '📬', gradient: 'from-cyan-500 to-blue-700' },
      { name: 'Blog', href: '/admin/content-editor?page=blog', icon: '🖋️', gradient: 'from-indigo-500 to-purple-700' },
      { name: 'Compliance', href: '/admin/compliance', icon: '🛡️', gradient: 'from-slate-600 to-gray-800' }
    ];

    // SEO Team - Content Management
    if (user.role === 'seo_team' || user.role === 'manager' || user.role === 'super_admin') {
      baseItems.push(
        { name: 'Content Management', href: '/admin/content', icon: '📝', gradient: 'from-blue-500 to-blue-600' },
        { name: 'Page Configuration', href: '/admin/page-config', icon: '⚙️', gradient: 'from-purple-500 to-purple-600' }
      );
    }

    // Media Team - Media Management (COMMENTED OUT - Uncomment as needed)
    // if (user.role === 'media_team' || user.role === 'manager' || user.role === 'super_admin') {
    //   baseItems.push(
    //     { name: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
    //     { name: 'Press Room', href: '/admin/press', icon: '📰' },
    //     { name: 'Documentaries', href: '/admin/documentaries', icon: '🎬' }
    //   );
    // }

    // Manager & Super Admin - User Management
    if (user.role === 'manager' || user.role === 'super_admin' || user.role === 'admin') {
      baseItems.push(
        { name: 'Visitor Tracking', href: '/admin/visitor-analytics', icon: '🕵️', gradient: 'from-navy-950 to-navy-800' }
      );
    }

    // Super Admin - System Management (COMMENTED OUT - Uncomment as needed)
    // if (user.role === 'super_admin') {
    //   baseItems.push(
    //     { name: 'System Settings', href: '/admin/settings', icon: '⚙️' }
    //   );
    // }

    return baseItems;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-400 animate-spin animate-reverse mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 text-lg font-medium">Loading Moksha Sewa Admin</p>
            <p className="text-gray-500 text-sm">Preparing your peaceful workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  // Auth pages don't need layout
  if (pathname.includes('/auth/')) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Mobile Menu */}
      <MobileMenu
        navigationItems={navigationItems}
        isOpen={isMobile && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 hidden lg:block">

        {/* Logo Section */}
        <div className="relative h-20 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-red-400/20 animate-pulse-slow"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/95 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg p-2">
              <Image
                src="/logo.png"
                alt="Moksha Sewa Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold tracking-wide">Moksha Sewa</h1>
              <p className="text-xs text-white/90 font-medium">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar h-[calc(100vh-280px)]">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                  <span className="text-sm">{item.icon}</span>
                </div>
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-3 transition-all duration-200">
              <span className="text-sm">🚪</span>
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {navigationItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">Moksha Sewa Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">System Online</span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs sm:text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}