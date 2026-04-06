import { apiRequest, API_ENDPOINTS } from '../api-base';

export const contentService = {
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

export const pressService = {
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

export const documentaryService = {
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
