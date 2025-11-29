import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { RouteStopsPath } from "../molecules/RouteStopsPath";

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
  isCheapest: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function RouteCard({
  route,
  index = 0,
  isCheapest,
  isFavorite,
  onToggleFavorite,
}: RouteCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="p-5 rounded-xl mb-4 bg-card border-l-4"
      style={{
        borderLeftColor: isCheapest ? "#22c55e" : "#6d28d9",
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View
          className="px-3 py-1 rounded-full"
          style={{
            backgroundColor: isCheapest ? "#22c55e30" : "#6d28d930",
          }}
        >
          <View className="flex-row items-center">
            {isCheapest && (
              <Ionicons
                name="trophy"
                size={14}
                color="#fbbf24"
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              className="text-xs font-bold"
              style={{
                color: isCheapest ? "#22c55e" : "#a78bfa",
              }}
            >
              {isCheapest ? "CHEAPEST" : `Option ${index + 1}`}
            </Text>
          </View>
        </View>

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
      </View>

      <View className="flex-row items-start justify-between mb-3 pb-3 border-b border-gray-700">
        <View className="flex-1">
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

        <View className="items-end ml-3">
          <Text
            className="text-3xl font-bold"
            style={{ color: isCheapest ? "#22c55e" : "#a78bfa" }}
          >
            £{route.totalCost}
          </Text>
        </View>
      </View>

      <RouteStopsPath stops={route.route} />
    </Animated.View>
  );
}
