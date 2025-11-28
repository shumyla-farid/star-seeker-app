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

const BG_COLOR = "#0a0e27";
const CARD_BG_COLOR = "#1e1b4b";
const TEXT_COLOR = "#e9d5ff";
const ACCENT_COLOR = "#a78bfa";
const SECONDARY_COLOR = "#6d28d9";

export default function JourneyMemoryScreen() {
  const { favorites, isLoading, loadData, removeFavorite } = useRoutesStore();

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: BG_COLOR,
        }}
      >
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG_COLOR }}
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
    >
      <Animated.Text
        entering={FadeInDown.springify()}
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 24,
          color: TEXT_COLOR,
        }}
      >
        Favorite Routes ⭐
      </Animated.Text>

      {favorites.length === 0 ? (
        <Animated.View
          entering={FadeInUp}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🌟</Text>
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              marginBottom: 8,
              color: TEXT_COLOR,
            }}
          >
            No Favorite Routes Yet
          </Text>
          <Text style={{ fontSize: 14, textAlign: "center", color: "#9ca3af" }}>
            Tap the star icon on any route to save it here
          </Text>
        </Animated.View>
      ) : (
        <View>
          {favorites.map((route: any, index: number) => (
            <Animated.View
              key={route.id}
              entering={FadeInDown.delay(index * 100).springify()}
              style={{
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
                backgroundColor: CARD_BG_COLOR,
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
                    backgroundColor: "#fbbf2430",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#fbbf24",
                    }}
                  >
                    ⭐ FAVORITE
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => removeFavorite(route.id)}
                    style={{ marginRight: 8, padding: 8 }}
                  >
                    <Text style={{ fontSize: 20 }}>⭐</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeFavorite(route.id)}
                    style={{ marginRight: 12, padding: 8 }}
                  >
                    <Text style={{ fontSize: 20 }}>🗑️</Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      color: ACCENT_COLOR,
                    }}
                  >
                    ${route.totalCost}
                  </Text>
                  <Text
                    style={{ fontSize: 12, marginLeft: 4, color: "#9ca3af" }}
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
                    style={{ fontSize: 12, marginRight: 8, color: "#9ca3af" }}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{ fontSize: 12, marginRight: 8, color: "#9ca3af" }}
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
                {route.route.map((gateCode: string, gateIndex: number) => (
                  <View
                    key={gateIndex}
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
                    {gateIndex < route.route.length - 1 && (
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

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopColor: "#374151",
                  borderTopWidth: 1,
                }}
              >
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
                  {route.route.length} stops • {route.route.length - 1} jump
                  {route.route.length - 1 !== 1 ? "s" : ""}
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
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
