import React from "react";
import { Text } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";

interface ErrorBannerProps {
  message: string;
  variant?: "error" | "warning";
}

export function ErrorBanner({ message, variant = "error" }: ErrorBannerProps) {
  const bgColor = variant === "error" ? "bg-red-900/50" : "bg-yellow-900/50";
  const textColor = variant === "error" ? "text-red-300" : "text-yellow-300";

  return (
    <Animated.View
      entering={ZoomIn}
      className={`p-4 rounded-lg ${bgColor} mb-4`}
    >
      <Text className={`text-center ${textColor}`}>{message}</Text>
    </Animated.View>
  );
}
