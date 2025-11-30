import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  iconColor?: string;
  iconSize?: number;
}

export function EmptyState({
  icon,
  title,
  description,
  iconColor = "#a78bfa",
  iconSize = 80,
}: EmptyStateProps) {
  return (
    <Animated.View
      entering={FadeInUp}
      className="flex-1 justify-center items-center"
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} className="mb-4" />
      <Text className="text-lg text-center mb-2 text-text mt-4">{title}</Text>
      <Text className="text-sm text-center text-gray-400">{description}</Text>
    </Animated.View>
  );
}

