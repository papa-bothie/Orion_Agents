import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/useAuthStore';

// URL du backend (le namespace par défaut est '/' ou '/incidents' selon votre gateway)
// Assurez-vous que cette URL pointe vers le serveur NestJS (et non React)
const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://success-christina-virtually-sydney.trycloudflare.com';

export const useOrionSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const queryClient = useQueryClient();
    const agent = useAuthStore(state => state.agent);

    useEffect(() => {
        if (!agent?.id) return;

        // Connexion au WebSocket
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            // Optionnel : passer l'ID de l'agent dans la query pour que le backend puisse l'identifier
            query: { agentId: agent.id }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[ORION Socket Agent] Connecté ✓ — ID :', socket.id);
        });

        // Écouter les mises à jour générales d'incidents (ou spécifiquement celles assignées)
        socket.on('incidentCreated', (incident) => {
            if (incident.agentAssigneId === agent.id) {
                console.log('[ORION Socket Agent] Nouvel incident assigné :', incident.reference);
                queryClient.invalidateQueries({ queryKey: ['missions', agent.id] });
            }
        });

        socket.on('incidentUpdated', (incident) => {
            if (incident.agentAssigneId === agent.id) {
                console.log('[ORION Socket Agent] Incident mis à jour :', incident.reference);
                queryClient.invalidateQueries({ queryKey: ['missions', agent.id] });
                queryClient.invalidateQueries({ queryKey: ['mission', incident.id] });
            }
        });

        socket.on('incidentAssigned', (incident) => {
            if (incident.agentAssigneId === agent.id) {
                console.log('[ORION Socket Agent] Incident assigné à cet agent :', incident.reference);
                queryClient.invalidateQueries({ queryKey: ['missions', agent.id] });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('[ORION Socket Agent] Déconnecté ✗ — Raison :', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('[ORION Socket Agent] Erreur de connexion :', error.message);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [agent?.id, queryClient]);

    return socketRef.current;
};
