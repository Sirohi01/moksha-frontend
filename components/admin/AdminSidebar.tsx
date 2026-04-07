'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { checkUserPermission } from '@/lib/permissions';
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
  X,
  TrendingUp,
  CreditCard,
  UserPlus,
  PlayCircle,
  Video,
  Globe,
  Star,
  Zap,
  Layout,
  Layers,
  Film,
  ShieldCheck,
  Activity,
  Terminal
} from 'lucide-react';

interface NavigationItem {
  title: string;
  href?: string;
  icon?: any;
  items?: {
    title: string;
    href: string;
    icon: any;
  }[];
}

const getNavigationItems = (user: AdminUser): NavigationItem[] => {
  const filtered = (items: any[]) => items.filter(item => checkUserPermission(user, item.href));

  const sections: NavigationItem[] = [];

  // 1. Core Overview
  const coreItems = filtered([
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Tasks', href: '/admin/tasks', icon: Calendar },
  ]);
  if (coreItems.length > 0) sections.push(...coreItems);

  // 2. People & Operations
  const managementItems = filtered([
    { title: 'Members', href: '/admin/users', icon: UserPlus },
    { title: 'Applications', href: '/admin/board', icon: Users },
    { title: 'Volunteers', href: '/admin/volunteers', icon: UserCheck },
    { title: 'Donations', href: '/admin/donations', icon: CreditCard },
    { title: 'Tax & Compliance', href: '/admin/compliance', icon: ShieldCheck },
    { title: 'SOP Manuals', href: '/admin/sops', icon: FileText },
  ]);
  if (managementItems.length > 0) {
    sections.push({ title: 'Management', items: managementItems });
  }

  // 3. Website Content
  const contentItems = filtered([
    { title: 'Blogs', href: '/admin/blogs', icon: FileText },
    { title: 'Editorial', href: '/admin/editorial-hub', icon: FileText },
    { title: 'Page Content', href: '/admin/content', icon: Layout },
    { title: 'Page Config', href: '/admin/page-config', icon: Database },
    { title: 'SEO', href: '/admin/seo', icon: Globe },
  ]);
  if (contentItems.length > 0) {
    sections.push({ title: 'Content', items: contentItems });
  }

  // 4. Multimedia & Press
  const mediaItems = filtered([
    { title: 'Visual Hub', href: '/admin/gallery-hub', icon: Image },
    { title: 'Gallery', href: '/admin/gallery', icon: Image },
    { title: 'Videos', href: '/admin/documentaries', icon: Film },
    { title: 'Press', href: '/admin/press', icon: ShieldCheck },
  ]);
  if (mediaItems.length > 0) {
    sections.push({ title: 'Media', items: mediaItems });
  }

  // 5. Forms & Submissions
  const formItems = filtered([
    { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { title: 'Schemes', href: '/admin/schemes', icon: FileText },
    { id: 'page_testimonials', title: 'Testimonials', href: '/admin/feedback', icon: Star },
    { title: 'Contacts', href: '/admin/contacts', icon: Mail },
    { title: 'Legacy Requests', href: '/admin/legacy', icon: Heart },
    { title: 'Expansion Node', href: '/admin/expansion', icon: TrendingUp },
  ]);
  if (formItems.length > 0) {
    sections.push({ title: 'Forms & CRM', items: formItems });
  }

  // 6. Communications & Ads
  const commsItems = filtered([
    { title: 'WhatsApp', href: '/admin/whatsapp-hub', icon: MessageSquare },
    { title: 'Support', href: '/admin/support', icon: MessageSquare },
    { title: 'Live Streaming', href: '/admin/live-streaming', icon: Video },
    { title: 'Banners', href: '/admin/marketing/banners', icon: Layout },
    { title: 'Newsletters', href: '/admin/marketing/newsletter', icon: Mail },
  ]);
  if (commsItems.length > 0) {
    sections.push({ title: 'Communication', items: commsItems });
  }

  // 6. Security & Logs
  const logItems = filtered([
    { title: 'Global Settings', href: '/admin/settings', icon: Settings },
    { title: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
    { title: 'Analytics', href: '/admin/visitor-analytics', icon: BarChart3 },
    { title: 'System Health', href: '/admin/intelligence/system-logs', icon: Shield },
    { title: 'Maintenance', href: '/admin/system/maintenance', icon: Terminal },
    { title: 'Email Logs', href: '/admin/email-logs', icon: Mail },
    { title: 'Interaction Logs', href: '/admin/intelligence/communication-logs', icon: MessageSquare },
  ]);
  if (logItems.length > 0) {
    sections.push({ title: 'System', items: logItems });
  }

  return sections;
};

interface AdminUser {
  id: string;
  name: string;
  role: string;
  permissions: string[];
}

export default function AdminSidebar({ user, onLogout, isOpen, onClose }: { user: AdminUser, onLogout: () => void, isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();
  const sidebarItems = getNavigationItems(user);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-72 bg-white border-r border-navy-50 shadow-2xl overflow-hidden flex flex-col z-[50] transition-transform duration-500 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-6 right-6 p-2 text-navy-700 hover:text-navy-950 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Premium Header / Status */}
        <div className="p-8 border-b border-navy-50 bg-[#fcfcfc]/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-navy-950 flex items-center justify-center shadow-xl">
              <Shield className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h2 className="text-navy-950 font-black text-sm uppercase tracking-tighter italic">Admin Panel</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-pulse"></span>
                <span className="text-[11px] text-navy-700 font-black uppercase tracking-widest">Active Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 overflow-y-auto p-6 scrollbar-none space-y-4">
          {sidebarItems.map((item, index) => (
            <div key={index} className="space-y-1">
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={cn(
                    'group flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden',
                    pathname === item.href
                      ? 'bg-navy-950 text-gold-500 shadow-2xl shadow-navy-200'
                      : 'text-navy-700 hover:text-navy-950 hover:bg-navy-50'
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-all",
                    pathname === item.href ? "bg-white/10" : "bg-navy-50 group-hover:bg-gold-600/10 group-hover:text-gold-600"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {item.title}
                  {pathname === item.href && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gold-600 rounded-l-full"></div>
                  )}
                </Link>
              ) : (
                <div className="pt-4 space-y-1">
                  <div className="px-5 mb-2 mt-4 first:mt-0">
                    <span className="text-xs font-black text-navy-950 uppercase tracking-[0.4em] opacity-80">{item.title}</span>
                  </div>
                  <div className="space-y-1">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => window.innerWidth < 1024 && onClose()}
                        className={cn(
                          'group/sub flex items-center gap-4 px-5 py-3 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all duration-300',
                          pathname === subItem.href
                            ? 'bg-navy-950 text-gold-500 shadow-xl shadow-navy-200/50'
                            : 'text-navy-700 hover:text-navy-950 hover:bg-navy-50'
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-lg transition-all",
                          pathname === subItem.href ? "bg-white/10" : "bg-navy-50 group-hover/sub:bg-gold-600/10 group-hover/sub:text-gold-600"
                        )}>
                          <subItem.icon className="w-3.5 h-3.5" />
                        </div>
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer / Logout Button Area */}
        <div className="p-6 border-t border-navy-50 bg-[#fcfcfc]/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all group"
          >
            <div className="p-2 rounded-xl bg-rose-50 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <X className="w-4 h-4" />
            </div>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
