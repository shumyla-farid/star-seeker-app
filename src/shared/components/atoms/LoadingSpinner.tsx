import React from "react";
import { View, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingSpinner({
  size = "large",
  color = "#8b5cf6",
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

