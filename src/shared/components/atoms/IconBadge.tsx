import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IconBadgeProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export function IconBadge({
  name,
  size = 20,
  color = "#8b5cf6",
  backgroundColor = "bg-primary/20",
  className = "",
}: IconBadgeProps) {
  return (
    <View className={`p-2 rounded-full ${backgroundColor} ${className}`}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

