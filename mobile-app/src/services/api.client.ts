import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// URL de base de notre future API
export const api = axios.create({
    baseURL: 'https://api.orion.joj2026.example.com/v1',
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        // Injecter le token d'authentification s'il est présent
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
