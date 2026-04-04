import { apiRequest } from '../api-base';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface SOP {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  isCritical: boolean;
  version: number;
  author: {
    _id: string;
    name: string;
    role: string;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const sopService = {
  getAll: async (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`${API_BASE_URL}/api/sops?${query}`);
  },

  getOne: async (id: string) => {
    return apiRequest(`${API_BASE_URL}/api/sops/${id}`);
  },

  getBySlug: async (slug: string) => {
    return apiRequest(`${API_BASE_URL}/api/sops/${slug}`);
  },

  create: async (data: any) => {
    return apiRequest(`${API_BASE_URL}/api/sops`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`${API_BASE_URL}/api/sops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete: async (id: string) => {
    return apiRequest(`${API_BASE_URL}/api/sops/${id}`, {
      method: 'DELETE'
    });
  }
};
