import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteCard } from "../../../../shared/components/organisms";

interface FavouriteRoute {
  id: string;
  totalCost: number;
  from: { code: string; name: string };
  to: { code: string; name: string };
  route: string[];
  timestamp: number;
}

interface FavouriteRouteCardProps {
  route: FavouriteRoute;
  onDelete: (id: string) => void;
}

export function FavouriteRouteCard({
  route,
  onDelete,
}: FavouriteRouteCardProps) {
  return (
    <RouteCard
      route={route}
      borderClass="border-primary"
      costClass="text-primary"
      currencySymbol="£"
      exitAnimation
      badgeIcon="star"
      badgeIconClass="text-primary"
      badgeText={`Saved ${new Date(route.timestamp).toLocaleDateString()}`}
      badgeBackgroundClass="bg-primary/20"
      badgeTextClass="text-primary"
      actions={
        <TouchableOpacity
          onPress={() => onDelete(route.id)}
          className="px-3 py-2 rounded-lg bg-red-500/20"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      }
    />
  );
}
