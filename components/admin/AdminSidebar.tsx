'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { checkUserPermission } from '@/lib/permissions';
import NextImage from 'next/image';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image as LucideImage,
  MessageSquare,
  Settings,
  BarChart3,
  Calendar,
  Heart,
  UserCheck,
  Mail,
  Database,
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
  Terminal,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NavigationItem {
  title: string;
  href?: string;
  icon?: any;
  id?: string;
  items?: {
    title: string;
    href: string;
    icon: any;
    id?: string;
  }[];
}

interface AdminUser {
  id: string;
  name: string;
  role: string;
  permissions: string[];
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
    sections.push({ title: 'Operations', items: managementItems });
  }

  // 3. Website Content Engine
  const contentItems = filtered([
    { title: 'Blogs', href: '/admin/blogs', icon: FileText },
    { title: 'Editorial', href: '/admin/editorial-hub', icon: FileText },
    { title: 'Page Content', href: '/admin/content', icon: Layout },
    { title: 'Page Config', href: '/admin/page-config', icon: Database },
    { title: 'SEO', href: '/admin/seo', icon: Globe },
  ]);
  if (contentItems.length > 0) {
    sections.push({ title: 'Content Engine', items: contentItems });
  }

  // 4. Multimedia & Assets
  const mediaItems = filtered([
    { title: 'Visual Hub', href: '/admin/gallery-hub', icon: LucideImage },
    { title: 'Gallery', href: '/admin/gallery', icon: LucideImage },
    { title: 'Documentaries', href: '/admin/documentaries', icon: Film },
    { title: 'Press Center', href: '/admin/press', icon: ShieldCheck },
  ]);
  if (mediaItems.length > 0) {
    sections.push({ title: 'Assets & Media', items: mediaItems });
  }

  // 5. CRM & Submissions
  const crmItems = filtered([
    { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { title: 'Schemes', href: '/admin/schemes', icon: FileText },
    { id: 'page_testimonials', title: 'Testimonials', href: '/admin/feedback', icon: Star },
    { title: 'Contacts', href: '/admin/contacts', icon: Mail },
    { title: 'Legacy Requests', href: '/admin/legacy', icon: Heart },
    { title: 'Expansion Node', href: '/admin/expansion', icon: TrendingUp },
  ]);
  if (crmItems.length > 0) {
    sections.push({ title: 'Forms & CRM', items: crmItems });
  }

  // 6. Communications
  const commsItems = filtered([
    { title: 'WhatsApp Hub', href: '/admin/whatsapp-hub', icon: MessageSquare },
    { title: 'Support Inbox', href: '/admin/support', icon: MessageSquare },
    { title: 'Live Streaming', href: '/admin/live-streaming', icon: Video },
    { title: 'Banners', href: '/admin/marketing/banners', icon: Sparkles },
    { title: 'Newsletters', href: '/admin/marketing/newsletter', icon: Mail },
  ]);
  if (commsItems.length > 0) {
    sections.push({ title: 'Communications', items: commsItems });
  }

  // 7. Intelligence & Security
  const logItems = filtered([
    { title: 'Global Settings', href: '/admin/settings', icon: Settings },
    { title: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
    { title: 'Analytics', href: '/admin/visitor-analytics', icon: BarChart3 },
    { title: 'System Health', href: '/admin/intelligence/system-logs', icon: ShieldCheck },
    { title: 'Maintenance', href: '/admin/system/maintenance', icon: Terminal },
    { title: 'Email Logs', href: '/admin/email-logs', icon: Mail },
    { title: 'Email Templates', href: '/admin/email-templates', icon: Mail },
    { title: 'Interaction Logs', href: '/admin/intelligence/communication-logs', icon: MessageSquare },
  ]);
  if (logItems.length > 0) {
    sections.push({ title: 'Systems Hub', items: logItems });
  }

  return sections;
};

export default function AdminSidebar({ user, onLogout, isOpen, onClose }: { user: AdminUser, onLogout: () => void, isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();
  const sidebarItems = getNavigationItems(user);

  return (
    <>
      {/* Mobile Overlay with Glassmorphism */}
      <div
        className={cn(
          "fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[45] lg:hidden transition-opacity duration-700 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed top-4 left-4 bottom-4 w-[260px] sm:w-64 xl:w-72 bg-[#FAF9F6] rounded-[2.5rem] border border-stone-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col z-[50] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] lg:translate-x-0"
      )}>
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-50" />

        {/* Mobile Close Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          type="button"
          className="lg:hidden absolute top-5 right-5 p-3 text-stone-500 hover:text-stone-900 transition-all hover:rotate-90 duration-300 z-[100] cursor-pointer rounded-full bg-stone-100/50 hover:bg-stone-200"
          aria-label="Close Sidebar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Premium Header / Brand Profile */}
        <div className="px-8 pt-10 pb-8 border-b border-stone-200/40 relative group">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.05)] transform group-hover:scale-105 transition-transform duration-500 border border-stone-200/60 p-2">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <NextImage
                    src="/logo.png"
                    alt="Moksha Sewa Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#FAF9F6] shadow-sm animate-pulse" />
            </div>
            <div>
              <h2 className="text-stone-900 font-black text-xs uppercase tracking-[0.2em]">
                Moksha <span className="text-gold-600">Pannel</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 overflow-y-auto px-5 py-6 scrollbar-thin scrollbar-thumb-stone-200 hover:scrollbar-thumb-gold-400/30 space-y-6">
          {sidebarItems.map((item, index) => (
            <div key={index} className="space-y-1.5 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={cn(
                    'group flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all duration-500 relative overflow-hidden',
                    pathname === item.href
                      ? 'bg-stone-50 text-gold-600 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] translate-x-1 border border-gold-500/20'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 hover:translate-x-1'
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    pathname === item.href
                      ? "bg-white ring-1 ring-gold-500/30 text-gold-600"
                      : "bg-white ring-1 ring-stone-200 group-hover:ring-gold-500/30 group-hover:bg-gold-50/50 group-hover:text-gold-600"
                  )}>
                    <item.icon className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <span className="flex-1">{item.title}</span>
                  {pathname === item.href ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                  )}
                </Link>
              ) : (
                <div className="pt-2 space-y-1.5">
                  <div className="px-5 py-2">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.4em] block">{item.title}</span>
                  </div>
                  <div className="space-y-1.5">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => window.innerWidth < 1024 && onClose()}
                        className={cn(
                          'group/sub flex items-center gap-4 px-5 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all duration-300 relative',
                          pathname === subItem.href
                            ? 'bg-stone-50 text-gold-600 shadow-md translate-x-1 border border-gold-500/20'
                            : 'text-stone-500 hover:text-stone-950 hover:bg-white hover:translate-x-1 hover:shadow-sm'
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-xl transition-all duration-300",
                          pathname === subItem.href
                            ? "bg-white text-gold-600 shadow-sm"
                            : "bg-stone-100/80 group-hover/sub:bg-gold-50 group-hover/sub:text-gold-600"
                        )}>
                          <subItem.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="flex-1">{subItem.title}</span>
                        {pathname === subItem.href && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gold-400 rounded-r-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer / Account Management */}
        <div className="p-6 border-t border-stone-200/40 bg-stone-50/50 backdrop-blur-sm">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all group overflow-hidden relative"
          >
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 relative z-10">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="relative z-10 italic">Logout</span>
            <div className="absolute inset-0 bg-rose-50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </aside>
    </>
  );
}
