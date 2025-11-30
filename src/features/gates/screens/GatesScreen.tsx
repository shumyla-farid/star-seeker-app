import React, { useCallback, useMemo } from "react";
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
  const favoriteGates = useGatesStore((state) => state.favoriteGates);

  const {
    data: gatesQueryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["gates"],
    queryFn: () => gatesAPI.getAll(),
  });

  const gates = useMemo(
    () => gatesQueryData?.sort((a, b) => a.code.localeCompare(b.code)) || [],
    [gatesQueryData],
  );

  const handleGatePress = useCallback(
    (gateCode: string) => {
      navigation.navigate("GateDetails", { gateCode });
    },
    [navigation],
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load gates"}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <GateList
      gates={gates || []}
      isRefreshing={isLoading}
      onRefresh={handleRefresh}
      favoriteGates={favoriteGates}
      onGatePress={handleGatePress}
    />
  );
}
