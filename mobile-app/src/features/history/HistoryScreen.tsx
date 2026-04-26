import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import { Incident, IncidentStatus } from '../../types';
import { CheckCircle } from 'lucide-react-native';

export default function HistoryScreen() {
  const { agent } = useAuthStore();

  const { data: history, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const response = await apiClient.get('/incidents/mes-incidents');
      const serverPayload = response.data?.data;
      const allMissions = serverPayload?.incidents || serverPayload || [];
      
      const mappedMissions = allMissions.map((inc: any) => ({
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

      return mappedMissions.filter((m: Incident) => m.status === IncidentStatus.RESOLU);
    },
    enabled: !!agent,
  });

  const renderHistoryCard = ({ item }: { item: Incident }) => {
    const dateStr = item.dateCreation ? new Date(item.dateCreation).toLocaleDateString() : 'Date inconnue';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.typeText}>{item.type}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
        <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>
        <View style={styles.statusRow}>
          <CheckCircle size={16} color="#22C55E" />
          <Text style={styles.statusText}>Intervention terminée</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique d'Interventions</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 50 }} />
      ) : history?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun historique disponible.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 20, marginTop: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', fontSize: 16 },
  card: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeText: { color: '#38BDF8', fontSize: 16, fontWeight: 'bold' },
  dateText: { color: '#64748B', fontSize: 14 },
  descriptionText: { color: '#94A3B8', fontSize: 14, marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusText: { color: '#22C55E', fontSize: 14, fontWeight: '500', marginLeft: 8 },
});
