import React from "react";
import { View, FlatList } from "react-native";
import { GateCard } from "./GateCard";

interface Gate {
  code: string;
  name: string;
}

interface GateListProps {
  gates: Gate[];
  isRefreshing: boolean;
  onRefresh: () => void;
  isFavoriteGate: (code: string) => boolean;
  onGatePress: (gateCode: string) => void;
}

export function GateList({
  gates,
  isRefreshing,
  onRefresh,
  isFavoriteGate,
  onGatePress,
}: GateListProps) {
  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={gates}
        keyExtractor={(item) => item.code}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item, index }) => (
          <GateCard
            gate={item}
            isFavorite={isFavoriteGate(item.code)}
            onPress={() => onGatePress(item.code)}
            index={index}
          />
        )}
      />
    </View>
  );
}
