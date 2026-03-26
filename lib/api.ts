// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

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

  // Admin endpoints
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

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
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

// Specific API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiRequest(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  getProfile: async () => {
    return apiRequest(API_ENDPOINTS.ME);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest(API_ENDPOINTS.CHANGE_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  sendOTP: async (email: string) => {
    return apiRequest(API_ENDPOINTS.SEND_OTP, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOTP: async (email: string, otp: string) => {
    return apiRequest(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  sendMobileOTP: async (mobile: string) => {
    return apiRequest(API_ENDPOINTS.SEND_MOBILE_OTP, {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  verifyMobileOTP: async (mobile: string, otp: string) => {
    return apiRequest(API_ENDPOINTS.VERIFY_MOBILE_OTP, {
      method: 'POST',
      body: JSON.stringify({ mobile, otp }),
    });
  },
};

export const adminAPI = {
  getStats: async () => {
    return apiRequest(API_ENDPOINTS.ADMIN_STATS);
  },

  getUsers: async (page = 1, limit = 10) => {
    return apiRequest(`${API_ENDPOINTS.ADMIN_USERS}?page=${page}&limit=${limit}`);
  },

  getActivities: async (page = 1, limit = 10) => {
    return apiRequest(`${API_ENDPOINTS.ADMIN_ACTIVITIES}?page=${page}&limit=${limit}`);
  },

  getEmailLogs: async (page = 1, limit = 20) => {
    return apiRequest(`${API_ENDPOINTS.ADMIN_EMAIL_LOGS}?page=${page}&limit=${limit}`);
  },
};

export const formsAPI = {
  getReports: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return apiRequest(`${API_ENDPOINTS.REPORTS}?${params}`);
  },
  updateReportStatus: async (id: string, status: string) => {
    return apiRequest(`${API_ENDPOINTS.REPORTS}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  getFeedback: async (page = 1, limit = 10) => {
    return apiRequest(`${API_ENDPOINTS.FEEDBACK}?page=${page}&limit=${limit}`);
  },
  updateFeedbackStatus: async (id: string, status: string) => {
    return apiRequest(`${API_ENDPOINTS.FEEDBACK}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  getVolunteers: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return apiRequest(`${API_ENDPOINTS.VOLUNTEERS}?${params}`);
  },
  updateVolunteerStatus: async (id: string, status: string) => {
    return apiRequest(`${API_ENDPOINTS.VOLUNTEERS}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  getContacts: async (page = 1, limit = 10) => {
    return apiRequest(`${API_ENDPOINTS.CONTACTS}?page=${page}&limit=${limit}`);
  },
  getDonations: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return apiRequest(`${API_ENDPOINTS.DONATIONS}?${params}`);
  },
  updateDonationStatus: async (id: string, status: string) => {
    return apiRequest(`${API_ENDPOINTS.DONATIONS}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  getBoardApplications: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return apiRequest(`${API_ENDPOINTS.BOARD}?${params}`);
  },
  updateBoardApplicationStatus: async (id: string, status: string) => {
    return apiRequest(`${API_ENDPOINTS.BOARD}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  getLegacyGiving: async (page = 1, limit = 10) => {
    return apiRequest(`${API_ENDPOINTS.LEGACY}?page=${page}&limit=${limit}`);
  },
  getSchemes: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return apiRequest(`${API_ENDPOINTS.SCHEMES}?${params}`);
  },
  updateSchemeStatus: async (id: string, status: string) => {
    return apiRequest(`${API_ENDPOINTS.SCHEMES}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  getExpansionRequests: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return apiRequest(`${API_ENDPOINTS.EXPANSION}?${params}`);
  },
  updateExpansionStatus: async (id: string, status: string) => {
    return apiRequest(`${API_ENDPOINTS.EXPANSION}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

export const galleryAPI = {
  getImages: async (page = 1, limit = 20, category?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return apiRequest(`${API_ENDPOINTS.GALLERY}?${params}`);
  },
  uploadImage: async (formData: FormData) => {
    return apiRequest(API_ENDPOINTS.GALLERY, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
  },
  updateImage: async (id: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.GALLERY}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteImage: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.GALLERY}/${id}`, {
      method: 'DELETE',
    });
  },
  getStats: async () => {
    return apiRequest(`${API_ENDPOINTS.GALLERY}/stats`);
  },
};

export const contentAPI = {
  getContent: async (page = 1, limit = 10, type?: string, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return apiRequest(`${API_ENDPOINTS.CONTENT}?${params}`);
  },
  getContentItem: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.CONTENT}/${id}`);
  },
  createContent: async (data: any) => {
    return apiRequest(API_ENDPOINTS.CONTENT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateContent: async (id: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.CONTENT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteContent: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.CONTENT}/${id}`, {
      method: 'DELETE',
    });
  },
  getStats: async () => {
    return apiRequest(`${API_ENDPOINTS.CONTENT}/stats`);
  },
};

export const pressAPI = {
  getPressReleases: async (page = 1, limit = 10, status?: string, category?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return apiRequest(`${API_ENDPOINTS.PRESS}?${params}`);
  },
  getPressRelease: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.PRESS}/${id}`);
  },
  createPressRelease: async (data: any) => {
    return apiRequest(API_ENDPOINTS.PRESS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updatePressRelease: async (id: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.PRESS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deletePressRelease: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.PRESS}/${id}`, {
      method: 'DELETE',
    });
  },
  getStats: async () => {
    return apiRequest(`${API_ENDPOINTS.PRESS}/stats`);
  },
};

export const documentaryAPI = {
  getDocumentaries: async (page = 1, limit = 10, status?: string, category?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return apiRequest(`${API_ENDPOINTS.DOCUMENTARIES}?${params}`);
  },
  getDocumentary: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.DOCUMENTARIES}/${id}`);
  },
  createDocumentary: async (data: any) => {
    return apiRequest(API_ENDPOINTS.DOCUMENTARIES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateDocumentary: async (id: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.DOCUMENTARIES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteDocumentary: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.DOCUMENTARIES}/${id}`, {
      method: 'DELETE',
    });
  },
  getStats: async () => {
    return apiRequest(`${API_ENDPOINTS.DOCUMENTARIES}/stats`);
  },
};

