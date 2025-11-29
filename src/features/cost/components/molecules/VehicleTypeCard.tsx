import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VehicleTypeCardProps {
  name: string;
}

export function VehicleTypeCard({ name }: VehicleTypeCardProps) {
  return (
    <View className="flex-row items-center mb-4 bg-background/50 p-4 rounded-lg">
      <View className="bg-primary/20 p-2 rounded-full mr-3">
        <Ionicons name="car-sport" size={20} color="#8b5cf6" />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-gray-400 mb-1">Vehicle Type</Text>
        <Text className="text-lg font-bold text-text">{name}</Text>
      </View>
    </View>
  );
}

