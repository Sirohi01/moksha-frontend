export * from './api-base';
import { authService } from './services/authService';
import { formsService } from './services/formService';
import { contentService, pressService, documentaryService } from './services/contentService';
import { adminService, seoService, analyticsService } from './services/systemService';
import { marketingService } from './services/marketingService';
import { chatService, intelligenceService, newsletterService } from './services/interactionService';
import { mediaService } from './services/mediaService';
export const authAPI = authService;
export const adminAPI = adminService;
export const formsAPI = formsService;
export const contentAPI = contentService;
export const pressAPI = pressService;
export const documentaryAPI = documentaryService;
export const seoAPI = seoService;
export const analyticsAPI = analyticsService;
export const marketingAPI = marketingService;
export const chatAPI = chatService;
export const intelligenceAPI = intelligenceService;
export const newsletterAPI = newsletterService;
export const galleryAPI = mediaService;
import { apiRequest, API_ENDPOINTS } from './api-base';
export const settingsAPI = {
    getSettings: async () => apiRequest(API_ENDPOINTS.SETTINGS),
    updateSettings: async (data: any) => apiRequest(API_ENDPOINTS.SETTINGS, { method: 'PUT', body: JSON.stringify(data) }),
    getSettingsSection: async (section: string) => apiRequest(`${API_ENDPOINTS.SETTINGS}/${section}`),
    updateSettingsSection: async (section: string, data: any) => apiRequest(`${API_ENDPOINTS.SETTINGS}/${section}`, { method: 'PUT', body: JSON.stringify(data) }),
    backupSettings: async () => apiRequest(`${API_ENDPOINTS.SETTINGS}/backup`, { method: 'POST' }),
};

import { API_BASE_URL } from './api-base';
export default API_BASE_URL;