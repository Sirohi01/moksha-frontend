'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authAPI, removeToken } from '@/lib/api';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
      { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
      { name: 'Reports', href: '/admin/reports', icon: '📋' },
      { name: 'Board Applications', href: '/admin/board', icon: '👔' },
      { name: 'Feedback', href: '/admin/feedback', icon: '💬' },
      { name: 'Government Schemes', href: '/admin/schemes', icon: '🏛️' },
      { name: 'Contacts', href: '/admin/contacts', icon: '📞' },
      { name: 'Legacy Giving', href: '/admin/legacy', icon: '🌟' },
      { name: 'Expansion Requests', href: '/admin/expansion', icon: '🌍' },
      { name: 'Volunteers', href: '/admin/volunteers', icon: '🤝' },
      { name: 'Donations', href: '/admin/donations', icon: '💰' }
    ];

    // SEO Team - Content Management (COMMENTED OUT - Uncomment as needed)
    // if (user.role === 'seo_team' || user.role === 'manager' || user.role === 'super_admin') {
    //   baseItems.push(
    //     { name: 'Content Management', href: '/admin/content', icon: '📝' },
    //     { name: 'SEO Tools', href: '/admin/seo', icon: '🔍' }
    //   );
    // }

    // Media Team - Media Management (COMMENTED OUT - Uncomment as needed)
    // if (user.role === 'media_team' || user.role === 'manager' || user.role === 'super_admin') {
    //   baseItems.push(
    //     { name: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
    //     { name: 'Press Room', href: '/admin/press', icon: '📰' },
    //     { name: 'Documentaries', href: '/admin/documentaries', icon: '🎬' }
    //   );
    // }

    // Manager & Super Admin - User Management (COMMENTED OUT - Uncomment as needed)
    // if (user.role === 'manager' || user.role === 'super_admin') {
    //   baseItems.push(
    //     { name: 'User Management', href: '/admin/users', icon: '👥' },
    //     { name: 'Activity Logs', href: '/admin/activities', icon: '📈' },
    //     { name: 'Analytics', href: '/admin/analytics', icon: '📊' }
    //   );
    // }

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-yellow-400 to-teal-500">
          <span className="text-white text-xl font-bold">🙏 Moksha Seva</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                pathname === item.href ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <span className="text-xl">☰</span>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">
                Admin Panel
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <span className="text-lg">🚪</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}