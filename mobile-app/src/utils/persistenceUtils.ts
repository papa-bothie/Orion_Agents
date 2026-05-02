import AsyncStorage from '@react-native-async-storage/async-storage';

const MISSIONS_CACHE_KEY = '@orion_missions_cache';

export const saveMissionsToCache = async (missions: any[]) => {
  try {
    await AsyncStorage.setItem(MISSIONS_CACHE_KEY, JSON.stringify(missions));
  } catch (error) {
    console.error('[Persistence] Error saving missions:', error);
  }
};

export const loadMissionsFromCache = async (): Promise<any[]> => {
  try {
    const cachedData = await AsyncStorage.getItem(MISSIONS_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  } catch (error) {
    console.error('[Persistence] Error loading missions:', error);
    return [];
  }
};