export const seoAPI = {
  getSEOData: async (page = 1, limit = 10, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return apiRequest(`${API_ENDPOINTS.SEO}?${params}`);
  },
  getSEOPage: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/${id}`);
  },
  createSEOPage: async (data: any) => {
    return apiRequest(API_ENDPOINTS.SEO, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateSEOPage: async (id: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteSEOPage: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/${id}`, {
      method: 'DELETE',
    });
  },
  runAudit: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/${id}/audit`, {
      method: 'POST',
    });
  },
  getStats: async () => {
    return apiRequest(`${API_ENDPOINTS.SEO}/stats`);
  },
  generateSitemap: async () => {
    return apiRequest(`${API_ENDPOINTS.SEO}/sitemap`, {
      method: 'POST',
    });
  },
  getSEOReport: async () => {
    return apiRequest(`${API_ENDPOINTS.SEO}/report`);
  },
  getSEOPageByName: async (pageName: string) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/page/${pageName}`);
  },
  updateSEOPageByName: async (pageName: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/page/${pageName}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  analyzeKeywords: async (keywords: string[]) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/keywords/analyze`, {
      method: 'POST',
      body: JSON.stringify({ keywords }),
    });
  },
  bulkUpdateMetaTags: async (updates: any[]) => {
    return apiRequest(`${API_ENDPOINTS.SEO}/bulk/meta-tags`, {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  },
};

export const settingsAPI = {
  getSettings: async () => {
    return apiRequest(API_ENDPOINTS.SETTINGS);
  },
  updateSettings: async (data: any) => {
    return apiRequest(API_ENDPOINTS.SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  getSettingsSection: async (section: string) => {
    return apiRequest(`${API_ENDPOINTS.SETTINGS}/${section}`);
  },
  updateSettingsSection: async (section: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.SETTINGS}/${section}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  resetSettings: async () => {
    return apiRequest(`${API_ENDPOINTS.SETTINGS}/reset`, {
      method: 'POST',
    });
  },
  backupSettings: async () => {
    return apiRequest(`${API_ENDPOINTS.SETTINGS}/backup`, {
      method: 'POST',
    });
  },
  testEmailConfig: async (email: string) => {
    return apiRequest(`${API_ENDPOINTS.SETTINGS}/test-email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

export const analyticsAPI = {
  getAnalytics: async (timeRange = '30d', category = 'all') => {
    const params = new URLSearchParams({ timeRange, category });
    return apiRequest(`${API_ENDPOINTS.ANALYTICS}?${params}`);
  },
  getOverview: async () => {
    return apiRequest(`${API_ENDPOINTS.ANALYTICS}/overview`);
  },
  getTrends: async (type = 'all', period = '6m') => {
    const params = new URLSearchParams({ type, period });
    return apiRequest(`${API_ENDPOINTS.ANALYTICS}/trends?${params}`);
  },
  getDemographics: async () => {
    return apiRequest(`${API_ENDPOINTS.ANALYTICS}/demographics`);
  },
  getRealtime: async () => {
    return apiRequest(`${API_ENDPOINTS.ANALYTICS}/realtime`);
  },
  trackVisitorAction: async (data: any) => {
    return fetch(`${API_ENDPOINTS.ANALYTICS}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true,
    });
  },
  getVisitorStats: async (timeRange = '24h', customStart?: string, customEnd?: string) => {
    const params = new URLSearchParams({ timeRange });
    if (customStart) params.append('customStart', customStart);
    if (customEnd) params.append('customEnd', customEnd);
    return apiRequest(`${API_ENDPOINTS.ANALYTICS}/visitors?${params.toString()}`);
  },
  getVisitorDetailsByIP: async (ip: string) => {
    return apiRequest(`${API_ENDPOINTS.ANALYTICS}/visitors/${ip}`);
  },
};

export const chatAPI = {
  initiateChat: async (data: { name: string; email: string; phone: string }) => {
    return apiRequest(`${API_ENDPOINTS.CHAT}/initiate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getHistory: async (chatId: string) => {
    return apiRequest(`${API_ENDPOINTS.CHAT}/history/${chatId}`);
  },
  getAllChats: async () => {
    return apiRequest(`${API_ENDPOINTS.CHAT}/admin/all`);
  },
  markAsRead: async (chatId: string) => {
    return apiRequest(`${API_ENDPOINTS.CHAT}/admin/read/${chatId}`, {
      method: 'PUT',
    });
  },
  uploadAudio: async (formData: FormData) => {
    // Note: Don't set Content-Type header; fetch will auto-set it for FormData
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_ENDPOINTS.CHAT}/upload-audio`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },
  closeChat: async (chatId: string) => {
    return apiRequest(`${API_ENDPOINTS.CHAT}/close/${chatId}`, {
      method: 'PUT',
    });
  },
};

export default API_BASE_URL;