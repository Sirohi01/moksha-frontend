import { apiRequest, API_ENDPOINTS } from '../api-base';

export const adminService = {
  getStats: async () => {
    return apiRequest(`${API_ENDPOINTS.ADMIN}/dashboard`);
  },

  getUsers: async (page = 1, limit = 10, role?: string, isActive?: string) => {
    let url = `${API_ENDPOINTS.ADMIN_USERS}?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    if (isActive) url += `&isActive=${isActive}`;
    return apiRequest(url);
  },

  getActivities: async (page = 1, limit = 10, startDate?: string, endDate?: string, search?: string, action?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (search) params.append('search', search);
    if (action) params.append('action', action);
    return apiRequest(`${API_ENDPOINTS.ADMIN_ACTIVITIES}?${params.toString()}`);
  },

  getEmailLogs: async (page = 1, limit = 20, startDate?: string, endDate?: string, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (search) params.append('search', search);
    return apiRequest(`${API_ENDPOINTS.ADMIN_EMAIL_LOGS}?${params.toString()}`);
  },

  getUser: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.ADMIN_USERS}/${id}`);
  },
};

export const seoService = {
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
};

export const analyticsService = {
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
