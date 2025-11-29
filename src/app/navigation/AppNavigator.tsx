import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../../features/gates/screens/HomeScreen";
import GateDetailsScreen from "../../features/gates/screens/GateDetailsScreen";
import CostCalculatorScreen from "../../features/cost/screens/CostCalculatorScreen";
import RouteFinderScreen from "../../features/routes/screens/RouteFinderScreen";
import JourneyMemoryScreen from "../../features/favourites/screens/JourneyMemoryScreen";

const BG_COLOR = "#0a0e27";
const NAV_BG_COLOR = "#0f1432";
const PRIMARY_COLOR = "#8b5cf6";

export type RootStackParamList = {
  Home: undefined;
  GateDetails: { gateCode: string };
  FavoritesList: undefined;
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
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Gates: focused ? "planet" : "planet-outline",
    Cost: focused ? "calculator" : "calculator-outline",
    Routes: focused ? "navigate" : "navigate-outline",
    Saved: focused ? "star" : "star-outline",
  };

  return (
    <View className="items-center justify-center w-16">
      <Ionicons
        name={icons[label] || "star-outline"}
        size={26}
        color={focused ? "#8b5cf6" : "#6b7280"}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className={`text-[10px] mt-1 ${
          focused ? "font-semibold text-primary" : "font-normal text-gray-500"
        }`}
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
          backgroundColor: NAV_BG_COLOR,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(139, 92, 246, 0.2)",
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
        options={{ title: "Star Seeker" }}
      />
      <Stack.Screen
        name="GateDetails"
        component={GateDetailsScreen}
        options={{ title: "Gate Details" }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: NAV_BG_COLOR,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(139, 92, 246, 0.2)",
        },
        headerTintColor: PRIMARY_COLOR,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="FavoritesList"
        component={JourneyMemoryScreen}
        options={{ title: "Favorites" }}
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
            backgroundColor: NAV_BG_COLOR,
            borderTopColor: "rgba(139, 92, 246, 0.3)",
            borderTopWidth: 1,
            height: 75,
            paddingBottom: 8,
            paddingTop: 8,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: NAV_BG_COLOR,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(139, 92, 246, 0.2)",
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
            title: "Cost Calculator",
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Cost" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="RouteFinder"
          component={RouteFinderScreen}
          options={{
            title: "Route Finder",
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Routes" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Saved" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
