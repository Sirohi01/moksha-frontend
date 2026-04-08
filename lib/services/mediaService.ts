import { apiRequest, API_ENDPOINTS, getToken } from '../api-base';

export const mediaService = {
  getImages: async (page = 1, limit = 20, category?: string, search?: string, isAdmin = false, isPublic?: boolean) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (isAdmin) params.append('isAdmin', 'true');
    if (isPublic !== undefined) params.append('isPublic', isPublic.toString());
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
  getCategories: async () => {
    return apiRequest(`${API_ENDPOINTS.GALLERY}/categories`);
  },
};
