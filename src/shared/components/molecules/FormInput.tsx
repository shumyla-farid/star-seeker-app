import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface FormInputProps extends TextInputProps {
  label: string;
  delay?: number;
}

export function FormInput({ label, delay = 0, ...props }: FormInputProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      className="bg-card p-4 rounded-lg mb-4"
    >
      <Text className="text-sm font-semibold mb-2 text-text">{label}</Text>
      <TextInput
        className="border border-gray-600 rounded-lg px-4 py-3 text-base text-text bg-background h-12"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </Animated.View>
  );
}

