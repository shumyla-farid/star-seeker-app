import React from "react";
import { View, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "large",
  color = "#8b5cf6",
  className = "flex-1 justify-center items-center bg-background",
}: LoadingSpinnerProps) {
  return (
    <View className={className}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
