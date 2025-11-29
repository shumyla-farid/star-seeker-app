import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery } from "@tanstack/react-query";
import { gatesAPI } from "../api/gatesAPI";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { useGatesStore } from "../store/gatesStore";
import { LoadingSpinner } from "../../../shared/components/atoms";
import { ErrorState } from "../../../shared/components/molecules/ErrorState";
import { GateList } from "../components/organisms/GateList";

type GatesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function GatesScreen() {
  const navigation = useNavigation<GatesScreenNavigationProp>();
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

  const handleGatePress = (gateCode: string) => {
    navigation.navigate("GateDetails", { gateCode });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load gates"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <GateList
      gates={gates || []}
      isRefreshing={isLoading}
      onRefresh={() => refetch()}
      isFavoriteGate={isFavoriteGate}
      onGatePress={handleGatePress}
    />
  );
}
