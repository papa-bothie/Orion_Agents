import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapPin size={64} color="#38BDF8" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Carte Non Disponible</Text>
      <Text style={styles.description}>
        L'affichage de la carte GPS avec marqueurs (react-native-maps) nécessite désormais de compiler l'application de façon native (EAS Build) car Expo Go sur iOS a récemment retiré le support des cartes lourdes pour alléger son application.
      </Text>
      <Text style={styles.hint}>
        👉 N'hésitez pas à tester les onglets "Missions" et "Profil" (où le WebSocket tourne parfaitement en temps réel !).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  hint: {
    fontSize: 14,
    color: '#38BDF8',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  }
});
