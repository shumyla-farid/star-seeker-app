import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SelectButton } from "../../../../shared/components/molecules/SelectButton";

interface GatePickerInputProps {
  label: string;
  value?: string;
  displayValue?: string;
  placeholder: string;
  onPress: () => void;
  delay?: number;
}

export function GatePickerInput({
  label,
  value,
  displayValue,
  placeholder,
  onPress,
  delay = 0,
}: GatePickerInputProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      className="bg-card p-4 rounded-lg mb-4"
    >
      <Text className="text-sm font-semibold mb-2 text-text">{label}</Text>
      <SelectButton
        label={label}
        value={displayValue}
        placeholder={placeholder}
        onPress={onPress}
      />
    </Animated.View>
  );
}

