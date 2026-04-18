import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLogin } from '../hooks/useLogin';

export const LoginScreen = () => {
    const [email, setEmail] = useState('ousmane.diop@orion.sn');
    const { mutate: login, isPending } = useLogin();

    const handleLogin = () => {
        if (!email) {
            Alert.alert('Erreur', 'Veuillez renseigner votre email');
            return;
        }

        login(
            { email },
            {
                onError: (error: any) => {
                    Alert.alert('Erreur', error.response?.data?.message || 'Identifiants incorrects');
                },
            }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ORION Agent</Text>
            <Text style={styles.subtitle}>Connexion</Text>

            <TextInput
                style={styles.input}
                placeholder="Email de l'agent"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={isPending}
            >
                {isPending ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Se connecter</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
