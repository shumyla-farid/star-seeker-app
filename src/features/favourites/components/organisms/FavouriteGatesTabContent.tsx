import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { EmptyState } from "../../../../shared/components/molecules";
import { FavouriteGateCard } from "./FavouriteGateCard";
import { SavedGate } from "../../../gates/store/gatesStore";

interface FavouriteGatesTabContentProps {
  gates: SavedGate[];
  onDeleteGate: (gateCode: string) => void;
  onNavigateToDetails: (gateCode: string) => void;
}

export function FavouriteGatesTabContent({
  gates,
  onDeleteGate,
  onNavigateToDetails,
}: FavouriteGatesTabContentProps) {
  const renderItem: ListRenderItem<SavedGate> = ({ item }) => (
    <FavouriteGateCard
      savedGate={item}
      onDelete={onDeleteGate}
      onNavigateToDetails={onNavigateToDetails}
    />
  );

  return (
    <FlatList
      data={gates}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          icon="planet-outline"
          title="No Favourite Gates Yet"
          description="Tap the star icon on any gate to save it here"
        />
      }
    />
  );
}
