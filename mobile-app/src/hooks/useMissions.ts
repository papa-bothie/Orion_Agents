import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { Incident } from '../types';

export const useMissions = () => {
    const agent = useAuthStore((state) => state.agent);
    const agentId: string | undefined = agent?.id;

    return useQuery({
        queryKey: ['missions', agentId],
        queryFn: async (): Promise<Incident[]> => {
            const response = await apiClient.get('/incidents/mes-incidents');
            const data = response.data?.incidents || response.data || [];
            
            // Mapper les propriétés backend vers le format attendu
            return data.map((inc: any) => ({
                id: inc.id,
                reference: inc.reference,
                type: inc.type,
                urgency: inc.urgence,
                description: inc.description,
                latitude: inc.latitude,
                longitude: inc.longitude,
                status: inc.statut,
                agentAssigneId: inc.agentAssigneId,
                dateCreation: inc.dateCreation
            }));
        },
        enabled: !!agentId,
        retry: false,
        staleTime: 30_000,
        refetchInterval: 60_000,
    });
};
