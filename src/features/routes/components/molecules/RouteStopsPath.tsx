import React from "react";
import { View, Text } from "react-native";
import { GateCodeBadge } from "../../../../shared/components/molecules";

interface RouteStopsPathProps {
  stops: string[];
}

export function RouteStopsPath({ stops }: RouteStopsPathProps) {
  return (
    <>
      <View className="flex-row flex-wrap items-center">
        {stops.map((gateCode, index) => (
          <GateCodeBadge
            key={index}
            gateCode={gateCode}
            showArrow={index < stops.length - 1}
          />
        ))}
      </View>

      <Text className="text-xs mt-2 text-gray-500">
        {stops.length} stops • {stops.length - 1} jump(s)
      </Text>
    </>
  );
}
