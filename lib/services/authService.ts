import { apiRequest, API_ENDPOINTS, removeToken } from '../api-base';

export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
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

  sendLoginOTP: async (mobile: string) => {
    return apiRequest(API_ENDPOINTS.SEND_LOGIN_OTP, {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  loginWithOTP: async (mobile: string, otp: string) => {
    return apiRequest(API_ENDPOINTS.LOGIN_WITH_OTP, {
      method: 'POST',
      body: JSON.stringify({ mobile, otp }),
    });
  },

  verify2FA: async (email: string, otp: string) => {
    return apiRequest(API_ENDPOINTS.VERIFY_2FA, {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },
};
