import { create } from 'zustand';

type AgentStatus = 'available' | 'on-mission' | 'unavailable';

interface AgentState {
    status: AgentStatus;
    setStatus: (status: AgentStatus) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
    status: 'available',
    setStatus: (status) => set({ status }),
}));
