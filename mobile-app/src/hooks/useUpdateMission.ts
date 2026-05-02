import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { IncidentStatus } from '../types';

export const useUpdateMission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: IncidentStatus }) => {
            const response = await apiClient.put(`/incidents/${id}`, { statut: status });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['missions'] });
            queryClient.invalidateQueries({ queryKey: ['mission', variables.id] });
        },
    });
};
