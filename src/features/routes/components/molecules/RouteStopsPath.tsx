import React from "react";
import { View, Text } from "react-native";

interface RouteStopsPathProps {
  stops: string[];
}

export function RouteStopsPath({ stops }: RouteStopsPathProps) {
  return (
    <>
      <View className="flex-row flex-wrap items-center">
        {stops.map((gateCode, index) => (
          <View key={index} className="flex-row items-center">
            <View className="px-3 py-1.5 rounded mr-2 mb-2 bg-primary-700">
              <Text
                className="text-white font-bold text-sm"
                style={{ fontFamily: "monospace" }}
              >
                {gateCode}
              </Text>
            </View>
            {index < stops.length - 1 && (
              <Text className="text-lg mr-2 mb-2 text-gray-300">→</Text>
            )}
          </View>
        ))}
      </View>

      <Text className="text-xs mt-2 text-gray-500">
        {stops.length} stops • {stops.length - 1} jump
        {stops.length - 1 !== 1 ? "s" : ""}
      </Text>
    </>
  );
}

