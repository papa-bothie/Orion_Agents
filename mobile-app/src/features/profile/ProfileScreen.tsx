import React, { useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, 
  ScrollView, Image, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  LogOut, Phone, Mail, Shield, ShieldCheck, Flame, 
  Activity, TreePine, Users, Trash2, LifeBuoy, BadgeCheck,
  MapPin, Award, Navigation, Briefcase, Clock
} from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../../store/useAuthStore';
import apiClient from '../../api/axios';
import { AgentStatus, AgentType } from '../../types';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { agent, logout, updateAgent } = useAuthStore();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: AgentStatus) => {
      const response = await apiClient.put(`/agents/${agent?.id}`, { statut: newStatus });
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data && data.agent) {
        updateAgent(data.agent);
      }
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: () => {
      Alert.alert('Erreur', 'Impossible de joindre le serveur central.');
    },
  });

  const getAgentTypeIcon = (type?: AgentType) => {
    const size = 20;
    const color = "#FFF";
    switch (type) {
      case AgentType.POLICE: return <Shield size={size} color={color} />;
      case AgentType.GENDARMERIE: return <ShieldCheck size={size} color={color} />;
      case AgentType.SAPEUR_POMPIER: return <Flame size={size} color={color} />;
      case AgentType.SAMU: return <Activity size={size} color={color} />;
      case AgentType.EAUX_ET_FORETS: return <TreePine size={size} color={color} />;
      case AgentType.GMI: return <Users size={size} color={color} />;
      case AgentType.UCG: return <Trash2 size={size} color={color} />;
      case AgentType.PROTECTION_CIVILE: return <LifeBuoy size={size} color={color} />;
      default: return <Shield size={size} color={color} />;
    }
  };

  const getStatusConfig = (status?: AgentStatus) => {
    switch (status) {
      case AgentStatus.DISPONIBLE: return { color: '#22C55E', label: 'DISPONIBLE', icon: <Activity size={16} color="#FFF" /> };
      case AgentStatus.EN_MISSION: return { color: '#F59E0B', label: 'EN MISSION', icon: <Navigation size={16} color="#FFF" /> };
      case AgentStatus.HORS_LIGNE: return { color: '#64748B', label: 'HORS LIGNE', icon: <Clock size={16} color="#FFF" /> };
      default: return { color: '#64748B', label: 'INCONNU', icon: <Activity size={16} color="#FFF" /> };
    }
  };

  if (!agent) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center' }}>
        <ActivityIndicator color="#38BDF8" size="large" />
      </View>
    );
  }

  const statusConfig = getStatusConfig(agent.statut);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Agent</Text>
          <View style={[styles.onlineBadge, { backgroundColor: statusConfig.color }]}>
             <Text style={styles.onlineBadgeText}>{statusConfig.label}</Text>
          </View>
        </View>

        {/* CARTE PROFESSIONNELLE PREMIUM */}
        <LinearGradient
          colors={['#1E293B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.idCard}
        >
          <View style={styles.cardGlow} />
          
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardAgencyTitle}>RÉPUBLIQUE DU SÉNÉGAL</Text>
              <Text style={styles.cardDocType}>CARTE PROFESSIONNELLE</Text>
            </View>
            <BadgeCheck size={28} color="#38BDF8" />
          </View>

          <View style={styles.cardBody}>
            <View style={styles.photoWrapper}>
              <Image 
                source={{ uri: agent.photoUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop' }} 
                style={styles.agentPhoto} 
              />
              <View style={[styles.cardStatusDot, { backgroundColor: statusConfig.color }]} />
            </View>

            <View style={styles.cardMainInfo}>
              <View style={styles.infoBlock}>
                <Text style={styles.cardLabel}>AGENT</Text>
                <Text style={styles.cardName}>{agent.prenom} {agent.nom}</Text>
              </View>
              
              <View style={styles.infoBlock}>
                <Text style={styles.cardLabel}>UNITÉ</Text>
                <View style={styles.unitRow}>
                  {getAgentTypeIcon(agent.type)}
                  <Text style={styles.unitText}>{agent.type}</Text>
                </View>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.cardLabel}>MATRICULE / SERVICE</Text>
                <Text style={styles.matriculeText}>{agent.matricule || 'GEND-2026-X42'} • {agent.service || 'ORION'}</Text>
              </View>
            </View>
          </View>

          <LinearGradient
            colors={['rgba(56, 189, 248, 0.1)', 'transparent']}
            style={styles.cardFooter}
          >
             <View style={styles.footerTag}>
                <Award size={14} color="#38BDF8" />
                <Text style={styles.footerTagText}>{agent.grade || 'Adjudant'}</Text>
             </View>
             <View style={styles.footerTag}>
                <Briefcase size={14} color="#38BDF8" />
                <Text style={styles.footerTagText}>Brigade Recherche</Text>
             </View>
          </LinearGradient>
        </LinearGradient>

        {/* GESTION DU STATUT RÉACTIF */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>GESTION DE LA DISPONIBILITÉ</Text>
          <View style={styles.statusGrid}>
             {[
               { id: AgentStatus.DISPONIBLE, label: 'PRÊT', color: '#22C55E' },
               { id: AgentStatus.EN_MISSION, label: 'MISSION', color: '#F59E0B' },
               { id: AgentStatus.HORS_LIGNE, label: 'REPOS', color: '#64748B' }
             ].map((item) => (
               <TouchableOpacity 
                 key={item.id}
                 style={[
                   styles.statusTab,
                   agent.statut === item.id && { backgroundColor: item.color, borderColor: item.color }
                 ]}
                 onPress={() => updateStatusMutation.mutate(item.id)}
                 disabled={updateStatusMutation.isPending}
               >
                 <Text style={[
                   styles.statusTabText,
                   agent.statut === item.id && { color: '#FFF' }
                 ]}>
                   {item.label}
                 </Text>
               </TouchableOpacity>
             ))}
          </View>
        </View>

        {/* INFORMATIONS DE CONTACT */}
        <View style={styles.infoList}>
          <View style={styles.infoTile}>
            <View style={styles.tileIcon}><Mail size={20} color="#38BDF8" /></View>
            <View style={styles.tileContent}>
              <Text style={styles.tileLabel}>Email Professionnel</Text>
              <Text style={styles.tileValue}>{agent.email}</Text>
            </View>
          </View>

          <View style={styles.infoTile}>
            <View style={styles.tileIcon}><Phone size={20} color="#38BDF8" /></View>
            <View style={styles.tileContent}>
              <Text style={styles.tileLabel}>Contact d'Urgence</Text>
              <Text style={styles.tileValue}>{agent.telephone || '+221 77 123 45 67'}</Text>
            </View>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.exitBtn} onPress={logout}>
          <LogOut size={22} color="#F87171" />
          <Text style={styles.exitBtnText}>DECONNEXION SECURISÉE</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060B14' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  onlineBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  onlineBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  idCard: { 
    borderRadius: 24, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    marginBottom: 30,
    position: 'relative'
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
    borderRadius: 100,
  },
  cardHeader: { 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  cardAgencyTitle: { color: '#94A3B8', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  cardDocType: { color: '#38BDF8', fontSize: 14, fontWeight: '900', marginTop: 2 },
  cardBody: { padding: 20, flexDirection: 'row', gap: 20 },
  photoWrapper: { position: 'relative' },
  agentPhoto: { 
    width: 90, 
    height: 110, 
    borderRadius: 12, 
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  cardStatusDot: { 
    position: 'absolute', 
    bottom: -6, 
    right: -6, 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 3, 
    borderColor: '#1E293B' 
  },
  cardMainInfo: { flex: 1, justifyContent: 'space-between' },
  infoBlock: { marginBottom: 12 },
  cardLabel: { color: '#475569', fontSize: 9, fontWeight: '800' },
  cardName: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  unitRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  unitText: { color: '#E2E8F0', fontSize: 13, fontWeight: '700' },
  matriculeText: { color: '#94A3B8', fontSize: 11, fontWeight: '600', marginTop: 2 },
  cardFooter: { 
    padding: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  footerTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerTagText: { color: '#94A3B8', fontSize: 11, fontWeight: '700' },
  section: { marginBottom: 30 },
  sectionHeader: { color: '#475569', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 15 },
  statusGrid: { flexDirection: 'row', gap: 10 },
  statusTab: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    backgroundColor: '#111827', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  statusTabText: { color: '#475569', fontSize: 12, fontWeight: '900' },
  infoList: { marginBottom: 30, gap: 15 },
  infoTile: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#111827', 
    padding: 16, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  tileIcon: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: 'rgba(56, 189, 248, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16
  },
  tileContent: { flex: 1 },
  tileLabel: { color: '#475569', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  tileValue: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  exitBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 18, 
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginTop: 10
  },
  exitBtnText: { color: '#F87171', fontSize: 13, fontWeight: '800', letterSpacing: 1, marginLeft: 10 }
});
