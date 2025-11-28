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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
        contentContainerClassName="bg-background"
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-gray-600 ml-4" />
        )}
        renderItem={({ item, index }) => (
          <AnimatedTouchable
            entering={FadeInDown.delay(index * 50).springify()}
            onPress={() =>
              navigation.navigate("GateDetails", { gateCode: item.code })
            }
            className="flex-row items-center justify-between py-4 px-4 bg-background"
            activeOpacity={0.7}
          >
            <Text className="text-lg text-text flex-1">{item.name}</Text>
            <Ionicons name="chevron-forward" size={22} color="#8b5cf6" />
          </AnimatedTouchable>
        )}
      />
    </View>
  );
}
