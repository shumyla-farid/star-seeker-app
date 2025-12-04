import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Gate } from "../../../../types";

interface GateCardProps {
  gate: Gate;
  isFavorite: boolean;
  onPress: (gateCode: string) => void;
  index: number;
}

export const GateCard = React.memo(function GateCard({
  gate,
  isFavorite,
  onPress,
  index,
}: GateCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      className={`p-6 rounded-xl border-l-4 ${
        isFavorite
          ? "bg-amber-500/10 border-amber-500"
          : "bg-card border-primary"
      }`}
    >
      <TouchableOpacity onPress={() => onPress(gate.code)} activeOpacity={0.7}>
        <View className="flex-row items-center">
          <View
            className={`p-3 rounded-full mr-3 ${
              isFavorite ? "bg-amber-500/20" : "bg-primary/20"
            }`}
          >
            <Ionicons
              name={"planet"}
              size={28}
              color={isFavorite ? "#f59e0b" : "#8b5cf6"}
            />
          </View>
          <View className="flex-1">
            <Text
              className={`text-3xl font-bold ${
                isFavorite ? "text-amber-500" : "text-primary"
              }`}
            >
              {gate.code}
            </Text>
            <Text className="text-lg text-text">{gate.name}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isFavorite ? "#f59e0b" : "#8b5cf6"}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});
