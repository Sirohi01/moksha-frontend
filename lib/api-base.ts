export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  ME: `${API_BASE_URL}/api/auth/me`,
  REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
  SEND_OTP: `${API_BASE_URL}/api/auth/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  SEND_MOBILE_OTP: `${API_BASE_URL}/api/auth/send-mobile-otp`,
  VERIFY_MOBILE_OTP: `${API_BASE_URL}/api/auth/verify-mobile-otp`,
  SEND_LOGIN_OTP: `${API_BASE_URL}/api/auth/send-login-otp`,
  LOGIN_WITH_OTP: `${API_BASE_URL}/api/auth/login-with-otp`,
  VERIFY_2FA: `${API_BASE_URL}/api/auth/verify-2fa`,

  // Admin endpoints
  ADMIN: `${API_BASE_URL}/api/admin`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_ACTIVITIES: `${API_BASE_URL}/api/admin/activities`,
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  ADMIN_EMAIL_LOGS: `${API_BASE_URL}/api/admin/email-logs`,


  // Form endpoints
  REPORTS: `${API_BASE_URL}/api/reports`,
  FEEDBACK: `${API_BASE_URL}/api/feedback`,
  VOLUNTEERS: `${API_BASE_URL}/api/volunteers`,
  CONTACTS: `${API_BASE_URL}/api/contact`,
  DONATIONS: `${API_BASE_URL}/api/donations`,
  BOARD: `${API_BASE_URL}/api/board`,
  LEGACY: `${API_BASE_URL}/api/legacy`,
  SCHEMES: `${API_BASE_URL}/api/schemes`,
  EXPANSION: `${API_BASE_URL}/api/expansion`,

  // Content & Media endpoints
  GALLERY: `${API_BASE_URL}/api/gallery`,
  CONTENT: `${API_BASE_URL}/api/content`,
  PRESS: `${API_BASE_URL}/api/press`,
  DOCUMENTARIES: `${API_BASE_URL}/api/documentaries`,
  SEO: `${API_BASE_URL}/api/seo`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
  ANALYTICS: `${API_BASE_URL}/api/analytics`,
  CHAT: `${API_BASE_URL}/api/chat`,
  INTELLIGENCE: `${API_BASE_URL}/api/intelligence`,
  MARKETING: `${API_BASE_URL}/api/marketing`,
};

// Token management
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
  }
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  const isFormData = options.body instanceof FormData;

  const defaultOptions: RequestInit = {
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/auth/login';
      }
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};
