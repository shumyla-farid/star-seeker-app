import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Route } from "../../../types";

export interface SavedRoute extends Route {
  id: string;
  timestamp: number;
  isFavorite: boolean;
}

interface RoutesState {
  searchHistory: SavedRoute[];
  favorites: SavedRoute[];
  isLoading: boolean;

  // Actions
  loadData: () => Promise<void>;
  addSearchToHistory: (route: Route) => Promise<void>;
  toggleFavorite: (routeId: string) => Promise<void>;
  removeFavorite: (routeId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isFavoriteRoute: (fromCode: string, toCode: string) => boolean;
}

const STORAGE_KEY_HISTORY = "@routes/history";
const STORAGE_KEY_FAVORITES = "@routes/favorites";
const MAX_HISTORY = 20;

export const useRoutesStore = create<RoutesState>((set, get) => ({
  searchHistory: [],
  favorites: [],
  isLoading: true,

  loadData: async () => {
    try {
      const [historyData, favoritesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_HISTORY),
        AsyncStorage.getItem(STORAGE_KEY_FAVORITES),
      ]);

      set({
        searchHistory: historyData ? JSON.parse(historyData) : [],
        favorites: favoritesData ? JSON.parse(favoritesData) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load route data:", error);
      set({ isLoading: false });
    }
  },

  addSearchToHistory: async (route: Route) => {
    try {
      const { searchHistory } = get();

      // Create unique ID based on route details
      const routeId = `${route.from.code}-${route.to.code}-${
        route.totalCost
      }-${route.route.join("-")}`;

      // Check if this exact route already exists
      const existingIndex = searchHistory.findIndex((r) => r.id === routeId);

      let updatedHistory: SavedRoute[];

      if (existingIndex !== -1) {
        // Move existing route to top
        const existingRoute = searchHistory[existingIndex];
        updatedHistory = [
          { ...existingRoute, timestamp: Date.now() },
          ...searchHistory.filter((_, i) => i !== existingIndex),
        ];
      } else {
        // Add new route
        const newRoute: SavedRoute = {
          ...route,
          id: routeId,
          timestamp: Date.now(),
          isFavorite: false,
        };
        updatedHistory = [newRoute, ...searchHistory].slice(0, MAX_HISTORY);
      }

      await AsyncStorage.setItem(
        STORAGE_KEY_HISTORY,
        JSON.stringify(updatedHistory),
      );
      set({ searchHistory: updatedHistory });
    } catch (error) {
      console.error("Failed to add search to history:", error);
    }
  },

  toggleFavorite: async (routeId: string) => {
    try {
      const { searchHistory, favorites } = get();

      // Find route in history
      const route = searchHistory.find((r) => r.id === routeId);
      if (!route) return;

      const isFavorited = favorites.some((f) => f.id === routeId);

      let updatedFavorites: SavedRoute[];
      let updatedHistory: SavedRoute[];

      if (isFavorited) {
        // Remove from favorites
        updatedFavorites = favorites.filter((f) => f.id !== routeId);
        updatedHistory = searchHistory.map((r) =>
          r.id === routeId ? { ...r, isFavorite: false } : r,
        );
      } else {
        // Add to favorites
        const favoriteRoute = { ...route, isFavorite: true };
        updatedFavorites = [favoriteRoute, ...favorites];
        updatedHistory = searchHistory.map((r) =>
          r.id === routeId ? { ...r, isFavorite: true } : r,
        );
      }

      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEY_FAVORITES,
          JSON.stringify(updatedFavorites),
        ),
        AsyncStorage.setItem(
          STORAGE_KEY_HISTORY,
          JSON.stringify(updatedHistory),
        ),
      ]);

      set({
        favorites: updatedFavorites,
        searchHistory: updatedHistory,
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  },

  removeFavorite: async (routeId: string) => {
    try {
      const { favorites, searchHistory } = get();

      const updatedFavorites = favorites.filter((f) => f.id !== routeId);
      const updatedHistory = searchHistory.map((r) =>
        r.id === routeId ? { ...r, isFavorite: false } : r,
      );

      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEY_FAVORITES,
          JSON.stringify(updatedFavorites),
        ),
        AsyncStorage.setItem(
          STORAGE_KEY_HISTORY,
          JSON.stringify(updatedHistory),
        ),
      ]);

      set({
        favorites: updatedFavorites,
        searchHistory: updatedHistory,
      });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  },

  clearHistory: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([]));
      set({ searchHistory: [] });
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  },

  isFavoriteRoute: (fromCode: string, toCode: string) => {
    const { favorites } = get();
    return favorites.some(
      (f) => f.from.code === fromCode && f.to.code === toCode,
    );
  },
}));
