import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMissions } from '../hooks/useMissions';
import { useOrionSocket } from '../hooks/useOrionSocket';
import { Incident } from '../types';
import useAuthStore from '../store/useAuthStore';


export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { data: missions, isLoading, error, refetch, isRefetching } = useMissions();
    const { agent, logout } = useAuthStore();
    
    // Activer l'écoute des WebSockets pour le rafraîchissement en temps réel
    useOrionSocket();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Erreur lors du chargement des missions</Text>
                <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const getPriorityStyle = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return styles.priority_critical;
            case 'high': return styles.priority_high;
            case 'low': return styles.priority_low;
            default: return styles.priority_normal;
        }
    };

    const renderItem = ({ item }: { item: Incident }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('MissionDetail', { id: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.type}>{item.type}</Text>
                <View style={[styles.badge, getPriorityStyle(item.urgency || '')]}>
                    <Text style={styles.badgeText}>{item.urgency || 'NORMALE'}</Text>
                </View>
            </View>
            <Text style={styles.status}>Statut: {item.status}</Text>
            {item.description && <Text style={styles.location}>📍 {item.description}</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View>
                    <Text style={styles.greeting}>Bonjour,</Text>
                    <Text style={styles.agentName}>
                        {agent?.prenom ? `${agent.prenom} ${agent.nom}` : 'Agent'}
                    </Text>
                    {agent?.matricule ? (
                        <Text style={styles.matricule}>Mat. {agent.matricule}</Text>
                    ) : null}
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Déco.</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.header}>
                <Text style={styles.title}>Mes Missions</Text>
            </View>
            
            <FlatList
                data={missions || []}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={!!isRefetching} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Aucune mission affectée pour le moment.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    greeting: { fontSize: 12, color: '#9CA3AF' },
    agentName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    matricule: { fontSize: 11, color: '#6B7280', marginTop: 2 },
    logoutBtn: { alignItems: 'center', padding: 8 },
    logoutIcon: { fontSize: 20 },
    logoutText: { fontSize: 10, color: '#EF4444', marginTop: 2 },
    header: { padding: 20, paddingBottom: 10, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold' },
    list: { padding: 15 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    type: { fontSize: 18, fontWeight: 'bold' },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    priority_low: { backgroundColor: '#34C759' },
    priority_normal: { backgroundColor: '#007AFF' },
    priority_high: { backgroundColor: '#FF9500' },
    priority_critical: { backgroundColor: '#FF3B30' },
    status: { fontSize: 14, color: '#666', marginBottom: 5 },
    location: { fontSize: 14, color: '#444' },
    errorText: { color: 'red', marginBottom: 10 },
    retryButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
    retryText: { color: '#fff' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666', fontSize: 16 }
});
