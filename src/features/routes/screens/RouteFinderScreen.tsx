import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Animated, {
  FadeInDown,
  ZoomIn,
  SlideInRight,
} from "react-native-reanimated";
import { routesAPI } from "../api/routesAPI";
import { gatesAPI } from "../../gates/api/gatesAPI";
import { Gate } from "../../../types";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { useRoutesStore } from "../store/routesStore";

export default function RouteFinderScreen() {
  const [fromGate, setFromGate] = useState("");
  const [toGate, setToGate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Zustand store
  const { addSearchToHistory, toggleFavorite, favorites, loadData } =
    useRoutesStore();

  useEffect(() => {
    loadData();
  }, []);

  const { data: gates = [] } = useQuery({
    queryKey: ["gates"],
    queryFn: () => gatesAPI.getAll(),
  });

  const bgColor =
    theme === "purple" ? "bg-purple-space-bg" : "bg-teal-space-bg";
  const primaryColor =
    theme === "purple" ? "bg-purple-space-primary" : "bg-teal-space-primary";
  const cardColor =
    theme === "purple" ? "bg-purple-space-card" : "bg-teal-space-card";
  const textColor =
    theme === "purple" ? "text-purple-space-text" : "text-teal-space-text";
  const accentColor =
    theme === "purple" ? "text-purple-space-accent" : "text-teal-space-accent";

  const findRouteQuery = useQuery({
    queryKey: ["routes", fromGate, toGate],
    queryFn: () => routesAPI.getAllRoutes(fromGate, toGate),
    enabled: false,
    retry: false,
  });

  // Sort routes by cost (cheapest first)
  const sortedRoutes = findRouteQuery.data
    ? [...findRouteQuery.data].sort((a, b) => a.totalCost - b.totalCost)
    : [];

  // Log the data for debugging
  if (findRouteQuery.data) {
    console.log("Routes data:", JSON.stringify(findRouteQuery.data, null, 2));
    console.log("Number of routes:", findRouteQuery.data.length);
  }

  // Save routes to history when found
  useEffect(() => {
    if (findRouteQuery.isSuccess && sortedRoutes.length > 0) {
      sortedRoutes.forEach((route) => {
        addSearchToHistory(route);
      });
    }
  }, [findRouteQuery.isSuccess, sortedRoutes.length]);

  const handleFindRoute = () => {
    if (!fromGate || !toGate) {
      setError("Please select both gates");
      return;
    }

    if (fromGate === toGate) {
      setError("Start and destination must be different");
      return;
    }

    setError(null);
    findRouteQuery.refetch();
  };

  const getRouteId = (route: (typeof sortedRoutes)[0]) => {
    return `${route.from.code}-${route.to.code}-${
      route.totalCost
    }-${route.route.join("-")}`;
  };

  const isRouteFavorite = (route: (typeof sortedRoutes)[0]) => {
    const routeId = getRouteId(route);
    return favorites.some((f: any) => f.id === routeId);
  };

  const handleToggleFavorite = (route: (typeof sortedRoutes)[0]) => {
    const routeId = getRouteId(route);
    toggleFavorite(routeId);
  };

  return (
    <ScrollView
      className={`flex-1 ${bgColor}`}
      style={{
        backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419",
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4">
        <Animated.Text
          entering={FadeInDown.springify()}
          className={`text-2xl font-bold ${textColor} mb-6`}
        >
          Find Available Routes
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-4`}
        >
          <Text className={`text-sm font-semibold ${textColor} mb-2`}>
            From Gate
          </Text>
          <View
            className="border border-gray-600 rounded-lg overflow-hidden"
            style={{
              backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
            }}
          >
            <Picker
              selectedValue={fromGate}
              onValueChange={setFromGate}
              style={{
                color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
                backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
              }}
              dropdownIconColor={theme === "purple" ? "#8b5cf6" : "#14b8a6"}
            >
              <Picker.Item label="Select start gate" value="" />
              {gates.map((gate) => (
                <Picker.Item
                  key={gate.code}
                  label={`${gate.code} - ${gate.name}`}
                  value={gate.code}
                />
              ))}
            </Picker>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-6`}
        >
          <Text className={`text-sm font-semibold ${textColor} mb-2`}>
            To Gate
          </Text>
          <View
            className="border border-gray-600 rounded-lg overflow-hidden"
            style={{
              backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
            }}
          >
            <Picker
              selectedValue={toGate}
              onValueChange={setToGate}
              style={{
                color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
                backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
              }}
              dropdownIconColor={theme === "purple" ? "#8b5cf6" : "#14b8a6"}
            >
              <Picker.Item label="Select destination gate" value="" />
              {gates.map((gate) => (
                <Picker.Item
                  key={gate.code}
                  label={`${gate.code} - ${gate.name}`}
                  value={gate.code}
                />
              ))}
            </Picker>
          </View>
        </Animated.View>

        {error && (
          <Animated.View
            entering={ZoomIn}
            className="bg-red-900 bg-opacity-50 p-4 rounded-lg mb-4"
          >
            <Text className="text-red-300 text-center">{error}</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          className={`${primaryColor} py-4 rounded-lg mb-6`}
          style={{
            backgroundColor: theme === "purple" ? "#8b5cf6" : "#14b8a6",
          }}
          onPress={handleFindRoute}
          disabled={findRouteQuery.isLoading}
        >
          {findRouteQuery.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Find Routes
            </Text>
          )}
        </TouchableOpacity>

        {sortedRoutes.length > 0 && (
          <View>
            <Text
              className="text-xl font-bold mb-4"
              style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
            >
              {sortedRoutes.length} Route{sortedRoutes.length > 1 ? "s" : ""}{" "}
              Found 🎯
            </Text>

            {sortedRoutes.map((route, routeIndex) => (
              <Animated.View
                key={routeIndex}
                entering={FadeInDown.delay(routeIndex * 100).springify()}
                className={`${cardColor} p-5 rounded-xl shadow-lg mb-4`}
                style={{
                  backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
                  borderLeftWidth: 4,
                  borderLeftColor:
                    routeIndex === 0
                      ? theme === "purple"
                        ? "#22c55e"
                        : "#10b981"
                      : theme === "purple"
                      ? "#6366f1"
                      : "#0d9488",
                }}
              >
                {/* Rank Badge and Favorite Button */}
                <View className="flex-row items-center justify-between mb-3">
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        routeIndex === 0
                          ? theme === "purple"
                            ? "#22c55e30"
                            : "#10b98130"
                          : theme === "purple"
                          ? "#6366f130"
                          : "#0d948830",
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{
                        color:
                          routeIndex === 0
                            ? theme === "purple"
                              ? "#22c55e"
                              : "#10b981"
                            : theme === "purple"
                            ? "#a78bfa"
                            : "#2dd4bf",
                      }}
                    >
                      {routeIndex === 0
                        ? "🏆 CHEAPEST"
                        : `Option ${routeIndex + 1}`}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => handleToggleFavorite(route)}
                      className="mr-3 px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: isRouteFavorite(route)
                          ? theme === "purple"
                            ? "#fbbf2440"
                            : "#fbbf2440"
                          : theme === "purple"
                          ? "#374151"
                          : "#374151",
                      }}
                    >
                      <Text className="text-2xl">
                        {isRouteFavorite(route) ? "⭐" : "☆"}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      className="text-3xl font-bold"
                      style={{
                        color:
                          routeIndex === 0
                            ? theme === "purple"
                              ? "#22c55e"
                              : "#10b981"
                            : theme === "purple"
                            ? "#a78bfa"
                            : "#2dd4bf",
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
                  {route.route.map((gateCode, index) => (
                    <View key={index} className="flex-row items-center">
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
                      {index < route.route.length - 1 && (
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

                {/* Route Stops Info */}
                <Text className="text-xs mt-2" style={{ color: "#6b7280" }}>
                  {route.route.length} stops • {route.route.length - 1} jump
                  {route.route.length - 1 !== 1 ? "s" : ""}
                </Text>
              </Animated.View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
