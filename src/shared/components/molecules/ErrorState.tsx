import React from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button } from "../atoms/Button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryButtonText?: string;
}

export function ErrorState({
  message,
  onRetry,
  retryButtonText = "Retry",
}: ErrorStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-4 bg-background">
      <Animated.Text
        entering={FadeInUp}
        className="text-base mb-4 text-center text-text"
      >
        {message}
      </Animated.Text>

      <Animated.View entering={FadeInDown}>
        <Button onPress={onRetry} title={retryButtonText} className="px-10" />
      </Animated.View>
    </View>
  );
}
