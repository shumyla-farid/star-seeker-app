import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { transportAPI } from "../api/costAPI";
import { JourneyCostResponse } from "../types/cost.types";
import { useQuery } from "@tanstack/react-query";

const BG_COLOR = "#0a0e27";
const CARD_BG_COLOR = "#1e1b4b";
const TEXT_COLOR = "#e9d5ff";
const PRIMARY_COLOR = "#8b5cf6";
const ACCENT_COLOR = "#a78bfa";

export default function CostCalculatorScreen() {
  const [distance, setDistance] = useState("");
  const [passengers, setPassengers] = useState("");
  const [parking, setParking] = useState("0");
  const [error, setError] = useState<string | null>(null);

  const {
    data: calculateCostQueryData,
    isLoading: isLoadingCalculateCost,
    isError: isErrorCalculateCost,
    refetch: refetchCalculateCost,
  } = useQuery({
    queryKey: ["calculate-cost", distance, passengers, parking],
    queryFn: () => {
      const distanceNum = parseFloat(distance);
      const passengersNum = parseInt(passengers, 10);
      const parkingNum = parseInt(parking, 10) || 0;
      return transportAPI.getCost(distanceNum, passengersNum, parkingNum);
    },
    enabled: false,
    retry: false,
  });

  const { recommendedTransport, journeyCost, parkingFee, currency } =
    calculateCostQueryData || {};
  const { name, ratePerAu } = recommendedTransport || {};

  const handleCalculateCost = () => {
    if (!distance || !passengers) {
      setError("Please fill in distance and passengers");
      return;
    }

    const distanceNum = parseFloat(distance);
    const passengersNum = parseInt(passengers, 10);
    const parkingNum = parseInt(parking, 10) || 0;

    if (Number.isNaN(distanceNum) || Number.isNaN(passengersNum)) {
      setError("Please enter valid numbers");
      return;
    }

    setError(null);
    refetchCalculateCost();
  };

  return (
    <ScrollView
      style={{ backgroundColor: BG_COLOR, flex: 1 }}
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
          Journey Cost Calculator
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
            Distance (AUs)
          </Text>
          <TextInput
            style={{
              borderColor: "#4b5563",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: TEXT_COLOR,
              backgroundColor: BG_COLOR,
            }}
            placeholder="Enter distance"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
            value={distance}
            onChangeText={setDistance}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
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
            Number of Passengers
          </Text>
          <TextInput
            style={{
              borderColor: "#4b5563",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: TEXT_COLOR,
              backgroundColor: BG_COLOR,
            }}
            placeholder="Enter passengers (max 5)"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={passengers}
            onChangeText={setPassengers}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
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
            Parking Days
          </Text>
          <TextInput
            style={{
              borderColor: "#4b5563",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              color: TEXT_COLOR,
              backgroundColor: BG_COLOR,
            }}
            placeholder="Enter parking days"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={parking}
            onChangeText={setParking}
          />
        </Animated.View>

        {error && (
          <Animated.View
            entering={ZoomIn}
            style={{
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              backgroundColor: "#7f1d1d80",
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
            backgroundColor: PRIMARY_COLOR,
          }}
          onPress={handleCalculateCost}
          disabled={isLoadingCalculateCost}
        >
          {isLoadingCalculateCost ? (
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
              Calculate Cost
            </Text>
          )}
        </TouchableOpacity>

        {isErrorCalculateCost && (
          <Animated.View
            entering={ZoomIn}
            style={{
              padding: 16,
              borderRadius: 8,
              marginTop: 16,
              backgroundColor: "#7f1d1d80",
            }}
          >
            <Text style={{ textAlign: "center", color: "#fca5a5" }}>
              Error calculating cost. Please try again.
            </Text>
          </Animated.View>
        )}

        {calculateCostQueryData && (
          <Animated.View
            entering={ZoomIn.springify()}
            style={{
              marginTop: 24,
              padding: 24,
              borderRadius: 12,
              backgroundColor: CARD_BG_COLOR,
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
              Recommended Transport
            </Text>
            <View
              style={{
                borderTopColor: "#374151",
                borderTopWidth: 1,
                paddingTop: 16,
              }}
            >
              <Text style={{ fontSize: 14, marginBottom: 8, color: "#9ca3af" }}>
                Vehicle Type
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 16,
                  color: TEXT_COLOR,
                }}
              >
                {name || "No data found"}
              </Text>

              {ratePerAu && (
                <>
                  <Text
                    style={{ fontSize: 14, marginBottom: 8, color: "#9ca3af" }}
                  >
                    Rate per AU
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginBottom: 16,
                      color: TEXT_COLOR,
                    }}
                  >
                    ${ratePerAu.toFixed(2)} {currency || "HU"}
                  </Text>
                </>
              )}

              <Text style={{ fontSize: 14, marginBottom: 8, color: "#9ca3af" }}>
                Journey Cost
              </Text>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "bold",
                  marginBottom: 16,
                  color: ACCENT_COLOR,
                }}
              >
                ${journeyCost?.toFixed(2) || "0.00"} {currency || "HU"}
              </Text>

              {parkingFee !== undefined && parkingFee > 0 && (
                <>
                  <Text
                    style={{ fontSize: 14, marginBottom: 8, color: "#9ca3af" }}
                  >
                    Parking Fee
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginBottom: 16,
                      color: TEXT_COLOR,
                    }}
                  >
                    ${parkingFee.toFixed(2)} {currency || "HU"}
                  </Text>
                </>
              )}

              <Text style={{ fontSize: 14, color: "#9ca3af" }}>
                Passengers: {passengers}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
