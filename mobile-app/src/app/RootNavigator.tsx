import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { MissionDetailScreen } from '../screens/MissionDetailScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MissionDetail" component={MissionDetailScreen} options={{ title: 'Détail de la Mission' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
