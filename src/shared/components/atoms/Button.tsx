import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  onPress,
  title,
  isLoading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`py-4 rounded-lg bg-primary ${className}`}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" testID="loading" />
      ) : (
        <Text className="text-white text-center text-lg font-semibold">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

