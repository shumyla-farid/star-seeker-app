import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { transportAPI } from "../api/costAPI";
import { JourneyCostResponse } from "../types/cost.types";
import { useQuery } from "@tanstack/react-query";

const getCurrencySymbol = (currency?: string) => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    HU: "Ħ", // Fictional currency symbol
  };
  return symbols[currency || "HU"] || currency || "Ħ";
};

const MAX_DISTANCE = 9999999999; // Maximum practical distance in AU
const MAX_PASSENGERS = 5;
const MAX_PARKING_DAYS = 365;

export default function CostCalculatorScreen() {
  const [distance, setDistance] = useState("");
  const [passengers, setPassengers] = useState("");
  const [parking, setParking] = useState("");
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
      const parkingNum = parking ? parseInt(parking, 10) : 0;
      return transportAPI.getCost(distanceNum, passengersNum, parkingNum);
    },
    enabled: false,
    retry: false,
  });

  const { recommendedTransport, journeyCost, parkingFee, currency } =
    calculateCostQueryData || {};
  const { name, ratePerAu } = recommendedTransport || {};

  const handleDistanceChange = (text: string) => {
    // Only allow numbers and decimal point
    const sanitized = text.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = sanitized.split(".");
    const formatted =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : sanitized;

    const numValue = parseFloat(formatted);
    if (formatted === "" || (numValue >= 0 && numValue <= MAX_DISTANCE)) {
      setDistance(formatted);
      setError(null);
    } else if (numValue > MAX_DISTANCE) {
      setError(`Maximum distance is ${MAX_DISTANCE} AU`);
    }
  };

  const handlePassengersChange = (text: string) => {
    // Only allow integers
    const sanitized = text.replace(/[^0-9]/g, "");
    const numValue = parseInt(sanitized, 10);

    if (sanitized === "") {
      setPassengers("");
      setError(null);
    } else if (numValue >= 1 && numValue <= MAX_PASSENGERS) {
      setPassengers(sanitized);
      setError(null);
    } else if (numValue > MAX_PASSENGERS) {
      setError(`Maximum ${MAX_PASSENGERS} passengers allowed`);
    } else if (numValue === 0) {
      setError("At least 1 passenger required");
    }
  };

  const handleParkingChange = (text: string) => {
    // Only allow integers
    const sanitized = text.replace(/[^0-9]/g, "");

    if (sanitized === "") {
      setParking("");
      setError(null);
      return;
    }

    // Remove leading zeros by converting to number and back
    const numValue = parseInt(sanitized, 10);
    const cleanValue = String(numValue);

    if (numValue >= 0 && numValue <= MAX_PARKING_DAYS) {
      setParking(cleanValue);
      setError(null);
    } else if (numValue > MAX_PARKING_DAYS) {
      setError(`Maximum ${MAX_PARKING_DAYS} parking days allowed`);
    }
  };

  const handleCalculateCost = () => {
    // Dismiss keyboard first
    Keyboard.dismiss();

    if (!distance || !passengers) {
      setError("Please fill in distance and passengers");
      return;
    }

    const distanceNum = parseFloat(distance);
    const passengersNum = parseInt(passengers, 10);
    const parkingNum = parking ? parseInt(parking, 10) : 0;

    if (Number.isNaN(distanceNum) || Number.isNaN(passengersNum)) {
      setError("Please enter valid numbers");
      return;
    }

    if (distanceNum <= 0) {
      setError("Distance must be greater than 0");
      return;
    }

    if (passengersNum < 1 || passengersNum > MAX_PASSENGERS) {
      setError(`Passengers must be between 1 and ${MAX_PASSENGERS}`);
      return;
    }

    if (distanceNum > MAX_DISTANCE) {
      setError(`Maximum distance is ${MAX_DISTANCE} AU`);
      return;
    }

    setError(null);
    refetchCalculateCost();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 150 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                className="border border-gray-600 rounded-lg px-4 py-3 text-base text-text bg-background h-12"
                placeholder="Enter distance (max 1000)"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={distance}
                onChangeText={handleDistanceChange}
                maxLength={MAX_DISTANCE.toString().length}
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
                className="border border-gray-600 rounded-lg px-4 py-3 text-base text-text bg-background h-12"
                placeholder="Enter passengers (1-5)"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={passengers}
                onChangeText={handlePassengersChange}
                maxLength={1}
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
                className="border border-gray-600 rounded-lg px-4 py-3 text-base text-text bg-background h-12"
                placeholder="0 (optional)"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={parking}
                onChangeText={handleParkingChange}
                maxLength={3}
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
                className="mt-6 rounded-xl bg-card border-l-4 border-success overflow-hidden"
              >
                {/* Header */}
                <View className="bg-success/10 p-4 flex-row items-center">
                  <View className="bg-success/20 p-2 rounded-full mr-3">
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#10b981"
                    />
                  </View>
                  <Text className="text-xl font-bold text-text flex-1">
                    Recommended Transport
                  </Text>
                </View>

                <View className="p-6">
                  {/* Vehicle Type */}
                  <View className="flex-row items-center mb-4 bg-background/50 p-4 rounded-lg">
                    <View className="bg-primary/20 p-2 rounded-full mr-3">
                      <Ionicons name="car-sport" size={20} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-400 mb-1">
                        Vehicle Type
                      </Text>
                      <Text className="text-lg font-bold text-text">
                        {name || "No data found"}
                      </Text>
                    </View>
                  </View>

                  {/* Rate per AU */}
                  {ratePerAu && (
                    <View className="flex-row items-center justify-between mb-4 bg-background/50 p-4 rounded-lg">
                      <View className="flex-row items-center flex-1">
                        <View className="bg-secondary/20 p-2 rounded-full mr-3">
                          <Ionicons
                            name="speedometer"
                            size={20}
                            color="#06b6d4"
                          />
                        </View>
                        <Text className="text-sm text-gray-400">
                          Rate per AU
                        </Text>
                      </View>
                      <Text className="text-lg font-bold text-text">
                        {getCurrencySymbol(currency)}
                        {ratePerAu.toFixed(2)}
                      </Text>
                    </View>
                  )}

                  {/* Journey Cost - Featured */}
                  <View className="bg-gradient-to-br from-accent/20 to-primary/20 p-10 rounded-xl mb-4 items-center  border border-accent/30">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="cash" size={24} color="#a78bfa" />
                      <Text className="text-sm text-gray-400 ml-2">
                        Total Journey Cost
                      </Text>
                    </View>
                    <View className="flex-row items-baseline">
                      <Text className="text-5xl font-bold text-accent">
                        {getCurrencySymbol(currency)}
                        {journeyCost?.toFixed(2) || "0.00"}
                      </Text>
                      <Text className="text-lg text-gray-400 ml-2">
                        {currency || "HU"}
                      </Text>
                    </View>
                  </View>

                  {/* Parking Fee */}
                  {parkingFee !== undefined && parkingFee > 0 && (
                    <View className="flex-row items-center justify-between mb-4 bg-background/50 p-4 rounded-lg">
                      <View className="flex-row items-center flex-1">
                        <View className="bg-tertiary/20 p-2 rounded-full mr-3">
                          <Ionicons name="business" size={20} color="#f59e0b" />
                        </View>
                        <Text className="text-sm text-gray-400">
                          Parking Fee
                        </Text>
                      </View>
                      <Text className="text-lg font-bold text-text">
                        {getCurrencySymbol(currency)}
                        {parkingFee.toFixed(2)}
                      </Text>
                    </View>
                  )}

                  {/* Passengers Info */}
                  <View className="flex-row items-center bg-background/50 p-4 rounded-lg">
                    <View className="bg-primary/20 p-2 rounded-full mr-3">
                      <Ionicons name="people" size={20} color="#8b5cf6" />
                    </View>
                    <Text className="text-sm text-gray-400 mr-2">
                      Passengers:
                    </Text>
                    <Text className="text-lg font-bold text-text">
                      {passengers}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
