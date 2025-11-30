import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { EmptyState } from "../../../../shared/components/molecules";
import { FavouriteRouteCard } from "./FavouriteRouteCard";
import { SavedRoute } from "../../types";

interface FavouriteRoutesTabContentProps {
  routes: SavedRoute[];
  onDeleteRoute: (id: string) => void;
}

export function FavouriteRoutesTabContent({
  routes,
  onDeleteRoute,
}: FavouriteRoutesTabContentProps) {
  const renderItem: ListRenderItem<SavedRoute> = ({ item }) => (
    <FavouriteRouteCard route={item} onDelete={onDeleteRoute} />
  );

  return (
    <FlatList
      data={routes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          icon="navigate-outline"
          title="No Favourite Routes Yet"
          description="Tap the star icon on any route to save it here"
        />
      }
    />
  );
}
