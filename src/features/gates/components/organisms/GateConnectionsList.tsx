import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { GateLink } from "../../../../types";
import { GateConnectionItem } from "../molecules";

interface GateConnectionsListProps {
  links: GateLink[];
}

export function GateConnectionsList({ links }: GateConnectionsListProps) {
  if (!links || links.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      className="p-6 rounded-xl mb-4 bg-card"
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Ionicons name="git-network" size={24} color="#8b5cf6" />
          <Text className="text-lg font-bold ml-2 text-text">
            Connected Gates
          </Text>
        </View>
      </View>

      <View>
        {links.map((link, index) => (
          <GateConnectionItem
            key={link.code}
            code={link.code}
            hu={link.hu}
            index={index}
          />
        ))}
      </View>
    </Animated.View>
  );
}

