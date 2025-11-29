import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { gatesAPI } from "../api/gatesAPI";
import { Gate } from "../../../types";
import { useRoutesStore } from "../../routes/store/routesStore";

export default function GateDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { gateCode } = route.params as { gateCode: string };
  const [gate, setGate] = useState<Gate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleFavoriteGate, isFavoriteGate } = useRoutesStore();
  const isFavorite = gate ? isFavoriteGate(gate.code) : false;

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
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header Card */}
      <Animated.View
        entering={FadeInDown.springify()}
        className="p-6 rounded-xl mb-4 bg-card border-l-4 border-primary"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1" />
          <TouchableOpacity
            onPress={() => gate && toggleFavoriteGate(gate)}
            className="p-2 bg-primary/20 rounded-lg"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? "#fbbf24" : "#8b5cf6"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <View className="bg-primary/20 p-3 rounded-full mr-3">
            <Ionicons name="planet" size={28} color="#8b5cf6" />
          </View>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-primary">{gate.code}</Text>
            <Text className="text-lg text-text">{gate.name}</Text>
          </View>
          <View className="items-center ml-3">
            <Ionicons name="analytics" size={20} color="#8b5cf6" />
            <Text className="text-xl font-bold text-primary mt-1">
              {gate.links?.length || 0}
            </Text>
            <Text className="text-xs text-gray-400 text-center">Links</Text>
          </View>
        </View>
      </Animated.View>

      {/* Links/Connections Card */}
      {gate.links && gate.links.length > 0 && (
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
            {gate.links.map((link, index) => (
              <Animated.View
                key={link.code}
                entering={FadeIn.delay(300 + index * 50)}
              >
                <View className="flex-row items-center justify-between p-4 mb-2 bg-background/50 rounded-lg active:bg-background/70">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-primary/20 p-2 rounded-full">
                      <Ionicons
                        name="planet-outline"
                        size={20}
                        color="#8b5cf6"
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-base font-semibold text-text">
                        {link.code}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons
                          name="cash-outline"
                          size={14}
                          color="#10b981"
                        />
                        <Text className="text-sm text-success ml-1">
                          {link.hu} HU
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}
