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
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4">
        <Animated.Text
          entering={FadeInDown.springify()}
          className="text-2xl font-bold mb-6 text-text"
        >
          Journey Cost Calculator
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="bg-card p-4 rounded-lg mb-4"
        >
          <Text className="text-sm font-semibold mb-2 text-text">
            Distance (AUs)
          </Text>
          <TextInput
            className="border border-gray-600 rounded-lg px-4 py-3 text-base text-text bg-background"
            placeholder="Enter distance"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
            value={distance}
            onChangeText={setDistance}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="bg-card p-4 rounded-lg mb-4"
        >
          <Text className="text-sm font-semibold mb-2 text-text">
            Number of Passengers
          </Text>
          <TextInput
            className="border border-gray-600 rounded-lg px-4 py-3 text-base text-text bg-background"
            placeholder="Enter passengers (max 5)"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={passengers}
            onChangeText={setPassengers}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="bg-card p-4 rounded-lg mb-6"
        >
          <Text className="text-sm font-semibold mb-2 text-text">
            Parking Days
          </Text>
          <TextInput
            className="border border-gray-600 rounded-lg px-4 py-3 text-base text-text bg-background"
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
            className="p-4 rounded-lg mb-4 bg-red-900/50"
          >
            <Text className="text-center text-red-300">{error}</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          className="py-4 rounded-lg bg-primary"
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
            className="p-4 rounded-lg mt-4 bg-red-900/50"
          >
            <Text className="text-center text-red-300">
              Error calculating cost. Please try again.
            </Text>
          </Animated.View>
        )}

        {calculateCostQueryData && (
          <Animated.View
            entering={ZoomIn.springify()}
            className="mt-6 p-6 rounded-xl bg-card"
          >
            <Text className="text-xl font-bold mb-4 text-text">
              Recommended Transport
            </Text>
            <View className="border-t border-gray-700 pt-4">
              <Text className="text-sm mb-2 text-gray-400">Vehicle Type</Text>
              <Text className="text-lg font-semibold mb-4 text-text">
                {name || "No data found"}
              </Text>

              {ratePerAu && (
                <>
                  <Text className="text-sm mb-2 text-gray-400">
                    Rate per AU
                  </Text>
                  <Text className="text-lg font-semibold mb-4 text-text">
                    ${ratePerAu.toFixed(2)} {currency || "HU"}
                  </Text>
                </>
              )}

              <Text className="text-sm mb-2 text-gray-400">Journey Cost</Text>
              <Text className="text-4xl font-bold mb-4 text-accent">
                ${journeyCost?.toFixed(2) || "0.00"} {currency || "HU"}
              </Text>

              {parkingFee !== undefined && parkingFee > 0 && (
                <>
                  <Text className="text-sm mb-2 text-gray-400">
                    Parking Fee
                  </Text>
                  <Text className="text-lg font-semibold mb-4 text-text">
                    ${parkingFee.toFixed(2)} {currency || "HU"}
                  </Text>
                </>
              )}

              <Text className="text-sm text-gray-400">
                Passengers: {passengers}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}
