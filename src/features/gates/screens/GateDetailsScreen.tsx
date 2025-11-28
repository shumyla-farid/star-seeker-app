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

const BG_COLOR = "#0a0e27";
const CARD_BG_COLOR = "#1e1b4b";
const TEXT_COLOR = "#e9d5ff";
const PRIMARY_COLOR = "#8b5cf6";

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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: BG_COLOR,
        }}
      >
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (error || !gate) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: BG_COLOR,
          paddingHorizontal: 16,
        }}
      >
        <Animated.Text
          entering={FadeInUp}
          style={{
            fontSize: 16,
            marginBottom: 16,
            textAlign: "center",
            color: TEXT_COLOR,
          }}
        >
          {error}
        </Animated.Text>
        <TouchableOpacity
          onPress={fetchGateDetails}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: PRIMARY_COLOR,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG_COLOR }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ padding: 16 }}>
        <Animated.View
          entering={FadeInDown.springify()}
          style={{
            padding: 24,
            borderRadius: 12,
            marginBottom: 16,
            backgroundColor: CARD_BG_COLOR,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 8,
              color: PRIMARY_COLOR,
            }}
          >
            {gate.code}
          </Text>
          <Text style={{ fontSize: 20, marginBottom: 4, color: TEXT_COLOR }}>
            {gate.name}
          </Text>
          <Text style={{ fontSize: 16, color: "#9ca3af" }}>{gate.system}</Text>
        </Animated.View>

        {gate.coordinates && (
          <Animated.View
            entering={SlideInRight.delay(200).springify()}
            style={{
              padding: 24,
              borderRadius: 12,
              backgroundColor: CARD_BG_COLOR,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
                color: TEXT_COLOR,
              }}
            >
              Spatial Coordinates
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomColor: "#374151",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={{ fontSize: 16, color: "#9ca3af" }}>X Axis</Text>
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: 16,
                    fontWeight: "600",
                    color: TEXT_COLOR,
                  }}
                >
                  {gate.coordinates.x.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomColor: "#374151",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={{ fontSize: 16, color: "#9ca3af" }}>Y Axis</Text>
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: 16,
                    fontWeight: "600",
                    color: TEXT_COLOR,
                  }}
                >
                  {gate.coordinates.y.toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                }}
              >
                <Text style={{ fontSize: 16, color: "#9ca3af" }}>Z Axis</Text>
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: 16,
                    fontWeight: "600",
                    color: TEXT_COLOR,
                  }}
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
