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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { gatesAPI } from "../api/gatesAPI";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { useQuery } from "@tanstack/react-query";
import { useGatesStore } from "../store/gatesStore";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isFavoriteGate } = useGatesStore();

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
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-background">
        <Animated.Text
          entering={FadeInUp}
          className="text-base mb-4 text-center text-text"
        >
          {error?.message || "Failed to load gates"}
        </Animated.Text>
        <AnimatedTouchable
          entering={FadeInDown}
          onPress={() => refetch()}
          className="px-6 py-3 rounded-lg bg-primary"
        >
          <Text className="text-white text-base font-semibold">Retry</Text>
        </AnimatedTouchable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={gates}
        keyExtractor={(item) => item.code}
        onRefresh={() => refetch()}
        refreshing={isLoading}
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item, index }) => {
          const isFavorite = isFavoriteGate(item.code);
          return (
            <Animated.View
              entering={FadeInDown.delay(index * 50).springify()}
              className={`p-6 rounded-xl border-l-4 ${
                isFavorite
                  ? "bg-amber-500/10 border-amber-500"
                  : "bg-card border-primary"
              }`}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("GateDetails", { gateCode: item.code })
                }
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View
                    className={`p-3 rounded-full mr-3 ${
                      isFavorite ? "bg-amber-500/20" : "bg-primary/20"
                    }`}
                  >
                    <Ionicons
                      name={isFavorite ? "star" : "planet"}
                      size={28}
                      color={isFavorite ? "#f59e0b" : "#8b5cf6"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-3xl font-bold ${
                        isFavorite ? "text-amber-500" : "text-primary"
                      }`}
                    >
                      {item.code}
                    </Text>
                    <Text className="text-lg text-text">{item.name}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={isFavorite ? "#f59e0b" : "#8b5cf6"}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
