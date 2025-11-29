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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoutesStore } from "../../routes/store/routesStore";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";

type TabType = "routes" | "gates";
type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function JourneyMemoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    favorites,
    favoriteGates,
    isLoading,
    loadData,
    removeFavorite,
    removeFavoriteGate,
  } = useRoutesStore();
  const [activeTab, setActiveTab] = useState<TabType>("routes");

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteRoute = (id: string) => {
    removeFavorite(id);
  };

  const handleDeleteGate = (gateCode: string) => {
    removeFavoriteGate(gateCode);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-2">
        <Animated.Text
          entering={FadeInDown.springify()}
          className="text-2xl font-bold mb-4 text-text"
        >
          Favorites ⭐
        </Animated.Text>

        {/* Tabs */}
        <View className="flex-row mb-4 bg-card rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab("routes")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "routes" ? "bg-primary" : "bg-transparent"
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "routes" ? "text-white" : "text-gray-400"
              }`}
            >
              Routes ({favorites.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("gates")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "gates" ? "bg-primary" : "bg-transparent"
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "gates" ? "text-white" : "text-gray-400"
              }`}
            >
              Gates ({favoriteGates.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >
        {activeTab === "routes" ? (
          favorites.length === 0 ? (
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
              {favorites.map((route: any, index: number) => (
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
                      <Text className="text-xs ml-1 mr-3 text-gray-400">
                        HU
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteRoute(route.id)}
                        className="p-2 bg-red-500/20 rounded-lg"
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#ef4444"
                        />
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
                          <Text className="text-lg mr-2 mb-2 text-gray-300">
                            →
                          </Text>
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
          )
        ) : // Gates Tab
        favoriteGates.length === 0 ? (
          <Animated.View
            entering={FadeInUp}
            className="flex-1 justify-center items-center"
          >
            <Ionicons
              name="planet-outline"
              size={80}
              color="#a78bfa"
              className="mb-4"
            />
            <Text className="text-lg text-center mb-2 text-text mt-4">
              No Favorite Gates Yet
            </Text>
            <Text className="text-sm text-center text-gray-400">
              Tap the star icon on any gate to save it here
            </Text>
          </Animated.View>
        ) : (
          <View>
            {favoriteGates.map((savedGate, index: number) => (
              <Animated.View
                key={savedGate.id}
                exiting={FadeOutRight.duration(300)}
                layout={Layout.springify()}
                className="rounded-xl mb-4 bg-card border-l-4 border-primary overflow-hidden"
              >
                <View className="p-6">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="px-3 py-1 rounded-full bg-tertiary-400/25 flex-row items-center">
                      <Ionicons name="star" size={12} color="#c084fc" />
                      <Text className="text-xs font-bold text-tertiary-400 ml-1">
                        FAVORITE
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleDeleteGate(savedGate.gate.code)}
                      className="p-2 bg-red-500/20 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("GateDetails", {
                        gateCode: savedGate.gate.code,
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      <View className="bg-primary/20 p-3 rounded-full mr-3">
                        <Ionicons name="planet" size={28} color="#8b5cf6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-3xl font-bold text-primary">
                          {savedGate.gate.code}
                        </Text>
                        <Text className="text-lg text-text">
                          {savedGate.gate.name}
                        </Text>
                      </View>
                      {savedGate.gate.links && (
                        <View className="items-center ml-3 mr-2">
                          <Ionicons
                            name="analytics"
                            size={20}
                            color="#8b5cf6"
                          />
                          <Text className="text-xl font-bold text-primary mt-1">
                            {savedGate.gate.links.length}
                          </Text>
                          <Text className="text-xs text-gray-400 text-center">
                            Links
                          </Text>
                        </View>
                      )}
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#8b5cf6"
                      />
                    </View>

                    <View className="mt-3 pt-3 border-t border-gray-700">
                      <Text className="text-xs text-gray-500">
                        Saved{" "}
                        {new Date(savedGate.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
