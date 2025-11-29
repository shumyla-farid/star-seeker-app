import React from "react";
import { View, Text } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { VehicleTypeCard } from "../molecules/VehicleTypeCard";
import { JourneyCostDisplay } from "../molecules/JourneyCostDisplay";
import { PassengersInfoCard } from "../molecules/PassengersInfoCard";
import { InfoRow } from "../../../../shared/components/molecules/InfoRow";
import { getCurrencySymbol } from "../../utils/currency.utils";

interface CostResultCardProps {
  vehicleName: string;
  ratePerAu?: number;
  journeyCost: number;
  parkingFee?: number;
  passengers: string;
  currency: string;
}

export function CostResultCard({
  vehicleName,
  ratePerAu,
  journeyCost,
  parkingFee,
  passengers,
  currency,
}: CostResultCardProps) {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Animated.View
      entering={ZoomIn.springify()}
      className="mt-6 rounded-xl bg-card border-l-4 border-success overflow-hidden"
    >
      {/* Header */}
      <View className="bg-success/10 p-4 flex-row items-center">
        <View className="bg-success/20 p-2 rounded-full mr-3">
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
        </View>
        <Text className="text-xl font-bold text-text flex-1">
          Recommended Transport
        </Text>
      </View>

      <View className="p-6">
        {/* Vehicle Type */}
        <VehicleTypeCard name={vehicleName} />

        {/* Rate per AU */}
        {ratePerAu && (
          <InfoRow
            icon="speedometer"
            iconColor="#06b6d4"
            iconBgColor="bg-secondary/20"
            label="Rate per AU"
            value={`${currencySymbol}${ratePerAu.toFixed(2)}`}
          />
        )}

        {/* Journey Cost - Featured */}
        <JourneyCostDisplay
          amount={journeyCost}
          currency={currency}
          currencySymbol={currencySymbol}
        />

        {/* Parking Fee */}
        {parkingFee !== undefined && parkingFee > 0 && (
          <InfoRow
            icon="business"
            iconColor="#f59e0b"
            iconBgColor="bg-tertiary/20"
            label="Parking Fee"
            value={`${currencySymbol}${parkingFee.toFixed(2)}`}
          />
        )}

        {/* Passengers Info */}
        <PassengersInfoCard count={passengers} />
      </View>
    </Animated.View>
  );
}

