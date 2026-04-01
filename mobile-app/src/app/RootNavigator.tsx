import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';

const Stack = createNativeStackNavigator();

// Écran temporaire (Mockup) pour simuler la suite
const PlaceholderScreen = ({ name }: { name: string }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{name}</Text>
    </View>
);

export const RootNavigator = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    // Stack d'authentification
                    <Stack.Screen name="Auth">
                        {() => <PlaceholderScreen name="Écran Connexion (Auth)" />}
                    </Stack.Screen>
                ) : (
                    // Tab et Stack applicatif (Protégé)
                    <Stack.Screen name="Main">
                        {() => <PlaceholderScreen name="Interface Principale (Tabs)" />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
