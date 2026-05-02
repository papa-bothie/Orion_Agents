import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Dimensions } from 'react-native';
import { Eye, EyeOff, Shield } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import { Agent } from '../../types';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('agent1@orion.sn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const loginAction = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/auth/login', {
        email: email.trim(),
        motDePasse: password,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      loginAction(data.access_token, data.agent as Agent);
    },
    onError: (error: any) => {
      Alert.alert(
        'Erreur de connexion', 
        error.response?.data?.message || 'Serveur indisponible.'
      );
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    loginMutation.mutate();
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#060B14']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Shield size={48} color="#38BDF8" />
          </View>
          <Text style={styles.title}>ORION AGENT</Text>
          <Text style={styles.subtitle}>SÉCURITÉ & INTERVENTION</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Adresse Email</Text>
            <TextInput
              style={styles.input}
              placeholder="agent@orion.sn"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••"
                placeholderTextColor="#475569"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.eyeIconContainer}
              >
                {showPassword ? <EyeOff size={20} color="#64748B" /> : <Eye size={20} color="#64748B" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loginMutation.isPending && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>SE CONNECTER</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.footerText}>Protégé par le protocole ORION</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    padding: 28,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#38BDF8',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '800',
    letterSpacing: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 15,
    padding: 16,
    color: '#F8FAFC',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: '#F8FAFC',
    fontSize: 16,
  },
  eyeIconContainer: {
    padding: 16,
  },
  button: {
    backgroundColor: '#0284C7',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#475569',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
