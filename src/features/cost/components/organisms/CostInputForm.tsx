import React from "react";
import { View } from "react-native";
import { FormInput } from "../../../../shared/components/molecules/FormInput";
import {
  MAX_DISTANCE,
  MAX_PASSENGERS,
} from "../../utils/validation.constants";

interface CostInputFormProps {
  distance: string;
  passengers: string;
  parking: string;
  onDistanceChange: (text: string) => void;
  onPassengersChange: (text: string) => void;
  onParkingChange: (text: string) => void;
}

export function CostInputForm({
  distance,
  passengers,
  parking,
  onDistanceChange,
  onPassengersChange,
  onParkingChange,
}: CostInputFormProps) {
  return (
    <View>
      <FormInput
        label="Distance (AUs)"
        placeholder={`Enter distance (max ${MAX_DISTANCE})`}
        keyboardType="decimal-pad"
        value={distance}
        onChangeText={onDistanceChange}
        maxLength={MAX_DISTANCE.toString().length}
        delay={100}
      />

      <FormInput
        label="Number of Passengers"
        placeholder={`Enter passengers (1-${MAX_PASSENGERS})`}
        keyboardType="number-pad"
        value={passengers}
        onChangeText={onPassengersChange}
        maxLength={1}
        delay={200}
      />

      <FormInput
        label="Parking Days"
        placeholder="0 (optional)"
        keyboardType="number-pad"
        value={parking}
        onChangeText={onParkingChange}
        maxLength={3}
        delay={300}
      />
    </View>
  );
}

