import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api.client';
import { Mission } from '../types';

export const useMissionDetail = (id: string) => {
    return useQuery({
        queryKey: ['mission', id],
        queryFn: async (): Promise<Mission> => {
            const response = await api.get(`/incidents/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};
