import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { routesAPI } from "../api/routesAPI";
import { gatesAPI } from "../../gates/api/gatesAPI";
import { useQuery } from "@tanstack/react-query";
import { SavedRoute, useRoutesStore } from "../store/routesStore";
import { GatePickerInput } from "../components/molecules/GatePickerInput";
import { GatePickerModal } from "../components/organisms/GatePickerModal";
import { CheapestRouteCard } from "../components/organisms/CheapestRouteCard";
import { ErrorBanner } from "../../../shared/components/atoms/ErrorBanner";
import { Route } from "../../../types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RouteFinderScreen() {
  const [fromGate, setFromGate] = useState("");
  const [toGate, setToGate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState<"from" | "to" | null>(null);

  const { toggleFavorite, favouriteRoutes, loadData } = useRoutesStore();

  const {
    data: gatesQueryData,
    isLoading: isLoadingGates,
    isError: isErrorGates,
    refetch: refetchGates,
  } = useQuery({
    queryKey: ["gates"],
    queryFn: () => gatesAPI.getAll(),
    enabled: false,
    retry: false,
  });

  const {
    data: routesQueryData,
    isLoading: isLoadingRoutes,
    isError: isErrorRoutes,
    refetch: refetchRoutes,
  } = useQuery({
    queryKey: ["routes", fromGate, toGate],
    queryFn: () => routesAPI.getRoute(fromGate, toGate),
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    loadData();
    refetchGates();
  }, []);

  const gates =
    gatesQueryData?.sort((a, b) => a.code.localeCompare(b.code)) || [];
  const route = routesQueryData;

  const handleFindRoute = () => {
    if (!fromGate || !toGate) {
      setError("Please select both gates");
      return;
    }

    if (fromGate === toGate) {
      setError("Start and destination must be different");
      return;
    }

    setError(null);
    refetchRoutes();
  };

  const getRouteId = (route: Route) => {
    return `${route.from.code}-${route.to.code}`;
  };

  const isRouteFavorite = route
    ? favouriteRoutes.some((f) => f.id === getRouteId(route))
    : false;

  const handleToggleFavorite = () => {
    if (!route) return;
    const routeId = getRouteId(route);
    toggleFavorite(routeId, route);
  };

  const getGateDisplay = (code: string) => {
    const gate = gates.find((g) => g.code === code);
    return gate ? `${gate.code} - ${gate.name}` : "";
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["bottom"]} // 👈 important
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-4">
          <Animated.Text
            entering={FadeInDown.springify()}
            className="text-2xl font-bold mb-6 text-text"
          >
            Find Available Routes
          </Animated.Text>

          <GatePickerInput
            label="From Gate"
            value={fromGate}
            displayValue={fromGate ? getGateDisplay(fromGate) : undefined}
            placeholder="Select start gate"
            onPress={() => setPickerMode("from")}
            delay={100}
          />

          <GatePickerInput
            label="To Gate"
            value={toGate}
            displayValue={toGate ? getGateDisplay(toGate) : undefined}
            placeholder="Select destination gate"
            onPress={() => setPickerMode("to")}
            delay={200}
          />

          {error && <ErrorBanner message={error} />}
          {isErrorGates && (
            <ErrorBanner message="Failed to load gates. Please try again." />
          )}
          {isErrorRoutes && (
            <ErrorBanner message="Failed to find routes. Please try again." />
          )}

          <TouchableOpacity
            className="py-4 rounded-lg mb-6 bg-primary"
            onPress={handleFindRoute}
            disabled={isLoadingRoutes}
          >
            {isLoadingRoutes ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                Find Routes
              </Text>
            )}
          </TouchableOpacity>

          {route && (
            <CheapestRouteCard
              route={route}
              isCheapest={true}
              isFavorite={isRouteFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </View>
      </ScrollView>

      <GatePickerModal
        visible={pickerMode !== null && !isLoadingGates}
        title={
          pickerMode === "from"
            ? "Select Start Gate"
            : "Select Destination Gate"
        }
        gates={gates}
        onSelect={(code: string) => {
          if (pickerMode === "from") {
            setFromGate(code);
          } else {
            setToGate(code);
          }
          setError(null);
        }}
        onClose={() => setPickerMode(null)}
      />
    </SafeAreaView>
  );
}
