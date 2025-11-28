import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import { gatesAPI } from "../api/gatesAPI";
import { Gate } from "../../../types";

export default function GateDetailsScreen() {
  const route = useRoute();
  const { gateCode } = route.params as { gateCode: string };
  const [gate, setGate] = useState<Gate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGateDetails();
  }, [gateCode]);

  const fetchGateDetails = async () => {
    try {
      setLoading(true);
      const data = await gatesAPI.getDetails(gateCode);
      setGate(data);
      setError(null);
    } catch (err) {
      setError("Failed to load gate details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (error || !gate) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-4">
        <Animated.Text
          entering={FadeInUp}
          className="text-base mb-4 text-center text-text"
        >
          {error}
        </Animated.Text>
        <TouchableOpacity
          onPress={fetchGateDetails}
          className="px-6 py-3 rounded-lg bg-primary"
        >
          <Text className="text-white text-base font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4">
        <Animated.View
          entering={FadeInDown.springify()}
          className="p-6 rounded-xl mb-4 bg-card"
        >
          <Text className="text-3xl font-bold mb-2 text-primary">
            {gate.code}
          </Text>
          <Text className="text-xl mb-1 text-text">{gate.name}</Text>
          <Text className="text-base text-gray-400">{gate.system}</Text>
        </Animated.View>

        {gate.coordinates && (
          <Animated.View
            entering={SlideInRight.delay(200).springify()}
            className="p-6 rounded-xl bg-card"
          >
            <Text className="text-lg font-bold mb-4 text-text">
              Spatial Coordinates
            </Text>
            <View>
              <View className="flex-row justify-between py-3 border-b border-gray-700">
                <Text className="text-base text-gray-400">X Axis</Text>
                <Text
                  className="text-base font-semibold text-text"
                  style={{ fontFamily: "monospace" }}
                >
                  {gate.coordinates.x.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between py-3 border-b border-gray-700">
                <Text className="text-base text-gray-400">Y Axis</Text>
                <Text
                  className="text-base font-semibold text-text"
                  style={{ fontFamily: "monospace" }}
                >
                  {gate.coordinates.y.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between py-3">
                <Text className="text-base text-gray-400">Z Axis</Text>
                <Text
                  className="text-base font-semibold text-text"
                  style={{ fontFamily: "monospace" }}
                >
                  {gate.coordinates.z.toFixed(2)}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
