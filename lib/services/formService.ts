import { apiRequest, API_ENDPOINTS } from '../api-base';

export const formsService = {
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
  getPublicReports: async (page = 1, limit = 100) => {
    return apiRequest(`${API_ENDPOINTS.REPORTS}/public/list?page=${page}&limit=${limit}`);
  },
  getPublicStats: async () => {
    return apiRequest(`${API_ENDPOINTS.REPORTS}/public/stats`);
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
