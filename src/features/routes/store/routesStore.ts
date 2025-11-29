import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Route } from "../../../types";

export interface SavedRoute extends Route {
  id: string;
  timestamp: number;
  isFavorite: boolean;
}

interface RoutesState {
  favouriteRoutes: SavedRoute[];
  isLoading: boolean;

  // Actions
  loadData: () => Promise<void>;
  toggleFavorite: (routeId: string, route?: Route) => Promise<void>;
  removeFavorite: (routeId: string) => Promise<void>;
  isFavoriteRoute: (fromCode: string, toCode: string) => boolean;
}

const STORAGE_KEY_FAVORITES = "@routes/favorites";

export const useRoutesStore = create<RoutesState>((set, get) => ({
  favouriteRoutes: [],
  isLoading: true,

  loadData: async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);

      set({
        favouriteRoutes: favoritesData ? JSON.parse(favoritesData) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load route data:", error);
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (routeId: string, route?: Route) => {
    try {
      const { favouriteRoutes } = get();

      const isFavorited = favouriteRoutes.some((f) => f.id === routeId);

      let updatedFavorites: SavedRoute[];

      if (isFavorited) {
        // Remove from favorites
        updatedFavorites = favouriteRoutes.filter((f) => f.id !== routeId);
      } else {
        // Add to favorites
        if (!route) return;

        const favoriteRoute: SavedRoute = {
          ...route,
          id: routeId,
          timestamp: Date.now(),
          isFavorite: true,
        };
        updatedFavorites = [favoriteRoute, ...favouriteRoutes];
      }

      await AsyncStorage.setItem(
        STORAGE_KEY_FAVORITES,
        JSON.stringify(updatedFavorites),
      );

      set({ favouriteRoutes: updatedFavorites });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  },

  removeFavorite: async (routeId: string) => {
    try {
      const { favouriteRoutes } = get();

      const updatedFavorites = favouriteRoutes.filter((f) => f.id !== routeId);

      await AsyncStorage.setItem(
        STORAGE_KEY_FAVORITES,
        JSON.stringify(updatedFavorites),
      );

      set({ favouriteRoutes: updatedFavorites });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  },

  isFavoriteRoute: (fromCode: string, toCode: string) => {
    const { favouriteRoutes } = get();
    return favouriteRoutes.some(
      (f) => f.from.code === fromCode && f.to.code === toCode,
    );
  },
}));
