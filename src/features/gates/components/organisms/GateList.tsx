import React, { useCallback, useMemo } from "react";
import { View, FlatList } from "react-native";
import { GateCard } from "./GateCard";
import { FavouriteGate } from "../../../../types";
import { Gate } from "../../../../types";
import { useGatesStore } from "../../store/gatesStore";
import { EmptyState } from "../../../../shared/components/molecules";

interface GateListProps {
  gates: Gate[];
  isRefreshing: boolean;
  onRefresh: () => void;
  // favoriteGates: FavouriteGate[];
  onGatePress: (gateCode: string) => void;
}

export const GateList = React.memo(function GateList({
  gates,
  isRefreshing,
  onRefresh,
  //favoriteGates,
  onGatePress,
}: GateListProps) {
  const keyExtractor = useCallback((item: Gate) => item.code, []);

  const contentContainerStyle = useMemo(
    () => ({ flexGrow: 1, padding: 16, gap: 12 }),
    [],
  );

  const isFavorite = useGatesStore((state) => state.isFavoriteGate);
  const favoriteGates = useGatesStore((state) => state.favoriteGates);
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
        ListEmptyComponent={
          <EmptyState
            icon="planet-outline"
            title="No Gates Found"
            description="There is no data to be shown"
          />
        }
      />
    </View>
  );
});
