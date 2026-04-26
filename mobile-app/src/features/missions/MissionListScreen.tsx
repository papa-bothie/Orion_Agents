import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, Alert, RefreshControl, Linking, Platform,
  Modal, TextInput, KeyboardAvoidingView, ScrollView as RNScrollView,
  Animated
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { 
  AlertCircle, MapPin, CheckCircle, Navigation, 
  RefreshCw, Clock, ChevronRight, X, Send
} from 'lucide-react-native';

import { LinearGradient } from 'expo-linear-gradient';

import apiClient from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import { Incident, IncidentStatus } from '../../types';
import { saveMissionsToCache, loadMissionsFromCache } from '../../utils/persistenceUtils';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://success-christina-virtually-sydney.trycloudflare.com';

export default function MissionListScreen() {
  const { agent } = useAuthStore();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cachedMissions, setCachedMissions] = useState<Incident[]>([]);
  
  // États pour le rapport final
  const [selectedMission, setSelectedMission] = useState<Incident | null>(null);
  const [reportNote, setReportNote] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  // État pour la notification In-App
  const [newMissionNotification, setNewMissionNotification] = useState<Incident | null>(null);
  const notificationAnim = useRef(new Animated.Value(-200)).current;

  // Charger le cache au démarrage
  useEffect(() => {
    const initCache = async () => {
      const data = await loadMissionsFromCache();
      setCachedMissions(data);
    };
    initCache();
  }, []);

  const showNotification = useCallback((mission: Incident) => {
    setNewMissionNotification(mission);
    
    Animated.spring(notificationAnim, {
      toValue: 50,
      useNativeDriver: true,
      bounciness: 10,
    }).start();

    // Masquer après 5 secondes
    setTimeout(() => {
      Animated.timing(notificationAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 5000);
  }, [notificationAnim]);

  // Initialisation du WebSocket
  useEffect(() => {
    if (!agent) return;

    const newSocket = io(SOCKET_URL, {
      query: { agentId: agent.id },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => console.log('[Socket] Connecté MissionListScreen'));
    
    // Nouveaux événements du backend NestJS
    newSocket.on('incidentAssigned', (incident: Incident) => {
      if (incident.agentAssigneId === agent.id) {
        showNotification(incident);
        queryClient.invalidateQueries({ queryKey: ['missions'] });
      }
    });

    newSocket.on('incidentUpdated', (incident: Incident) => {
      if (incident.agentAssigneId === agent.id) {
        queryClient.invalidateQueries({ queryKey: ['missions'] });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [agent, queryClient, showNotification]);

  // Récupérer les missions actives
  const { data: missions, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const response = await apiClient.get('/incidents/mes-incidents');
      // Le backend NestJS enveloppe la réponse dans { success: true, data: { incidents: [] } }
      const serverPayload = response.data?.data;
      const allMissions = serverPayload?.incidents || serverPayload || [];
      
      // Mapper les propriétés comme dans useMissions
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

      const activeMissions = mappedMissions.filter((m: Incident) => m.status !== IncidentStatus.RESOLU);
      
      // Sauvegarder dans le cache
      await saveMissionsToCache(activeMissions);
      return activeMissions;
    },
    enabled: !!agent,
  });

  const updateMissionStatus = useMutation({
    mutationFn: async ({ id, newStatus, note }: { id: string, newStatus: IncidentStatus, note?: string }) => {
      const payload: any = { status: newStatus };
      if (note) payload.commentaireAgent = note; // On suppose que le backend accepte ce champ
      
      const response = await apiClient.put(`/incidents/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      setShowReportModal(false);
      setReportNote('');
      setSelectedMission(null);
      Alert.alert('Succès', 'Mission terminée et rapport envoyé.');
    },
    onError: () => {
      Alert.alert('Erreur', 'Impossible de mettre à jour la mission.');
    }
  });

  const handleFinishMission = (mission: Incident) => {
    setSelectedMission(mission);
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (!selectedMission) return;
    updateMissionStatus.mutate({ 
      id: selectedMission.id, 
      newStatus: IncidentStatus.RESOLU,
      note: reportNote 
    });
  };

  const openInMaps = (lat: number, lng: number) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = 'Incident Orion';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderSkeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader} />
      <View style={styles.skeletonText} />
      <View style={[styles.skeletonText, { width: '60%' }]} />
      <View style={styles.skeletonButton} />
    </View>
  );

  const renderMissionCard = ({ item }: { item: Incident }) => {
    const isNouveau = item.status === IncidentStatus.NOUVEAU;
    const isEnCours = item.status === IncidentStatus.EN_COURS;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: item.urgency === 'URGENT' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)' }]}>
            <Text style={[styles.badgeText, { color: item.urgency === 'URGENT' ? '#F87171' : '#38BDF8' }]}>
              {item.type}
            </Text>
          </View>
          <View style={styles.timeTag}>
            <Clock size={12} color="#94A3B8" />
            <Text style={styles.timeText}>Action requise</Text>
          </View>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#94A3B8" />
            <Text style={styles.locationText}>Zone d'intervention</Text>
          </View>
          <TouchableOpacity 
            style={styles.mapLink}
            onPress={() => openInMaps(item.latitude, item.longitude)}
          >
            <Navigation size={14} color="#38BDF8" />
            <Text style={styles.mapLinkText}>Itinéraire</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardActions}>
          {isNouveau ? (
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => updateMissionStatus.mutate({ id: item.id, newStatus: IncidentStatus.EN_COURS })}
            >
              <AlertCircle size={18} color="#FFF" />
              <Text style={styles.btnText}>DÉMARRER</Text>
            </TouchableOpacity>
          ) : isEnCours ? (
            <TouchableOpacity 
              style={[styles.primaryBtn, { backgroundColor: '#22C55E' }]}
              onPress={() => handleFinishMission(item)}
            >
              <CheckCircle size={18} color="#FFF" />
              <Text style={styles.btnText}>TERMINER</Text>
            </TouchableOpacity>
          ) : null}
          
          <TouchableOpacity 
            style={styles.detailsBtn} 
            onPress={() => openInMaps(item.latitude, item.longitude)}
          >
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displayData = missions || cachedMissions;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Missions</Text>
          <Text style={{ color: '#94A3B8', fontSize: 15, marginTop: 4 }}>
            Connecté en tant que: {agent?.prenom} {agent?.nom}
          </Text>
        </View>
        <TouchableOpacity onPress={onRefresh} disabled={isRefetching}>
          <RefreshCw size={20} color="#38BDF8" style={isRefetching ? { opacity: 0.5 } : {}} />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={{ padding: 20, backgroundColor: 'rgba(255,0,0,0.1)', margin: 20, borderRadius: 10 }}>
          <Text style={{ color: '#F87171' }}>Erreur réseau: {error.message}</Text>
        </View>
      )}

      {/* NOTIFICATION IN-APP ANIMÉE */}
      <Animated.View style={[
        styles.notificationBox, 
        { transform: [{ translateY: notificationAnim }], zIndex: 9999 }
      ]}>
        <LinearGradient
          colors={['#0284C7', '#0369A1']}
          style={styles.notificationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationIcon}>
              <AlertCircle size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notificationTitle}>Nouveau Signalement !</Text>
              <Text style={styles.notificationText} numberOfLines={1}>
                {newMissionNotification?.type}: {newMissionNotification?.description}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationClose}
              onPress={() => { 
                Animated.timing(notificationAnim, {
                  toValue: -200,
                  duration: 200,
                  useNativeDriver: true
                }).start();
              }}
            >
              <X size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {isLoading && !displayData.length ? (
        <View style={{ flex: 1 }}>
          {renderSkeleton()}
          {renderSkeleton()}
        </View>
      ) : displayData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <RefreshCw size={64} color="#1E293B" />
          <Text style={styles.emptyText}>Aucune mission</Text>
          <Text style={styles.emptySubText}>Tirez vers le bas pour rafraîchir.</Text>
        </View>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.id}
          renderItem={renderMissionCard}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={onRefresh} 
              tintColor="#38BDF8" 
              colors={['#38BDF8']}
            />
          }
        />
      )}

      {/* MODALE DE RAPPORT FINAL */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rapport d'Intervention</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <X size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
               <Text style={styles.modalLabel}>Ajoutez vos observations finales (facultatif) :</Text>
               <TextInput
                 style={styles.noteInput}
                 placeholder="RAS, calme rétabli, personne interpelée..."
                 placeholderTextColor="#475569"
                 multiline
                 numberOfLines={4}
                 value={reportNote}
                 onChangeText={setReportNote}
                 autoFocus
               />
               
               <TouchableOpacity 
                 style={[styles.submitBtn, updateMissionStatus.isPending && { opacity: 0.7 }]}
                 onPress={submitReport}
                 disabled={updateMissionStatus.isPending}
               >
                 {updateMissionStatus.isPending ? (
                   <ActivityIndicator color="#FFF" />
                 ) : (
                   <>
                     <Send size={18} color="#FFF" />
                     <Text style={styles.submitBtnText}>VALIDER LA RÉSOLUTION</Text>
                   </>
                 )}
               </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 60,
    paddingBottom: 10 
  },
  title: { fontSize: 28, fontWeight: '900', color: '#F8FAFC', letterSpacing: 0.5 },
  card: { 
    backgroundColor: '#1E293B', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#334155',
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { color: '#64748B', fontSize: 11, fontWeight: '600' },
  description: { fontSize: 16, color: '#F1F5F9', marginBottom: 16, lineHeight: 22 },
  metaRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 16
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
  mapLink: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(56, 189, 248, 0.05)', padding: 6, borderRadius: 6 },
  mapLinkText: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#334155', marginBottom: 16 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  primaryBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: '#0284C7', 
    paddingVertical: 12, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 8
  },
  btnText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  detailsBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: '#0F172A', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  emptySubText: { color: '#64748B', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  skeletonCard: { 
    backgroundColor: '#1E293B', 
    borderRadius: 20, 
    padding: 16, 
    margin: 20, 
    marginBottom: 0,
    opacity: 0.6
  },
  skeletonHeader: { width: 100, height: 20, backgroundColor: '#334155', borderRadius: 4, marginBottom: 16 },
  skeletonText: { width: '100%', height: 12, backgroundColor: '#334155', borderRadius: 4, marginBottom: 8 },
  skeletonButton: { width: '100%', height: 44, backgroundColor: '#334155', borderRadius: 12, marginTop: 16 },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    gap: 15,
  },
  modalLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  noteInput: {
    backgroundColor: '#0F172A',
    borderRadius: 15,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 120,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // NOTIFICATION STYLES
  notificationBox: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  notificationGradient: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  notificationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  notificationClose: {
    marginLeft: 10,
    padding: 4,
  }
});
