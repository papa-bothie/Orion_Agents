import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api.client';
import { useAuthStore } from '../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
    const loginStore = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: async (credentials: { email: string }) => {
            // Puisqu'il n'y a pas encore d'endpoint de connexion complet, 
            // on simule la connexion en cherchant l'agent avec cet email
            const response = await api.get('/agents');
            const agents = response.data;
            const agent = agents.find((a: any) => a.email === credentials.email);

            if (!agent) {
                throw { response: { data: { message: "Agent non trouvé avec cet email" } } };
            }
            return { token: 'fake-jwt-token-for-mvp', user: agent };
        },
        onSuccess: async (data) => {
            // Si /auth/login ne renvoie pas de token, on peut utiliser un faux token ou juste l'ID
            const token = data.token || 'fake-jwt-token-for-mvp';
            const user = data.user || data; // Si l'API renvoie l'agent directement

            await AsyncStorage.setItem('orion_auth_token', token);
            await AsyncStorage.setItem('orion_auth_user', JSON.stringify(user));
            
            loginStore(token, user);
        },
    });
};
