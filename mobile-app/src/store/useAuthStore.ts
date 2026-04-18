import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    login: (token: string, user: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    login: (token, user) => set({ token, user, isAuthenticated: true }),
    logout: async () => {
        await AsyncStorage.removeItem('orion_auth_token');
        await AsyncStorage.removeItem('orion_auth_user');
        set({ token: null, user: null, isAuthenticated: false });
    },
}));
