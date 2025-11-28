import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRoutesStore } from "../../routes/store/routesStore";

export default function JourneyMemoryScreen() {
  const { favorites, isLoading, loadData, removeFavorite } = useRoutesStore();

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
    >
      <Animated.Text
        entering={FadeInDown.springify()}
        className="text-2xl font-bold mb-6 text-text"
      >
        Favorite Routes ⭐
      </Animated.Text>

      {favorites.length === 0 ? (
        <Animated.View
          entering={FadeInUp}
          className="flex-1 justify-center items-center"
        >
          <Text className="text-6xl mb-4">🌟</Text>
          <Text className="text-lg text-center mb-2 text-text">
            No Favorite Routes Yet
          </Text>
          <Text className="text-sm text-center text-gray-400">
            Tap the star icon on any route to save it here
          </Text>
        </Animated.View>
      ) : (
        <View>
          {favorites.map((route: any, index: number) => (
            <Animated.View
              key={route.id}
              entering={FadeInDown.delay(index * 100).springify()}
              className="p-5 rounded-xl mb-4 bg-card"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="px-3 py-1 rounded-full bg-tertiary-400/25">
                  <Text className="text-xs font-bold text-tertiary-400">
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
                  <Text className="text-3xl font-bold text-accent">
                    ${route.totalCost}
                  </Text>
                  <Text className="text-xs ml-1 text-gray-400">HU</Text>
                </View>
              </View>

              <View className="mb-3 pb-3 border-b border-gray-700">
                <View className="flex-row items-center mb-1">
                  <Text className="text-xs mr-2 text-gray-400">From:</Text>
                  <Text className="text-sm font-semibold text-text">
                    {route.from.code} - {route.from.name}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-xs mr-2 text-gray-400">To:</Text>
                  <Text className="text-sm font-semibold text-text">
                    {route.to.code} - {route.to.name}
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap items-center">
                {route.route.map((gateCode: string, gateIndex: number) => (
                  <View key={gateIndex} className="flex-row items-center">
                    <View className="px-3 py-1.5 rounded mr-2 mb-2 bg-primary-700">
                      <Text
                        className="text-white font-bold text-sm"
                        style={{ fontFamily: "monospace" }}
                      >
                        {gateCode}
                      </Text>
                    </View>
                    {gateIndex < route.route.length - 1 && (
                      <Text className="text-lg mr-2 mb-2 text-gray-300">→</Text>
                    )}
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-700">
                <Text className="text-xs text-gray-500">
                  {route.route.length} stops • {route.route.length - 1} jump
                  {route.route.length - 1 !== 1 ? "s" : ""}
                </Text>
                <Text className="text-xs text-gray-500">
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
