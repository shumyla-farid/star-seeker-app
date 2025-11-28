import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import HomeScreen from "../../features/gates/screens/HomeScreen";
import GateDetailsScreen from "../../features/gates/screens/GateDetailsScreen";
import CostCalculatorScreen from "../../features/cost/screens/CostCalculatorScreen";
import RouteFinderScreen from "../../features/routes/screens/RouteFinderScreen";
import JourneyMemoryScreen from "../../features/favourites/screens/JourneyMemoryScreen";

const BG_COLOR = "#0a0e27";
const PRIMARY_COLOR = "#8b5cf6";

export type RootStackParamList = {
  Home: undefined;
  GateDetails: { gateCode: string };
};

export type TabParamList = {
  Gates: undefined;
  Calculator: undefined;
  RouteFinder: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Gates: "🚪",
    Calculator: "💰",
    RouteFinder: "🗺️",
    Favorites: "⭐",
  };

  const activeColor = PRIMARY_COLOR;
  const inactiveColor = "#6b7280";

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 4 }}>
        {icons[label] || "⭐"}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontWeight: focused ? "600" : "400",
          color: focused ? activeColor : inactiveColor,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: BG_COLOR,
        },
        headerTintColor: PRIMARY_COLOR,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "🌟 Star Seeker" }}
      />
      <Stack.Screen
        name="GateDetails"
        component={GateDetailsScreen}
        options={{ title: "Gate Details" }}
      />
    </Stack.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: BG_COLOR,
            borderTopColor: PRIMARY_COLOR,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: BG_COLOR,
          },
          headerTintColor: PRIMARY_COLOR,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Tab.Screen
          name="Gates"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Gates" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Calculator"
          component={CostCalculatorScreen}
          options={{
            title: "💰 Cost Calculator",
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Calculator" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="RouteFinder"
          component={RouteFinderScreen}
          options={{
            title: "🗺️ Route Finder",
            tabBarIcon: ({ focused }) => (
              <TabIcon label="RouteFinder" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={JourneyMemoryScreen}
          options={{
            title: "⭐ Favorites",
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Favorites" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
