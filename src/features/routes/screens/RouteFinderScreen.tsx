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
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { routesAPI } from "../api/routesAPI";
import { gatesAPI } from "../../gates/api/gatesAPI";
import { useQuery } from "@tanstack/react-query";
import { useRoutesStore } from "../store/routesStore";

const BG_COLOR = "#0a0e27";
const CARD_BG_COLOR = "#1e1b4b";
const TEXT_COLOR = "#e9d5ff";
const PRIMARY_COLOR = "#8b5cf6";
const SECONDARY_COLOR = "#6d28d9";
const ACCENT_COLOR = "#a78bfa";

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
        style={{ flex: 1, backgroundColor: BG_COLOR }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ padding: 16 }}>
          <Animated.Text
            entering={FadeInDown.springify()}
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 24,
              color: TEXT_COLOR,
            }}
          >
            Find Available Routes
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{
              backgroundColor: CARD_BG_COLOR,
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: TEXT_COLOR,
              }}
            >
              From Gate
            </Text>
            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                borderColor: "#4b5563",
                borderWidth: 1,
              }}
              onPress={() => setShowFromPicker(true)}
            >
              <Text style={{ color: fromGate ? TEXT_COLOR : "#9ca3af" }}>
                {fromGate ? getGateDisplay(fromGate) : "Select start gate"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={{
              backgroundColor: CARD_BG_COLOR,
              padding: 16,
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: TEXT_COLOR,
              }}
            >
              To Gate
            </Text>
            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                borderColor: "#4b5563",
                borderWidth: 1,
              }}
              onPress={() => setShowToPicker(true)}
            >
              <Text style={{ color: toGate ? TEXT_COLOR : "#9ca3af" }}>
                {toGate ? getGateDisplay(toGate) : "Select destination gate"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {error && (
            <Animated.View
              entering={ZoomIn}
              style={{
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
                backgroundColor: "rgba(127, 29, 29, 0.5)",
              }}
            >
              <Text style={{ textAlign: "center", color: "#fca5a5" }}>
                {error}
              </Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={{
              paddingVertical: 16,
              borderRadius: 8,
              marginBottom: 24,
              backgroundColor: PRIMARY_COLOR,
            }}
            onPress={handleFindRoute}
            disabled={findRouteQuery.isLoading}
          >
            {findRouteQuery.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Find Routes
              </Text>
            )}
          </TouchableOpacity>

          {sortedRoutes.length > 0 && (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 16,
                  color: TEXT_COLOR,
                }}
              >
                {sortedRoutes.length} Route{sortedRoutes.length > 1 ? "s" : ""}{" "}
                Found 🎯
              </Text>

              {sortedRoutes.map((route, routeIndex) => {
                const isCheapest = routeIndex === 0;
                const borderColor = isCheapest ? "#22c55e" : SECONDARY_COLOR;
                const badgeBgColor = isCheapest
                  ? "#22c55e30"
                  : `${SECONDARY_COLOR}30`;
                const badgeTextColor = isCheapest ? "#22c55e" : ACCENT_COLOR;

                return (
                  <Animated.View
                    key={routeIndex}
                    entering={FadeInDown.delay(routeIndex * 100).springify()}
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      marginBottom: 16,
                      backgroundColor: CARD_BG_COLOR,
                      borderLeftWidth: 4,
                      borderLeftColor: borderColor,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 20,
                          backgroundColor: badgeBgColor,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            color: badgeTextColor,
                          }}
                        >
                          {isCheapest
                            ? "🏆 CHEAPEST"
                            : `Option ${routeIndex + 1}`}
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => handleToggleFavorite(route)}
                          style={{
                            marginRight: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 8,
                            backgroundColor: isRouteFavorite(route)
                              ? "#fbbf2440"
                              : "#374151",
                          }}
                        >
                          <Text style={{ fontSize: 24 }}>
                            {isRouteFavorite(route) ? "⭐" : "☆"}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: badgeTextColor,
                          }}
                        >
                          ${route.totalCost}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            marginLeft: 4,
                            color: "#9ca3af",
                          }}
                        >
                          HU
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        marginBottom: 12,
                        paddingBottom: 12,
                        borderBottomColor: "#374151",
                        borderBottomWidth: 1,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            marginRight: 8,
                            color: "#9ca3af",
                          }}
                        >
                          From:
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: TEXT_COLOR,
                          }}
                        >
                          {route.from.code} - {route.from.name}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            marginRight: 8,
                            color: "#9ca3af",
                          }}
                        >
                          To:
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: TEXT_COLOR,
                          }}
                        >
                          {route.to.code} - {route.to.name}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {route.route.map((gateCode, index) => (
                        <View
                          key={index}
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 6,
                              marginRight: 8,
                              marginBottom: 8,
                              backgroundColor: SECONDARY_COLOR,
                            }}
                          >
                            <Text
                              style={{
                                color: "#ffffff",
                                fontFamily: "monospace",
                                fontSize: 14,
                                fontWeight: "bold",
                              }}
                            >
                              {gateCode}
                            </Text>
                          </View>
                          {index < route.route.length - 1 && (
                            <Text
                              style={{
                                fontSize: 18,
                                marginRight: 8,
                                marginBottom: 8,
                                color: "#d1d5db",
                              }}
                            >
                              →
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>

                    <Text
                      style={{ fontSize: 12, marginTop: 8, color: "#6b7280" }}
                    >
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
        <View style={{ flex: 1, backgroundColor: BG_COLOR }}>
          <View
            style={{
              padding: 16,
              borderBottomColor: "#374151",
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 16,
                color: TEXT_COLOR,
              }}
            >
              Select Start Gate
            </Text>
            <TextInput
              style={{
                padding: 12,
                borderRadius: 8,
                borderColor: "#4b5563",
                borderWidth: 1,
                color: TEXT_COLOR,
              }}
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
                style={{
                  padding: 16,
                  borderBottomColor: "#374151",
                  borderBottomWidth: 1,
                }}
                onPress={() => handleSelectFromGate(item.code)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 4,
                    color: ACCENT_COLOR,
                  }}
                >
                  {item.code}
                </Text>
                <Text style={{ color: TEXT_COLOR }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={{
              padding: 16,
              margin: 16,
              borderRadius: 8,
              backgroundColor: PRIMARY_COLOR,
            }}
            onPress={() => setShowFromPicker(false)}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* To Gate Picker Modal */}
      <Modal
        visible={showToPicker}
        animationType="slide"
        onRequestClose={() => setShowToPicker(false)}
      >
        <View style={{ flex: 1, backgroundColor: BG_COLOR }}>
          <View
            style={{
              padding: 16,
              borderBottomColor: "#374151",
              borderBottomWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 16,
                color: TEXT_COLOR,
              }}
            >
              Select Destination Gate
            </Text>
            <TextInput
              style={{
                padding: 12,
                borderRadius: 8,
                borderColor: "#4b5563",
                borderWidth: 1,
                color: TEXT_COLOR,
              }}
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
                style={{
                  padding: 16,
                  borderBottomColor: "#374151",
                  borderBottomWidth: 1,
                }}
                onPress={() => handleSelectToGate(item.code)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 4,
                    color: ACCENT_COLOR,
                  }}
                >
                  {item.code}
                </Text>
                <Text style={{ color: TEXT_COLOR }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={{
              padding: 16,
              margin: 16,
              borderRadius: 8,
              backgroundColor: PRIMARY_COLOR,
            }}
            onPress={() => setShowToPicker(false)}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
