import React from "react";
import { View, Text } from "react-native";

interface GateCodeBadgeProps {
  gateCode: string;
  showArrow?: boolean;
}

export function GateCodeBadge({ gateCode, showArrow = false }: GateCodeBadgeProps) {
  return (
    <View className="flex-row items-center">
      <View className="px-3 py-1.5 rounded mr-2 mb-2 bg-primary-700">
        <Text
          className="text-white font-bold text-sm"
          style={{ fontFamily: "monospace" }}
        >
          {gateCode}
        </Text>
      </View>
      {showArrow && (
        <Text className="text-lg mr-2 mb-2 text-gray-300">→</Text>
      )}
    </View>
  );
}

