import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { Incident } from '../types';

export const useMissionDetail = (id: string) => {
    return useQuery({
        queryKey: ['mission', id],
        queryFn: async (): Promise<Incident> => {
            const response = await apiClient.get(`/incidents/${id}`);
            const inc = response.data;
            return {
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
            };
        },
        enabled: !!id,
    });
};
