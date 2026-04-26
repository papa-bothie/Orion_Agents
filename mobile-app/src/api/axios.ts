import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// L'URL de l'API Cloudflare (HTTPS)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://success-christina-virtually-sydney.trycloudflare.com/api/v1';

console.log('[API] URL is set to:', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Augmenté pour pallier les éventuelles latences du tunnel
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
