import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useMissionDetail } from '../hooks/useMissionDetail';
import { useUpdateMission } from '../hooks/useUpdateMission';
import { IncidentStatus } from '../types';

export const MissionDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const { data: mission, isLoading, error } = useMissionDetail(id);
    const { mutate: updateMission, isPending: isUpdating } = useUpdateMission();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error || !mission) {
        return (
            <View style={styles.centered}>
                <Text>Erreur de chargement des détails.</Text>
            </View>
        );
    }

    const handleUpdateStatus = (status: IncidentStatus) => {
        updateMission(
            { id, status },
            {
                onSuccess: () => {
                    Alert.alert('Succès', 'Statut mis à jour');
                    if (status === IncidentStatus.RESOLU) {
                        navigation.goBack();
                    }
                },
                onError: () => {
                    Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
                }
            }
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{mission.type}</Text>
                
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Statut :</Text>
                    <Text style={styles.value}>{mission.status}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Urgence :</Text>
                    <Text style={styles.value}>{mission.urgency}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Localisation :</Text>
                    <Text style={styles.value}>{mission.description || 'Non spécifié'}</Text>
                </View>

                {mission.description && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Description :</Text>
                        <Text style={styles.description}>{mission.description}</Text>
                    </View>
                )}
            </View>

            <View style={styles.actions}>
                {mission.status === IncidentStatus.NOUVEAU && (
                    <>
                        <TouchableOpacity 
                            style={[styles.button, styles.btnEnCours]}
                            onPress={() => handleUpdateStatus(IncidentStatus.EN_COURS)}
                            disabled={isUpdating}
                        >
                            <Text style={styles.buttonText}>Accepter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.btnRefuser]}
                            onPress={() => navigation.goBack()}
                            disabled={isUpdating}
                        >
                            <Text style={styles.buttonText}>Refuser</Text>
                        </TouchableOpacity>
                    </>
                )}

                {mission.status === IncidentStatus.EN_COURS && (
                    <TouchableOpacity 
                        style={[styles.button, styles.btnTerminer]}
                        onPress={() => handleUpdateStatus(IncidentStatus.RESOLU)}
                        disabled={isUpdating}
                    >
                        <Text style={styles.buttonText}>Terminer la mission</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: '#fff', padding: 20, margin: 15, borderRadius: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    infoRow: { flexDirection: 'row', marginBottom: 10 },
    label: { fontWeight: 'bold', width: 120, color: '#555' },
    value: { flex: 1, color: '#333' },
    section: { marginTop: 15 },
    description: { marginTop: 5, color: '#444', lineHeight: 22 },
    actions: { padding: 15 },
    button: { padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
    btnEnCours: { backgroundColor: '#FF9500' },
    btnTerminer: { backgroundColor: '#34C759' },
    btnRefuser: { backgroundColor: '#FF3B30' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
