import { apiRequest, API_ENDPOINTS, API_BASE_URL } from '../api-base';

export const chatService = {
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
  closeChat: async (chatId: string) => {
    return apiRequest(`${API_ENDPOINTS.CHAT}/close/${chatId}`, {
      method: 'PUT',
    });
  },
  uploadAudio: async (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const response = await fetch(`${API_ENDPOINTS.CHAT}/upload-audio`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },
};

export const intelligenceService = {
  getErrorLogs: async (page = 1, limit = 20) => {
    return apiRequest(`${API_ENDPOINTS.INTELLIGENCE}/error-logs?page=${page}&limit=${limit}`);
  },
  getCommunicationLogs: async (page = 1, limit = 20, type?: string, status?: string, mode?: 'alerts' | 'interactions') => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (mode) params.append('mode', mode);
    return apiRequest(`${API_ENDPOINTS.INTELLIGENCE}/communication-logs?${params}`);
  },
  trackInteraction: async (platform: string, pageUrl: string) => {
    return apiRequest(`${API_ENDPOINTS.INTELLIGENCE}/track-interaction`, {
      method: 'POST',
      body: JSON.stringify({ platform, pageUrl }),
    });
  },
  getPerformanceSummary: async () => {
    return apiRequest(`${API_ENDPOINTS.INTELLIGENCE}/performance-summary`);
  },
};

export const newsletterService = {
  subscribe: async (email: string, source: string) => {
    return apiRequest(`${API_BASE_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    });
  },
};
