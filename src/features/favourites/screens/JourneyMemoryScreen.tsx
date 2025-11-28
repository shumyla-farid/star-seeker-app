import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutRight,
  Layout,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRoutesStore } from "../../routes/store/routesStore";

export default function JourneyMemoryScreen() {
  const { favorites, isLoading, loadData, removeFavorite } = useRoutesStore();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      removeFavorite(id);
    }, 400);
  };

  const visibleFavorites = favorites.filter(
    (route: any) => !deletingIds.has(route.id),
  );

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
          <Ionicons
            name="star-outline"
            size={80}
            color="#a78bfa"
            className="mb-4"
          />
          <Text className="text-lg text-center mb-2 text-text mt-4">
            No Favorite Routes Yet
          </Text>
          <Text className="text-sm text-center text-gray-400">
            Tap the star icon on any route to save it here
          </Text>
        </Animated.View>
      ) : (
        <View>
          {visibleFavorites.map((route: any, index: number) => (
            <Animated.View
              key={route.id}
              exiting={FadeOutRight.duration(300)}
              layout={Layout.springify()}
              className="p-5 rounded-xl mb-4 bg-card"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="px-3 py-1 rounded-full bg-tertiary-400/25 flex-row items-center">
                  <Ionicons name="star" size={12} color="#c084fc" />
                  <Text className="text-xs font-bold text-tertiary-400 ml-1">
                    FAVORITE
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-3xl font-bold text-accent">
                    ${route.totalCost}
                  </Text>
                  <Text className="text-xs ml-1 mr-3 text-gray-400">HU</Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(route.id)}
                    className="p-2 bg-red-500/20 rounded-lg"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
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
