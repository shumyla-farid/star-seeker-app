import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatDisplayProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  value: string | number;
  label: string;
  valueClassName?: string;
}

export function StatDisplay({
  icon,
  iconColor = "#8b5cf6",
  value,
  label,
  valueClassName = "text-primary",
}: StatDisplayProps) {
  return (
    <View className="items-center">
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text className={`text-xl font-bold mt-1 ${valueClassName}`}>
        {value}
      </Text>
      <Text className="text-xs text-gray-400 text-center">{label}</Text>
    </View>
  );
}

