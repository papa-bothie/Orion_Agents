import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Agent } from '../types';

interface AuthState {
  token: string | null;
  agent: Agent | null;
  isAuthenticated: boolean;
  login: (token: string, agent: Agent) => Promise<void>;
  logout: () => Promise<void>;
  updateAgent: (agent: Agent) => Promise<void>;
  restoreSession: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  agent: null,
  isAuthenticated: false,

  login: async (token: string, agent: Agent) => {
    try {
      await AsyncStorage.setItem('agentToken', token);
      await AsyncStorage.setItem('agentData', JSON.stringify(agent));
      set({ token, agent, isAuthenticated: true });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('agentToken');
      await AsyncStorage.removeItem('agentData');
      set({ token: null, agent: null, isAuthenticated: false });
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  },

  updateAgent: async (newAgentData: Partial<Agent>) => {
    try {
      const currentAgent = useAuthStore.getState().agent;
      
      // On retire les valeurs nulles ou indéfinies du nouveau payload pour ne pas "effacer" les données locales
      const filteredDataEntries = Object.entries(newAgentData).filter(([_, v]) => v !== null && v !== undefined);
      const filteredData = Object.fromEntries(filteredDataEntries);
      
      const updatedAgent = { ...currentAgent, ...filteredData } as Agent;
      await AsyncStorage.setItem('agentData', JSON.stringify(updatedAgent));
      set({ agent: updatedAgent });
    } catch (error) {
      console.error('Erreur mise à jour agent', error);
    }
  },

  restoreSession: async () => {
    try {
      const token = await AsyncStorage.getItem('agentToken');
      const agentData = await AsyncStorage.getItem('agentData');
      if (token && agentData) {
        set({ token, agent: JSON.parse(agentData), isAuthenticated: true });
      }
    } catch (error) {
      console.error('Erreur session', error);
    }
  },
}));

export default useAuthStore;
