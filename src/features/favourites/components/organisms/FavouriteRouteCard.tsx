import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeOutRight, Layout } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { RouteStopsPath } from "../../../routes/components/molecules/RouteStopsPath";

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
    <Animated.View
      exiting={FadeOutRight.duration(300)}
      layout={Layout.springify()}
      className="p-5 rounded-xl mb-4 bg-card border-l-4"
      style={{
        borderLeftColor: "#a78bfa",
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text className="text-3xl font-bold" style={{ color: "#a78bfa" }}>
            ${route.totalCost}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onDelete(route.id)}
          className="px-3 py-2 rounded-lg bg-red-500/20"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View className="mb-3 pb-3 border-b border-gray-700">
        <View className="flex-row items-center mb-1">
          <Text className="text-xs mr-2 text-gray-400">From:</Text>
          <Text className="text-sm font-semibold text-text">
            {route.from.code} - {route.from.name}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-xs mr-2 text-gray-400">To:</Text>
          <Text className="text-sm font-semibold text-text">
            {route.to.code} - {route.to.name}
          </Text>
        </View>
      </View>

      <RouteStopsPath stops={route.route} />

      <View className="flex-row justify-end items-center mt-2">
        <Text className="text-xs text-gray-500">
          Saved {new Date(route.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </Animated.View>
  );
}
