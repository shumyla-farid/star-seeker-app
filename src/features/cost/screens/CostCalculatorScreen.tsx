import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { useNetInfo } from "@react-native-community/netinfo";
import { transportAPI } from "../api/costAPI";
import { ErrorBanner } from "../../../shared/components/molecules/ErrorBanner";
import { Button } from "../../../shared/components/atoms/Button";
import { CostInputForm } from "../components/organisms/CostInputForm";
import { CostResultCard } from "../components/organisms/CostResultCard";
import {
  MAX_DISTANCE,
  MAX_PASSENGERS,
  MAX_PARKING_DAYS,
} from "../utils/validation.constants";
import { z } from "zod";
import { useFocusEffect } from "@react-navigation/native";

export default function CostCalculatorScreen() {
  const [distance, setDistance] = useState("");
  const [passengers, setPassengers] = useState("");
  const [parking, setParking] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const netInfo = useNetInfo();
  const isOffline =
    !netInfo.isConnected || netInfo.isInternetReachable === false;

  const {
    data: calculateCostQueryData,
    isLoading: isLoadingCalculateCost,
    isError: isErrorCalculateCost,
    refetch: refetchCalculateCost,
    isRefetchError,
    fetchStatus,
    status,
  } = useQuery({
    queryKey: ["calculate-cost", distance, passengers, parking],
    queryFn: () => {
      const distanceNum = parseFloat(distance);
      const passengersNum = parseInt(passengers);
      const parkingNum = parking ? parseInt(parking) : 0;
      return transportAPI.getCost(distanceNum, passengersNum, parkingNum);
    },
    enabled: false,
    retry: false,
  });

  const { recommendedTransport, journeyCost, parkingFee, currency } =
    calculateCostQueryData || {};
  const { name, ratePerAu } = recommendedTransport || {};

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDistance("");
        setPassengers("");
        setParking("");
      };
    }, [setDistance, setPassengers, setParking]),
  );

  const handleDistanceChange = (text: string) => {
    if (!text) {
      setDistance("");
      return;
    }
    const validatedDistance = z.coerce
      .number()
      .gt(0)
      .max(MAX_DISTANCE)
      .safeParse(text);

    if (validatedDistance.success) {
      setDistance(text);
      setError(null);
      setHasCalculated(false);
    }
  };

  const handlePassengersChange = (text: string) => {
    if (!text) {
      setPassengers("");
      return;
    }

    const validatedPassengers = z.coerce
      .number()
      .min(1)
      .max(MAX_PASSENGERS)
      .safeParse(text);

    if (validatedPassengers.success) {
      setPassengers(text);
      setError(null);
      setHasCalculated(false);
    }
  };

  const handleParkingChange = (text: string) => {
    if (!text) {
      setParking("");
      return;
    }

    const validatedParking = z.coerce
      .number()
      .int()
      .max(MAX_PARKING_DAYS)
      .safeParse(text);

    if (validatedParking.success) {
      setParking(validatedParking.data.toString());
      setError(null);
      setHasCalculated(false);
    }
  };

  const handleCalculateCost = () => {
    // Dismiss keyboard first
    Keyboard.dismiss();

    if (!distance || !passengers) {
      setError("Please fill in distance and passengers");
      return;
    }
    setError(null);
    setHasCalculated(true);

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
        contentContainerStyle={{ paddingBottom: 32 }}
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

            {/* Offline indicator */}
            {isOffline && (
              <View className="mb-4">
                <ErrorBanner
                  message="You are currently offline. Some features may be limited."
                  variant="warning"
                />
              </View>
            )}

            <Button
              title="Calculate Cost"
              onPress={handleCalculateCost}
              isLoading={isLoadingCalculateCost}
            />
            {/* <View>
              <Text style={{ color: "white" }}>
                {` fetchStatus: ${fetchStatus}
        isError: ${isErrorCalculateCost}
           isrefetchError: ${isRefetchError}
        state: ${status}
   `}
              </Text>
            </View> */}

            {hasCalculated &&
              (isRefetchError || isErrorCalculateCost) &&
              fetchStatus !== "fetching" &&
              !isOffline && (
                <View testID="error-banner" className="mt-4">
                  <ErrorBanner
                    message={`Error calculating cost. Please try again.`}
                  />
                </View>
              )}

            {hasCalculated &&
              calculateCostQueryData &&
              !isLoadingCalculateCost && (
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
