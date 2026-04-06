export const ROUTE_PERMISSIONS: Record<string, string> = {
  // Main Core Pages
  '/admin/dashboard': 'page_dashboard',
  '/admin/tasks': 'page_tasks',
  '/admin/users': 'page_users',

  // Forms & CRM Pages
  '/admin/reports': 'page_reports',
  '/admin/board': 'page_board',
  '/admin/feedback': 'page_feedback',
  '/admin/schemes': 'page_schemes',
  '/admin/contacts': 'page_contacts',
  '/admin/legacy': 'page_legacy',
  '/admin/expansion': 'page_expansion',
  '/admin/volunteers': 'page_volunteers',
  '/admin/donations': 'page_donations',
  '/admin/compliance': 'page_compliance',
  '/admin/sops': 'page_sops',

  // Website Content Section
  '/admin/blogs': 'page_blogs',
  '/admin/editorial-hub': 'page_editorial',
  '/admin/content': 'page_content',
  '/admin/page-config': 'page_pageconfig',
  '/admin/seo': 'page_seo',

  // Multimedia & Press Sector
  '/admin/gallery-hub': 'page_galleryhub',
  '/admin/gallery': 'page_gallery',
  '/admin/documentaries': 'page_documentaries',
  '/admin/press': 'page_press',

  // Communication & Marketing
  '/admin/whatsapp-hub': 'page_whatsapp',
  '/admin/support': 'page_support',
  '/admin/marketing/banners': 'page_banners',
  '/admin/marketing/newsletter': 'page_newsletter',

  // System & Intelligence
  '/admin/settings': 'page_settings',
  '/admin/activity-logs': 'page_logs',
  '/admin/visitor-analytics': 'page_analytics',
  '/admin/intelligence/system-logs': 'page_system',
  '/admin/intelligence/communication-logs': 'page_comm_logs',
  '/admin/email-logs': 'page_email_logs',
  '/admin/system/maintenance': 'page_maintenance',
};
export const checkUserPermission = (user: { role: string; permissions: string[] } | null, pathname: string): boolean => {
  if (!user) return false;
  if (user.role === 'super_admin' || user.permissions.includes('super_admin')) return true;
  const baseRoute = pathname.split('?')[0];

  const requiredPermission = ROUTE_PERMISSIONS[baseRoute];
  if (['/admin/dashboard', '/admin/support', '/admin/tasks'].includes(baseRoute)) return true;
  if (!requiredPermission) return true;
  if (user.permissions.includes(requiredPermission)) return true;
  const legacyBase = requiredPermission.replace('page_', '');
  const viewPerm = `view_${legacyBase}`;
  const managePerm = `manage_${legacyBase}`;

  if (user.permissions.includes(viewPerm) || user.permissions.includes(managePerm)) {
    return true;
  }

  return false;
};
