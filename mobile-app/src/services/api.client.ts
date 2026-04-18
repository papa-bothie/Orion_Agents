import axios from 'axios';

// URL de base de notre future API
export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    timeout: 10000,
});
