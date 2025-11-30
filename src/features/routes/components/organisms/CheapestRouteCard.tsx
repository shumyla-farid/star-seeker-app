import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteCard } from "../../../../shared/components/organisms";
import Animated, { FadeInDown } from "react-native-reanimated";

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
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function CheapestRouteCard({
  route,
  index = 0,
  isFavorite,
  onToggleFavorite,
}: RouteCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className={`p-5 rounded-xl mb-4 bg-card border-l-4 border-green-500`}
    >
      <RouteCard
        route={route}
        costClass={"text-green-500"}
        badgeIcon={"trophy"}
        badgeIconClass={"text-yellow-400"}
        badgeText={"CHEAPEST"}
        badgeBackgroundClass={"bg-green-500/20"}
        badgeTextClass={"text-green-500"}
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
    </Animated.View>
  );
}
