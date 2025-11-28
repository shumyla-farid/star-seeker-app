import React from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { gatesAPI } from "../api/gatesAPI";
import { useTheme } from "../../../shared/theme/ThemeContext";
import { ThemeToggle } from "../../../shared/components/ThemeToggle";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { useQuery } from "@tanstack/react-query";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();

  const bgColor =
    theme === "purple" ? "bg-purple-space-bg" : "bg-teal-space-bg";
  const primaryColor =
    theme === "purple"
      ? "text-purple-space-primary"
      : "text-teal-space-primary";
  const cardColor =
    theme === "purple" ? "bg-purple-space-card" : "bg-teal-space-card";
  const textColor =
    theme === "purple" ? "text-purple-space-text" : "text-teal-space-text";

  const {
    data: gates,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["gates"],
    queryFn: () => gatesAPI.getAll(),
  });

  if (isLoading) {
    return (
      <View className={`flex-1 justify-center items-center ${bgColor}`}>
        <ActivityIndicator
          size="large"
          color={theme === "purple" ? "#8b5cf6" : "#14b8a6"}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        className={`flex-1 justify-center items-center ${bgColor} px-4`}
        style={{ backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419" }}
      >
        <Animated.Text
          entering={FadeInUp}
          className="text-base mb-4 text-center"
          style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
        >
          {error?.message || "Failed to load gates"}
        </Animated.Text>
        <AnimatedTouchable
          entering={FadeInDown}
          onPress={() => refetch()}
          className="px-6 py-3 rounded-lg"
          style={{
            backgroundColor: theme === "purple" ? "#8b5cf6" : "#14b8a6",
          }}
        >
          <Text className="text-white text-base font-semibold">Retry</Text>
        </AnimatedTouchable>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${bgColor}`}
      style={{ backgroundColor: theme === "purple" ? "#0a0e27" : "#0f1419" }}
    >
      <View className="pt-4 px-4 pb-2">
        <ThemeToggle />
      </View>
      <FlatList
        data={gates}
        keyExtractor={(item) => item.code}
        onRefresh={() => refetch()}
        refreshing={isLoading}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => (
          <AnimatedTouchable
            entering={FadeInDown.delay(index * 50).springify()}
            layout={Layout.springify()}
            onPress={() =>
              navigation.navigate("GateDetails", { gateCode: item.code })
            }
            className="mx-4 my-2 p-4 rounded-lg shadow-lg"
            style={{
              backgroundColor: theme === "purple" ? "#1e1b4b" : "#1a2830",
            }}
          >
            <Text
              className="text-lg font-bold"
              style={{ color: theme === "purple" ? "#8b5cf6" : "#14b8a6" }}
            >
              {item.code}
            </Text>
            <Text
              className="text-base mt-1"
              style={{ color: theme === "purple" ? "#e9d5ff" : "#ccfbf1" }}
            >
              {item.name}
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
              {item.system}
            </Text>
          </AnimatedTouchable>
        )}
      />
    </View>
  );
}
