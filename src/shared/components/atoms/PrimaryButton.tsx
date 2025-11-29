import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface PrimaryButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PrimaryButton({
  onPress,
  title,
  isLoading = false,
  disabled = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`py-4 rounded-lg bg-primary ${className}`}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-center text-lg font-semibold">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

