import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { routesAPI } from "../api/routesAPI";
import { gatesAPI } from "../../gates/api/gatesAPI";
import { useQuery } from "@tanstack/react-query";
import { useRoutesStore } from "../store/routesStore";

export default function RouteFinderScreen() {
  const [fromGate, setFromGate] = useState("");
  const [toGate, setToGate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const { addSearchToHistory, toggleFavorite, favorites, loadData } =
    useRoutesStore();

  useEffect(() => {
    loadData();
  }, []);

  const { data: gates = [] } = useQuery({
    queryKey: ["gates"],
    queryFn: () => gatesAPI.getAll(),
  });

  const findRouteQuery = useQuery({
    queryKey: ["routes", fromGate, toGate],
    queryFn: () => routesAPI.getAllRoutes(fromGate, toGate),
    enabled: false,
    retry: false,
  });

  const sortedRoutes = findRouteQuery.data
    ? [...findRouteQuery.data].sort((a, b) => a.totalCost - b.totalCost)
    : [];

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

  const filteredFromGates = gates.filter(
    (g) =>
      g.code.toLowerCase().includes(searchFrom.toLowerCase()) ||
      g.name.toLowerCase().includes(searchFrom.toLowerCase()),
  );

  const filteredToGates = gates.filter(
    (g) =>
      g.code.toLowerCase().includes(searchTo.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTo.toLowerCase()),
  );

  const getGateDisplay = (code: string) => {
    const gate = gates.find((g) => g.code === code);
    return gate ? `${gate.code} - ${gate.name}` : "Select gate";
  };

  const handleSelectFromGate = (code: string) => {
    setFromGate(code);
    setShowFromPicker(false);
    setSearchFrom("");
  };

  const handleSelectToGate = (code: string) => {
    setToGate(code);
    setShowToPicker(false);
    setSearchTo("");
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-4">
          <Animated.Text
            entering={FadeInDown.springify()}
            className="text-2xl font-bold mb-6 text-text"
          >
            Find Available Routes
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="bg-card p-4 rounded-lg mb-4"
          >
            <Text className="text-sm font-semibold mb-2 text-text">
              From Gate
            </Text>
            <TouchableOpacity
              className="p-4 rounded-lg border border-gray-600"
              onPress={() => setShowFromPicker(true)}
            >
              <Text className={fromGate ? "text-text" : "text-gray-400"}>
                {fromGate ? getGateDisplay(fromGate) : "Select start gate"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="bg-card p-4 rounded-lg mb-6"
          >
            <Text className="text-sm font-semibold mb-2 text-text">
              To Gate
            </Text>
            <TouchableOpacity
              className="p-4 rounded-lg border border-gray-600"
              onPress={() => setShowToPicker(true)}
            >
              <Text className={toGate ? "text-text" : "text-gray-400"}>
                {toGate ? getGateDisplay(toGate) : "Select destination gate"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {error && (
            <Animated.View
              entering={ZoomIn}
              className="p-4 rounded-lg mb-4 bg-red-900/50"
            >
              <Text className="text-center text-red-300">{error}</Text>
            </Animated.View>
          )}

          <TouchableOpacity
            className="py-4 rounded-lg mb-6 bg-primary"
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
              <Text className="text-xl font-bold mb-4 text-text">
                {sortedRoutes.length} Route{sortedRoutes.length > 1 ? "s" : ""}{" "}
                Found 🎯
              </Text>

              {sortedRoutes.map((route, routeIndex) => {
                const isCheapest = routeIndex === 0;

                return (
                  <Animated.View
                    key={routeIndex}
                    entering={FadeInDown.delay(routeIndex * 100).springify()}
                    className="p-5 rounded-xl mb-4 bg-card border-l-4"
                    style={{
                      borderLeftColor: isCheapest ? "#22c55e" : "#6d28d9",
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View
                        className="px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: isCheapest
                            ? "#22c55e30"
                            : "#6d28d930",
                        }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: isCheapest ? "#22c55e" : "#a78bfa" }}
                        >
                          {isCheapest
                            ? "🏆 CHEAPEST"
                            : `Option ${routeIndex + 1}`}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <TouchableOpacity
                          onPress={() => handleToggleFavorite(route)}
                          className={`mr-3 px-3 py-2 rounded-lg ${
                            isRouteFavorite(route)
                              ? "bg-tertiary-400/25"
                              : "bg-gray-700"
                          }`}
                        >
                          <Text className="text-2xl">
                            {isRouteFavorite(route) ? "⭐" : "☆"}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          className="text-3xl font-bold"
                          style={{ color: isCheapest ? "#22c55e" : "#a78bfa" }}
                        >
                          ${route.totalCost}
                        </Text>
                        <Text className="text-xs ml-1 text-gray-400">HU</Text>
                      </View>
                    </View>

                    <View className="mb-3 pb-3 border-b border-gray-700">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-xs mr-2 text-gray-400">
                          From:
                        </Text>
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
                      {route.route.map((gateCode, index) => (
                        <View key={index} className="flex-row items-center">
                          <View className="px-3 py-1.5 rounded mr-2 mb-2 bg-primary-700">
                            <Text
                              className="text-white font-bold text-sm"
                              style={{ fontFamily: "monospace" }}
                            >
                              {gateCode}
                            </Text>
                          </View>
                          {index < route.route.length - 1 && (
                            <Text className="text-lg mr-2 mb-2 text-gray-300">
                              →
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>

                    <Text className="text-xs mt-2 text-gray-500">
                      {route.route.length} stops • {route.route.length - 1} jump
                      {route.route.length - 1 !== 1 ? "s" : ""}
                    </Text>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* From Gate Picker Modal */}
      <Modal
        visible={showFromPicker}
        animationType="slide"
        onRequestClose={() => setShowFromPicker(false)}
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="p-4 border-b border-gray-700">
            <Text className="text-xl font-bold mb-4 text-text">
              Select Start Gate
            </Text>
            <TextInput
              className="p-3 rounded-lg border border-gray-600 text-text"
              placeholder="Search gates..."
              placeholderTextColor="#9ca3af"
              value={searchFrom}
              onChangeText={setSearchFrom}
            />
          </View>

          <FlatList
            data={filteredFromGates}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 border-b border-gray-700"
                onPress={() => handleSelectFromGate(item.code)}
              >
                <Text className="text-lg font-bold mb-1 text-accent">
                  {item.code}
                </Text>
                <Text className="text-text">{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            className="p-4 m-4 rounded-lg bg-primary"
            onPress={() => setShowFromPicker(false)}
          >
            <Text className="text-white text-center text-lg font-bold">
              Close
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* To Gate Picker Modal */}
      <Modal
        visible={showToPicker}
        animationType="slide"
        onRequestClose={() => setShowToPicker(false)}
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="p-4 border-b border-gray-700">
            <Text className="text-xl font-bold mb-4 text-text">
              Select Destination Gate
            </Text>
            <TextInput
              className="p-3 rounded-lg border border-gray-600 text-text"
              placeholder="Search gates..."
              placeholderTextColor="#9ca3af"
              value={searchTo}
              onChangeText={setSearchTo}
            />
          </View>

          <FlatList
            data={filteredToGates}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 border-b border-gray-700"
                onPress={() => handleSelectToGate(item.code)}
              >
                <Text className="text-lg font-bold mb-1 text-accent">
                  {item.code}
                </Text>
                <Text className="text-text">{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            className="p-4 m-4 rounded-lg bg-primary"
            onPress={() => setShowToPicker(false)}
          >
            <Text className="text-white text-center text-lg font-bold">
              Close
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </>
  );
}
