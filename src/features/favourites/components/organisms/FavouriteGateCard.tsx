import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { IconBadge } from "../../../../shared/components/atoms";
import { FavouriteGate } from "../../../../types";

interface FavouriteGateCardProps {
  savedGate: FavouriteGate;
  onDelete: (gateCode: string) => void;
  onNavigateToDetails: (gateCode: string) => void;
  index: number;
}

export function FavouriteGateCard({
  savedGate,
  onDelete,
  onNavigateToDetails,
  index,
}: FavouriteGateCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      exiting={FadeOutRight.duration(300)}
      layout={LinearTransition.springify()}
      className="rounded-xl mb-4 bg-card border-l-4 border-primary overflow-hidden"
    >
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            onPress={() => onNavigateToDetails(savedGate.code)}
            activeOpacity={0.7}
            className="flex-1 mr-3"
          >
            <View className="flex-row items-center">
              <IconBadge
                name="planet"
                size={28}
                backgroundColor="bg-primary/20"
                className="p-3 mr-3"
              />
              <View className="flex-1">
                <Text className="text-3xl font-bold text-primary">
                  {savedGate.code}
                </Text>
                <Text className="text-lg text-text">{savedGate.name}</Text>
              </View>
              {savedGate.links && (
                <View className="items-center ml-3 mr-2">
                  <Ionicons name="analytics" size={20} color="#8b5cf6" />
                  <Text className="text-xl font-bold text-primary mt-1">
                    {savedGate.links.length}
                  </Text>
                  <Text className="text-xs text-gray-400 text-center">
                    Links
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-col items-center justify-center gap-3">
            <TouchableOpacity
              onPress={() => onDelete(savedGate.code)}
              className="p-2.5 bg-red-500/20 rounded-lg"
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onNavigateToDetails(savedGate.code)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={24} color="#8b5cf6" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-3 pt-3 border-t border-gray-700">
          <Text className="text-xs text-gray-500">
            Saved {new Date(savedGate.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
