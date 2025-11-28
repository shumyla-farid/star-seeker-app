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

const BG_COLOR = "#0a0e27";
const PRIMARY_COLOR = "#8b5cf6";
const TEXT_COLOR = "#e9d5ff";

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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: BG_COLOR,
        }}
      >
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: BG_COLOR,
        }}
      >
        <Animated.Text
          entering={FadeInUp}
          style={{
            fontSize: 16,
            marginBottom: 16,
            textAlign: "center",
            color: TEXT_COLOR,
          }}
        >
          {error?.message || "Failed to load gates"}
        </Animated.Text>
        <AnimatedTouchable
          entering={FadeInDown}
          onPress={() => refetch()}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: PRIMARY_COLOR,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
            Retry
          </Text>
        </AnimatedTouchable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG_COLOR }}>
      <FlatList
        data={gates}
        keyExtractor={(item) => item.code}
        onRefresh={() => refetch()}
        refreshing={isLoading}
        style={{ flex: 1 }}
        contentContainerStyle={{ backgroundColor: BG_COLOR }}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: "#4b5563", marginLeft: 16 }}
          />
        )}
        renderItem={({ item, index }) => (
          <AnimatedTouchable
            entering={FadeInDown.delay(index * 50).springify()}
            onPress={() =>
              navigation.navigate("GateDetails", { gateCode: item.code })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 16,
              paddingHorizontal: 16,
              backgroundColor: BG_COLOR,
            }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 18, color: TEXT_COLOR, flex: 1 }}>
              {item.name}
            </Text>
            <Ionicons name="chevron-forward" size={22} color={PRIMARY_COLOR} />
          </AnimatedTouchable>
        )}
      />
    </View>
  );
}
