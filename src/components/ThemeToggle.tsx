import React from "react";
import { TouchableOpacity, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeContext";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const progress = useDerivedValue(() => {
    return theme === "purple" ? 0 : 1;
  }, [theme]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["#8b5cf6", "#14b8a6"],
      ),
      transform: [{ scale: withSpring(1) }],
    };
  });

  return (
    <AnimatedTouchable
      onPress={toggleTheme}
      style={animatedStyle}
      className="px-4 py-2 rounded-full"
    >
      <Text className="text-white font-semibold">
        {theme === "purple" ? "🌌 Purple" : "🌊 Teal"}
      </Text>
    </AnimatedTouchable>
  );
};
