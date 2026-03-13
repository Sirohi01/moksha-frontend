// Simple frontend-only authentication utilities
// In a real application, this would be replaced with proper backend authentication

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  loginTime: string;
  permissions?: string[];
}

export const AUTH_CONFIG = {
  SESSION_KEY: 'moksha_admin_session',
  USER_KEY: 'moksha_admin_user',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const session = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
  
  if (!session || !userStr) return false;
  
  try {
    const user: AdminUser = JSON.parse(userStr);
    const loginTime = new Date(user.loginTime).getTime();
    const now = Date.now();
    
    // Check if session has expired
    if (now - loginTime > AUTH_CONFIG.SESSION_TIMEOUT) {
      logout();
      return false;
    }
    
    return true;
  } catch {
    logout();
    return false;
  }
}

export function getCurrentUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
  localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  
  // Redirect to login page
  window.location.href = '/admin/login';
}

export function requireAuth(): boolean {
  const authenticated = isAuthenticated();
  
  if (!authenticated && typeof window !== 'undefined') {
    window.location.href = '/admin/login';
    return false;
  }
  
  return authenticated;
}

// Demo function to simulate different user roles
export function hasPermission(permission: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Super admin has all permissions
  if (user.role === 'super_admin') return true;
  
  // Define role-based permissions
  const rolePermissions = {
    admin: [
      'view_dashboard',
      'manage_users',
      'manage_donations',
      'manage_volunteers',
      'view_analytics'
    ],
    moderator: [
      'view_dashboard',
      'manage_volunteers',
      'view_analytics'
    ]
  };
  
  const userPermissions = rolePermissions[user.role] || [];
  return userPermissions.includes(permission);
}

// Utility to format session info
export function getSessionInfo() {
  const user = getCurrentUser();
  if (!user) return null;
  
  const loginTime = new Date(user.loginTime);
  const expiryTime = new Date(loginTime.getTime() + AUTH_CONFIG.SESSION_TIMEOUT);
  
  return {
    user,
    loginTime,
    expiryTime,
    timeRemaining: expiryTime.getTime() - Date.now()
  };
}