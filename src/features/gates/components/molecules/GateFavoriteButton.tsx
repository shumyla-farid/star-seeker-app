import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GateFavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
}

export function GateFavoriteButton({
  isFavorite,
  onPress,
}: GateFavoriteButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-3 rounded-full mr-3 ${
        isFavorite ? "bg-amber-500/20" : "bg-primary/20"
      }`}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isFavorite ? "star" : "star-outline"}
        size={28}
        color={isFavorite ? "#f59e0b" : "#8b5cf6"}
      />
    </TouchableOpacity>
  );
}
