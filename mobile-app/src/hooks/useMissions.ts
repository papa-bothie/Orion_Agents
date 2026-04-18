import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api.client';
import { useAuthStore } from '../store/useAuthStore';
import { Mission } from '../types';

export const useMissions = () => {
    const user = useAuthStore((state) => state.user);
    const agentId: string | undefined = user?.id;

    return useQuery({
        queryKey: ['missions', agentId],
        queryFn: async (): Promise<Mission[]> => {
            const response = await api.get(`/agents/${agentId}/missions`);
            return response.data;
        },
        // Ne lance la requête que si l'agent est bien connecté avec un ID valide
        enabled: !!agentId,
        // Désactive les retries automatiques pour éviter le spam de 404
        retry: false,
        // Données valides 30 secondes, refetch toutes les minutes
        staleTime: 30_000,
        refetchInterval: 60_000,
    });
};
