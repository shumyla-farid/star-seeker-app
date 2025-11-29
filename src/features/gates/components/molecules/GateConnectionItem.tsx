import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { IconBadge } from "../../../../shared/components/atoms";

interface GateConnectionItemProps {
  code: string;
  hu: string;
  index: number;
}

export function GateConnectionItem({
  code,
  hu,
  index,
}: GateConnectionItemProps) {
  return (
    <Animated.View entering={FadeIn.delay(300 + index * 50)}>
      <View className="flex-row items-center justify-between p-4 mb-2 bg-background/50 rounded-lg active:bg-background/70">
        <View className="flex-row items-center flex-1">
          <IconBadge name="planet-outline" size={20} color="#8b5cf6" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-text">{code}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="cash-outline" size={14} color="#10b981" />
              <Text className="text-sm text-success ml-1">{hu} HU</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
