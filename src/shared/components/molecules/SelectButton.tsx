import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface SelectButtonProps {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
}

export function SelectButton({
  label,
  value,
  placeholder,
  onPress,
}: SelectButtonProps) {
  return (
    <TouchableOpacity
      className="p-4 rounded-lg border border-gray-600"
      onPress={onPress}
    >
      <Text className={value ? "text-text" : "text-gray-400"}>
        {value || placeholder}
      </Text>
    </TouchableOpacity>
  );
}

