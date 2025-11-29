import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface JourneyCostDisplayProps {
  amount: number;
  currency: string;
  currencySymbol: string;
}

export function JourneyCostDisplay({
  amount,
  currency,
  currencySymbol,
}: JourneyCostDisplayProps) {
  return (
    <View className="bg-gradient-to-br from-accent/20 to-primary/20 p-10 rounded-xl mb-4 items-center border border-accent/30">
      <View className="flex-row items-center mb-2">
        <Ionicons name="cash" size={24} color="#a78bfa" />
        <Text className="text-sm text-gray-400 ml-2">Total Journey Cost</Text>
      </View>
      <View className="flex-row items-baseline">
        <Text className="text-5xl font-bold text-accent">
          {currencySymbol}
          {amount.toFixed(2)}
        </Text>
        <Text className="text-lg text-gray-400 ml-2">{currency}</Text>
      </View>
    </View>
  );
}

