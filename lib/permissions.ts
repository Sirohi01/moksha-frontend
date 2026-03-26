/**
 * MOKSHA ADMIN PERMISSION SYSTEM
 * Mapping between application routes and required permissions.
 */

export const ROUTE_PERMISSIONS: Record<string, string> = {
  // Main Core Pages
  '/admin/dashboard': 'page_dashboard',
  '/admin/support': 'page_support',
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
  '/admin/newsletter': 'page_newsletter',

  // Content & Config
  '/admin/content': 'page_content',
  '/admin/content-editor': 'page_content',
  '/admin/page-config': 'page_content',
  '/admin/seo': 'page_seo',
  '/admin/media': 'page_media',
  '/admin/compliance': 'page_compliance',

  // Intelligence Sub-sector
  '/admin/visitor-analytics': 'page_analytics',
  '/admin/intelligence/system-logs': 'page_logs',
  '/admin/intelligence/communication-logs': 'page_logs',
  '/admin/email-logs': 'page_logs',
};
export const checkUserPermission = (user: { role: string; permissions: string[] } | null, pathname: string): boolean => {
  if (!user) return false;
  if (user.role === 'super_admin' || user.permissions.includes('super_admin')) return true;
  const baseRoute = pathname.split('?')[0];

  const requiredPermission = ROUTE_PERMISSIONS[baseRoute];

  // Essential basic pages are visible to all authenticated personnel
  if (['/admin/dashboard', '/admin/support', '/admin/tasks'].includes(baseRoute)) return true;

  // If no permission is explicitly required, allow access
  if (!requiredPermission) return true;

  // 1. Check if user has the specific modern permission
  if (user.permissions.includes(requiredPermission)) return true;

  // 2. BACKWARD COMPATIBILITY: Legacy Permission Mapping
  // Map 'page_reports' -> 'view_reports' or 'manage_reports'
  const legacyBase = requiredPermission.replace('page_', '');
  const viewPerm = `view_${legacyBase}`;
  const managePerm = `manage_${legacyBase}`;

  if (user.permissions.includes(viewPerm) || user.permissions.includes(managePerm)) {
    return true;
  }

  return false;
};
