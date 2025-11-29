import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PassengersInfoCardProps {
  count: string;
}

export function PassengersInfoCard({ count }: PassengersInfoCardProps) {
  return (
    <View className="flex-row items-center bg-background/50 p-4 rounded-lg">
      <View className="bg-primary/20 p-2 rounded-full mr-3">
        <Ionicons name="people" size={20} color="#8b5cf6" />
      </View>
      <Text className="text-sm text-gray-400 mr-2">Passenger(s):</Text>
      <Text className="text-lg font-bold text-text">{count}</Text>
    </View>
  );
}
