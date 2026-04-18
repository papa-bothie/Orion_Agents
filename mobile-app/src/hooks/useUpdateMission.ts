import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api.client';
import { MissionStatus } from '../types';

export const useUpdateMission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: MissionStatus }) => {
            const response = await api.put(`/incidents/${id}`, { statut: status });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['missions'] });
            queryClient.invalidateQueries({ queryKey: ['mission', variables.id] });
        },
    });
};
