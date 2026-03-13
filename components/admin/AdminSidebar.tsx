'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image,
  MessageSquare,
  Settings,
  BarChart3,
  Calendar,
  Heart,
  UserCheck,
  Mail,
  Database,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Content Management',
    items: [
      {
        title: 'Pages',
        href: '/admin/pages',
        icon: FileText,
      },
      {
        title: 'Gallery',
        href: '/admin/gallery',
        icon: Image,
      },
      {
        title: 'Campaigns',
        href: '/admin/campaigns',
        icon: Heart,
      },
      {
        title: 'Stories',
        href: '/admin/stories',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'User Management',
    items: [
      {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: 'Volunteers',
        href: '/admin/volunteers',
        icon: UserCheck,
      },
      {
        title: 'Board Members',
        href: '/admin/board',
        icon: Shield,
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Donations',
        href: '/admin/donations',
        icon: Heart,
      },
      {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
      },
      {
        title: 'Messages',
        href: '/admin/messages',
        icon: Mail,
      },
      {
        title: 'Database',
        href: '/admin/database',
        icon: Database,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
      },
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
      {
        title: 'Help',
        href: '/admin/help',
        icon: HelpCircle,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <div key={index}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            ) : (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {item.title}
                </div>
                {item.items?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 ml-4 rounded-lg text-sm font-medium transition-colors',
                      pathname === subItem.href
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                  >
                    <subItem.icon className="w-4 h-4" />
                    {subItem.title}
                  </Link>
                ))}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}