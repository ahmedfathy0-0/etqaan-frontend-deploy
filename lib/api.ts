import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import { API_URL, CHOREO_API_KEY } from '@/constants/config';

export const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (CHOREO_API_KEY) {
      // Fallback for some specific API keys if required
      config.headers.Authorization = `Bearer ${CHOREO_API_KEY}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || 'حدث خطأ ما';
      // Don't show toast for 401s if we want to handle them specifically
      if (error.response.status === 401) {
         // handle token expiry globally if needed
         useAuthStore.getState().logout();
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('لا يمكن الاتصال بالخادم');
    } else {
      toast.error(error.message || 'حدث خطأ ما');
    }
    return Promise.reject(error);
  }
);
