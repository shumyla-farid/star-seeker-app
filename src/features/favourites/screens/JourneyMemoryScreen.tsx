import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { useRoutesStore } from "../../routes/store/routesStore";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function JourneyMemoryScreen() {
  const { theme } = useTheme();
  const { favorites, isLoading, loadData, removeFavorite } = useRoutesStore();

  const bgColor =
    theme === "purple" ? "bg-purple-space-bg" : "bg-teal-space-bg";
  const cardColor =
    theme === "purple" ? "bg-purple-space-card" : "bg-teal-space-card";
  const textColor =
    theme === "purple" ? "text-purple-space-text" : "text-teal-space-text";
  const accentColor =
    theme === "purple" ? "text-purple-space-accent" : "text-teal-space-accent";

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${bgColor}`}
        style={{ backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419" }}
      >
        <ActivityIndicator
          size="large"
          color={theme === "purple" ? "#8b5cf6" : "#14b8a6"}
        />
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 ${bgColor}`}
      style={{ backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419" }}
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
    >
      <Animated.Text
        entering={FadeInDown.springify()}
        className={`text-2xl font-bold ${textColor} mb-6`}
      >
        Favorite Routes ⭐
      </Animated.Text>

      {favorites.length === 0 ? (
        <Animated.View
          entering={FadeInUp}
          className="flex-1 justify-center items-center"
        >
          <Text className="text-6xl mb-4">🌟</Text>
          <Text
            className="text-lg text-center mb-2"
            style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
          >
            No Favorite Routes Yet
          </Text>
          <Text className="text-sm text-center" style={{ color: "#9ca3af" }}>
            Tap the star icon on any route to save it here
          </Text>
        </Animated.View>
      ) : (
        <View>
          {favorites.map((route: any, index: number) => (
            <Animated.View
              key={route.id}
              entering={FadeInDown.delay(index * 100).springify()}
              className={`${cardColor} p-5 rounded-xl shadow-lg mb-4`}
              style={{
                backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
              }}
            >
              {/* Header with favorite star */}
              <View className="flex-row items-center justify-between mb-3">
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      theme === "purple" ? "#fbbf2430" : "#fbbf2430",
                  }}
                >
                  <Text className="text-xs font-bold text-yellow-500">
                    ⭐ FAVORITE
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => removeFavorite(route.id)}
                    className="mr-2 p-2"
                  >
                    <Text className="text-xl">⭐</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeFavorite(route.id)}
                    className="mr-3 p-2"
                  >
                    <Text className="text-xl">🗑️</Text>
                  </TouchableOpacity>
                  <Text
                    className="text-3xl font-bold"
                    style={{
                      color: theme === "purple" ? "#a78bfa" : "#2dd4bf",
                    }}
                  >
                    ${route.totalCost}
                  </Text>
                  <Text className="text-xs ml-1" style={{ color: "#9ca3af" }}>
                    HU
                  </Text>
                </View>
              </View>

              {/* From/To Info */}
              <View className="mb-3 pb-3 border-b border-gray-700">
                <View className="flex-row items-center mb-1">
                  <Text className="text-xs mr-2" style={{ color: "#9ca3af" }}>
                    From:
                  </Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
                    }}
                  >
                    {route.from.code} - {route.from.name}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-xs mr-2" style={{ color: "#9ca3af" }}>
                    To:
                  </Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
                    }}
                  >
                    {route.to.code} - {route.to.name}
                  </Text>
                </View>
              </View>

              {/* Route Path */}
              <View className="flex-row flex-wrap items-center">
                {route.route.map((gateCode: string, gateIndex: number) => (
                  <View key={gateIndex} className="flex-row items-center">
                    <View
                      className="px-3 py-1.5 rounded-md mr-2 mb-2"
                      style={{
                        backgroundColor:
                          theme === "purple" ? "#6366f1" : "#0d9488",
                      }}
                    >
                      <Text className="text-white font-mono text-sm font-bold">
                        {gateCode}
                      </Text>
                    </View>
                    {gateIndex < route.route.length - 1 && (
                      <Text
                        className="text-lg mr-2 mb-2"
                        style={{ color: "#d1d5db" }}
                      >
                        →
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              {/* Route Stats */}
              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-700">
                <Text className="text-xs" style={{ color: "#6b7280" }}>
                  {route.route.length} stops • {route.route.length - 1} jump
                  {route.route.length - 1 !== 1 ? "s" : ""}
                </Text>
                <Text className="text-xs" style={{ color: "#6b7280" }}>
                  Saved {new Date(route.timestamp).toLocaleDateString()}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
