import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteCard as SharedRouteCard } from "../../../../shared/components/organisms";

interface Gate {
  code: string;
  name: string;
}

interface Route {
  from: Gate;
  to: Gate;
  route: string[];
  totalCost: number;
}

interface RouteCardProps {
  route: Route;
  index?: number;
  borderClass?: string;
  costClass?: string;
  badgeIcon?: keyof typeof Ionicons.glyphMap;
  badgeIconClass?: string;
  badgeText?: string;
  badgeBackgroundClass?: string;
  badgeTextClass?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CheapestRouteCard({
  route,
  index = 0,
  borderClass,
  costClass,
  badgeIcon,
  badgeIconClass,
  badgeText,
  badgeBackgroundClass,
  badgeTextClass,
  isFavorite,
  onToggleFavorite,
}: RouteCardProps) {
  return (
    <SharedRouteCard
      route={route}
      index={index}
      borderClass={"border-green-500"}
      costClass={"text-green-500"}
      badgeIcon={"trophy"}
      badgeIconClass={"text-yellow-400"}
      badgeText={"CHEAPEST"}
      badgeBackgroundClass={"bg-green-500/20"}
      badgeTextClass={"text-green-500"}
      currencySymbol="£"
      animationDelay
      actions={
        <TouchableOpacity
          onPress={onToggleFavorite}
          className={`p-2 rounded-full ${
            isFavorite ? "bg-amber-500/20" : "bg-gray-700/50"
          }`}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={24}
            color={isFavorite ? "#f59e0b" : "#9ca3af"}
          />
        </TouchableOpacity>
      }
    />
  );
}
