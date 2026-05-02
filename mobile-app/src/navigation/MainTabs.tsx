import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapPin, User, FileText, ClipboardList } from 'lucide-react-native';

import ProfileScreen from '../features/profile/ProfileScreen';
import MapScreen from '../features/map/MapScreen';
import MissionListScreen from '../features/missions/MissionListScreen';
import HistoryScreen from '../features/history/HistoryScreen';

export type MainTabParamList = {
  Missions: undefined;
  Map: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 1,
          borderTopColor: '#1E293B',
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#64748B',
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Missions') {
            return <ClipboardList color={color} size={size} />;
          } else if (route.name === 'Map') {
            return <MapPin color={color} size={size} />;
          } else if (route.name === 'History') {
            return <FileText color={color} size={size} />;
          } else if (route.name === 'Profile') {
            return <User color={color} size={size} />;
          }
        },
      })}
    >
      <Tab.Screen name="Missions" component={MissionListScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
