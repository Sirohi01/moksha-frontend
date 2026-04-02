import { apiRequest, API_ENDPOINTS } from '../api-base';

export const marketingService = {
  getCampaigns: async () => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/campaigns`);
  },
  createCampaign: async (data: any) => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/campaigns`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getContent: async () => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/content`);
  },
  createContent: async (data: any) => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/content`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateContent: async (id: string, data: any) => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  toggleContentStatus: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/content/${id}/toggle`, {
      method: 'PATCH',
    });
  },
  deleteContent: async (id: string) => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/content/${id}`, {
      method: 'DELETE',
    });
  },
  getSegments: async () => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/segments`);
  },
  getActiveContent: async () => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/active`);
  },
  createSegment: async (data: any) => {
    return apiRequest(`${API_ENDPOINTS.MARKETING}/segments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
