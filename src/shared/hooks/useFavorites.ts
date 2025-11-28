import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedRoute {
  id: string;
  from: string;
  to: string;
  cost: number;
  distance: number;
  timestamp: number;
}

const FAVORITES_KEY = 'journey-memory';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      if (data) {
        setFavorites(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (route: Omit<SavedRoute, 'id' | 'timestamp'>) => {
    try {
      const newRoute: SavedRoute = {
        ...route,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      const updated = [newRoute, ...favorites];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavorites(updated);
      return true;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      return false;
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const updated = favorites.filter((fav) => fav.id !== id);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavorites(updated);
      return true;
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      return false;
    }
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
  };
};

