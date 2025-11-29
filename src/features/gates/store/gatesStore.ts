import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Gate } from "../../../types";

export interface SavedGate {
  gate: Gate;
  id: string;
  timestamp: number;
}

interface GatesState {
  favoriteGates: SavedGate[];
  isLoading: boolean;

  // Actions
  loadData: () => Promise<void>;
  toggleFavoriteGate: (gate: Gate) => Promise<void>;
  removeFavoriteGate: (gateCode: string) => Promise<void>;
  isFavoriteGate: (gateCode: string) => boolean;
}

const STORAGE_KEY_FAVORITE_GATES = "@gates/favorite-gates";

export const useGatesStore = create<GatesState>((set, get) => ({
  favoriteGates: [],
  isLoading: true,

  loadData: async () => {
    try {
      const favoriteGatesData = await AsyncStorage.getItem(
        STORAGE_KEY_FAVORITE_GATES,
      );

      set({
        favoriteGates: favoriteGatesData ? JSON.parse(favoriteGatesData) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load gates data:", error);
      set({ isLoading: false });
    }
  },

  toggleFavoriteGate: async (gate: Gate) => {
    try {
      const { favoriteGates } = get();
      const isFavorited = favoriteGates.some((g) => g.gate.code === gate.code);

      let updatedFavoriteGates: SavedGate[];

      if (isFavorited) {
        // Remove from favorites
        updatedFavoriteGates = favoriteGates.filter(
          (g) => g.gate.code !== gate.code,
        );
      } else {
        // Add to favorites
        const savedGate: SavedGate = {
          gate,
          id: gate.code,
          timestamp: Date.now(),
        };
        updatedFavoriteGates = [savedGate, ...favoriteGates];
      }

      await AsyncStorage.setItem(
        STORAGE_KEY_FAVORITE_GATES,
        JSON.stringify(updatedFavoriteGates),
      );

      set({ favoriteGates: updatedFavoriteGates });
    } catch (error) {
      console.error("Failed to toggle favorite gate:", error);
    }
  },

  removeFavoriteGate: async (gateCode: string) => {
    try {
      const { favoriteGates } = get();
      const updatedFavoriteGates = favoriteGates.filter(
        (g) => g.gate.code !== gateCode,
      );

      await AsyncStorage.setItem(
        STORAGE_KEY_FAVORITE_GATES,
        JSON.stringify(updatedFavoriteGates),
      );

      set({ favoriteGates: updatedFavoriteGates });
    } catch (error) {
      console.error("Failed to remove favorite gate:", error);
    }
  },

  isFavoriteGate: (gateCode: string) => {
    const { favoriteGates } = get();
    return favoriteGates.some((g) => g.gate.code === gateCode);
  },
}));
