import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary";
  animated?: boolean;
}

export function Button({
  onPress,
  title,
  variant = "primary",
  animated = false,
}: ButtonProps) {
  const Component = animated ? AnimatedTouchable : TouchableOpacity;

  return (
    <Component
      {...(animated && { entering: FadeInDown })}
      onPress={onPress}
      className={`px-6 py-3 rounded-lg ${
        variant === "primary" ? "bg-primary" : "bg-card"
      }`}
    >
      <Text className="text-white text-base font-semibold">{title}</Text>
    </Component>
  );
}

