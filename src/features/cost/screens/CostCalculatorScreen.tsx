import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { transportAPI } from "../api/costAPI";
import { ErrorBanner } from "../../../shared/components/atoms/ErrorBanner";
import { PrimaryButton } from "../../../shared/components/atoms/PrimaryButton";
import { CostInputForm } from "../components/organisms/CostInputForm";
import { CostResultCard } from "../components/organisms/CostResultCard";
import {
  MAX_DISTANCE,
  MAX_PASSENGERS,
  MAX_PARKING_DAYS,
} from "../utils/validation.constants";

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

    setPassengers(sanitized);
    if (sanitized === "") {
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
    setParking(sanitized);
    if (sanitized === "") {
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

            <CostInputForm
              distance={distance}
              passengers={passengers}
              parking={parking}
              onDistanceChange={handleDistanceChange}
              onPassengersChange={handlePassengersChange}
              onParkingChange={handleParkingChange}
            />

            {error && <ErrorBanner message={error} />}

            <PrimaryButton
              title="Calculate Cost"
              onPress={handleCalculateCost}
              isLoading={isLoadingCalculateCost}
            />

            {isErrorCalculateCost && (
              <View className="mt-4">
                <ErrorBanner message="Error calculating cost. Please try again." />
              </View>
            )}

            {calculateCostQueryData && (
              <CostResultCard
                vehicleName={name || "No data found"}
                ratePerAu={ratePerAu}
                journeyCost={journeyCost || 0}
                parkingFee={parkingFee}
                passengers={passengers}
                currency={currency || "GBP"}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
