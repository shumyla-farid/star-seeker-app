import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { routesAPI } from "../api/routesAPI";
import { gatesAPI } from "../../gates/api/gatesAPI";
import { useQuery } from "@tanstack/react-query";
import { useRoutesStore } from "../store/routesStore";
import { GatePickerInput } from "../components/molecules/GatePickerInput";
import { GatePickerModal } from "../components/organisms/GatePickerModal";
import { CheapestRouteCard } from "../components/organisms/CheapestRouteCard";
import { ErrorBanner } from "../../../shared/components/molecules/ErrorBanner";
import { Button } from "../../../shared/components/atoms/Button";
import { Route } from "../../../types";

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
  } = useQuery({
    queryKey: ["gates"],
    queryFn: () => gatesAPI.getAll(),
  });

  const {
    data: routesQueryData,
    isLoading: isLoadingRoutes,
    isError: isErrorRoutes,
    refetch: refetchRoutes,
    isRefetchError: isRefetchErrorRoutes,
    // status: statusRoutes,
    // fetchStatus: fetchStatusRoutes,
  } = useQuery({
    queryKey: ["routes", fromGate, toGate],
    queryFn: () => routesAPI.getRoute(fromGate, toGate),
    enabled: false,
    retry: false,
    // networkMode: "online",
  });

  useEffect(() => {
    loadData();
  }, []);

  const gates =
    gatesQueryData?.sort((a, b) => a.code.localeCompare(b.code)) || [];

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

  const isRouteFavorite = routesQueryData
    ? favouriteRoutes.some((f) => f.id === getRouteId(routesQueryData))
    : false;

  const handleToggleFavorite = () => {
    if (!routesQueryData) return;
    const routeId = getRouteId(routesQueryData);
    toggleFavorite(routeId, routesQueryData);
  };

  const getGateDisplay = (code: string) => {
    const gate = gates.find((g) => g.code === code);
    return gate ? `${gate.code} - ${gate.name}` : "";
  };

  return (
    <View className="flex-1 bg-background">
      {/* <Text style={{ color: "white" }}>
        {`
        status: ${statusRoutes}
        fetchStatus: ${fetchStatusRoutes}
        isError: ${isErrorRoutes}
        isRefetchError: ${isRefetchErrorRoutes}
        `}
      </Text> */}
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
          {(isErrorRoutes || isRefetchErrorRoutes) && (
            <ErrorBanner message="Failed to find routes. Please try again." />
          )}

          <Button
            className="mb-6"
            onPress={handleFindRoute}
            title="Find Routes"
            isLoading={isLoadingRoutes}
            disabled={isLoadingRoutes}
          />

          {routesQueryData && (
            <CheapestRouteCard
              route={routesQueryData}
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
    </View>
  );
}
