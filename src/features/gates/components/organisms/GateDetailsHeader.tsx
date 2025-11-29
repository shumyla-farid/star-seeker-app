import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Gate } from "../../../../types";
import { GateFavoriteButton } from "../molecules";
import { StatDisplay } from "../../../../shared/components/atoms";

interface GateDetailsHeaderProps {
  gate: Gate;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function GateDetailsHeader({
  gate,
  isFavorite,
  onToggleFavorite,
}: GateDetailsHeaderProps) {
  return (
    <Animated.View
      entering={FadeInDown.springify()}
      className={`p-6 rounded-xl mb-4 border-l-4 ${
        isFavorite
          ? "bg-amber-500/10 border-amber-500"
          : "bg-card border-primary"
      }`}
    >
      <View className="flex-row items-center">
        <GateFavoriteButton
          isFavorite={isFavorite}
          onPress={onToggleFavorite}
        />
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
        <View className="ml-3">
          <StatDisplay
            icon="analytics"
            iconColor={isFavorite ? "#f59e0b" : "#8b5cf6"}
            value={gate.links?.length || 0}
            label="Links"
            valueClassName={isFavorite ? "text-amber-500" : "text-primary"}
          />
        </View>
      </View>
    </Animated.View>
  );
}

