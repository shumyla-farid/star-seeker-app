import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteCard } from "./RouteCard";

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

interface RoutesListProps {
  routes: Route[];
  isRouteFavorite: (route: Route) => boolean;
  onToggleFavorite: (route: Route) => void;
}

export function RoutesList({
  routes,
  isRouteFavorite,
  onToggleFavorite,
}: RoutesListProps) {
  if (routes.length === 0) return null;

  return (
    <View>
      <View className="flex-row items-center mb-4">
        <Text className="text-xl font-bold text-text mr-2">
          {routes.length} Route{routes.length > 1 ? "s" : ""} Found
        </Text>
        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
      </View>

      {routes.map((route, routeIndex) => (
        <RouteCard
          key={routeIndex}
          route={route}
          index={routeIndex}
          isCheapest={routeIndex === 0}
          isFavorite={isRouteFavorite(route)}
          onToggleFavorite={() => onToggleFavorite(route)}
        />
      ))}
    </View>
  );
}

