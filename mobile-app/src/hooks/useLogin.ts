import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
    const loginStore = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: async (credentials: { email: string; motDePasse: string }) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: async (data) => {
            const serverPayload = data.data || data;
            const token = serverPayload.access_token;
            const user = serverPayload.agent;

            // L'intercepteur Axios et useAuthStore.restoreSession sont basés sur 'agentToken' et 'agentData'
            // tel que défini dans le store original. useAuthStore gère déjà AsyncStorage.
            await loginStore(token, user);
        },
    });
};
