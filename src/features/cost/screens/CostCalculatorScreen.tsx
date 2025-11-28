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
import { useTheme } from "../../../shared/theme/ThemeContext";
import { useQuery } from "@tanstack/react-query";

export default function CostCalculatorScreen() {
  const [distance, setDistance] = useState("");
  const [passengers, setPassengers] = useState("");
  const [parking, setParking] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
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
    enabled: false, // 🔴 don't run automatically on mount
    retry: false, // optional: avoid retry spamming on validation/API errors
  });

  console.log(calculateCostQueryData, "calculateCostQueryData....");
  const { recommendedTransport, journeyCost, parkingFee, currency } =
    calculateCostQueryData || {};
  const { name, ratePerAu } = recommendedTransport || {};

  const handleCalculateCost = () => {
    // 1. Basic validation
    if (!distance || !passengers) {
      setError("Please fill in distance and passengers");
      return;
    }

    const distanceNum = parseFloat(distance);
    const passengersNum = parseInt(passengers, 10);
    const parkingNum = parseInt(parking, 10) || 0;

    // 2. Numeric validation
    if (Number.isNaN(distanceNum) || Number.isNaN(passengersNum)) {
      setError("Please enter valid numbers");
      return;
    }

    setError(null);

    // 🚀 3. Trigger the React Query request
    refetchCalculateCost();
  };

  return (
    <ScrollView
      className={`flex-1 ${bgColor}`}
      style={{ backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4">
        <Animated.Text
          entering={FadeInDown.springify()}
          className="text-2xl font-bold mb-6"
          style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
        >
          Journey Cost Calculator
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-4`}
          style={{
            backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
          }}
        >
          <Text
            className="text-sm font-semibold mb-2"
            style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
          >
            Distance (AUs)
          </Text>
          <TextInput
            className="border border-gray-600 rounded-lg px-4 py-3 text-base"
            style={{
              color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
              backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419",
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
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-4`}
          style={{
            backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
          }}
        >
          <Text
            className="text-sm font-semibold mb-2"
            style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
          >
            Number of Passengers
          </Text>
          <TextInput
            className="border border-gray-600 rounded-lg px-4 py-3 text-base"
            style={{
              color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
              backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419",
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
          className={`${cardColor} p-4 rounded-lg shadow-lg mb-6`}
          style={{
            backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
          }}
        >
          <Text
            className="text-sm font-semibold mb-2"
            style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
          >
            Parking Days
          </Text>
          <TextInput
            className="border border-gray-600 rounded-lg px-4 py-3 text-base"
            style={{
              color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
              backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419",
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
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: "#7f1d1d80" }}
          >
            <Text className="text-center" style={{ color: "#fca5a5" }}>
              {error}
            </Text>
          </Animated.View>
        )}

        <TouchableOpacity
          className="py-4 rounded-lg"
          style={{
            backgroundColor: theme === "purple" ? "#8b5cf6" : "#14b8a6",
          }}
          onPress={handleCalculateCost}
          disabled={isLoadingCalculateCost}
        >
          {isLoadingCalculateCost ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Calculate Cost
            </Text>
          )}
        </TouchableOpacity>

        {isErrorCalculateCost && (
          <Animated.View
            entering={ZoomIn}
            className="p-4 rounded-lg mt-4"
            style={{ backgroundColor: "#7f1d1d80" }}
          >
            <Text className="text-center" style={{ color: "#fca5a5" }}>
              Error calculating cost. Please try again.
            </Text>
          </Animated.View>
        )}

        {calculateCostQueryData && (
          <Animated.View
            entering={ZoomIn.springify()}
            className="mt-6 p-6 rounded-xl shadow-2xl"
            style={{
              backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
            }}
          >
            <Text
              className="text-xl font-bold mb-4"
              style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
            >
              Recommended Transport
            </Text>
            <View className="border-t border-gray-700 pt-4">
              <Text className="text-sm mb-2" style={{ color: "#9ca3af" }}>
                Vehicle Type
              </Text>
              <Text
                className="text-lg font-semibold mb-4"
                style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
              >
                {name || "No data found"}
              </Text>

              {ratePerAu && (
                <>
                  <Text className="text-sm mb-2" style={{ color: "#9ca3af" }}>
                    Rate per AU
                  </Text>
                  <Text
                    className="text-lg font-semibold mb-4"
                    style={{
                      color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
                    }}
                  >
                    ${ratePerAu.toFixed(2)} {currency || "HU"}
                  </Text>
                </>
              )}

              <Text className="text-sm mb-2" style={{ color: "#9ca3af" }}>
                Journey Cost
              </Text>
              <Text
                className="text-4xl font-bold mb-4"
                style={{ color: theme === "purple" ? "#a78bfa" : "#2dd4bf" }}
              >
                ${journeyCost?.toFixed(2) || "0.00"} {currency || "HU"}
              </Text>

              {parkingFee !== undefined && parkingFee > 0 && (
                <>
                  <Text className="text-sm mb-2" style={{ color: "#9ca3af" }}>
                    Parking Fee
                  </Text>
                  <Text
                    className="text-lg font-semibold mb-4"
                    style={{
                      color: theme === "purple" ? "#e9d5ff" : "#ccfbf1",
                    }}
                  >
                    ${parkingFee.toFixed(2)} {currency || "HU"}
                  </Text>
                </>
              )}

              <Text className="text-sm" style={{ color: "#9ca3af" }}>
                Passengers: {passengers}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
