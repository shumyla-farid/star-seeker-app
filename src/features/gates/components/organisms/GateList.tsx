import React, { useCallback, useMemo } from "react";
import { View, FlatList } from "react-native";
import { GateCard } from "./GateCard";
import { FavouriteGate } from "../../../../types";
import { Gate } from "../../../../types";

interface GateListProps {
  gates: Gate[];
  isRefreshing: boolean;
  onRefresh: () => void;
  favoriteGates: FavouriteGate[];
  onGatePress: (gateCode: string) => void;
}

export const GateList = React.memo(function GateList({
  gates,
  isRefreshing,
  onRefresh,
  favoriteGates,
  onGatePress,
}: GateListProps) {
  const keyExtractor = useCallback((item: Gate) => item.code, []);

  const contentContainerStyle = useMemo(() => ({ padding: 16, gap: 12 }), []);

  const isFavorite = useCallback(
    (gateCode: string) => {
      return favoriteGates.some((gate) => gate.code === gateCode);
    },
    [favoriteGates],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Gate; index: number }) => (
      <GateCard
        gate={item}
        isFavorite={isFavorite(item.code)}
        onPress={onGatePress}
        index={index}
      />
    ),
    [favoriteGates, onGatePress],
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={gates}
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        className="flex-1"
        contentContainerStyle={contentContainerStyle}
        renderItem={renderItem}
      />
    </View>
  );
});
