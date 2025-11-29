import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string;
}

export function InfoRow({
  icon,
  iconColor,
  iconBgColor,
  label,
  value,
}: InfoRowProps) {
  return (
    <View className="flex-row items-center justify-between mb-4 bg-background/50 p-4 rounded-lg">
      <View className="flex-row items-center flex-1">
        <View className={`${iconBgColor} p-2 rounded-full mr-3`}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text className="text-sm text-gray-400">{label}</Text>
      </View>
      <Text className="text-lg font-bold text-text">{value}</Text>
    </View>
  );
}

