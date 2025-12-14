import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery } from "@tanstack/react-query";
import { gatesAPI } from "../api/gatesAPI";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { useGatesStore } from "../store/gatesStore";
import { LoadingSpinner } from "../../../shared/components/atoms";
import { ErrorState } from "../../../shared/components/molecules/ErrorState";
import { GateList } from "../components/organisms/GateList";
import { View, Text } from "react-native";

type GatesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function GatesScreen() {
  const navigation = useNavigation<GatesScreenNavigationProp>();

  const loadData = useGatesStore((state) => state.loadData);

  const {
    data: gatesQueryData,
    isLoading,
    isError,
    // fetchStatus,
    error,
    refetch,
    // status,
    //isRefetchError,
  } = useQuery({
    queryKey: ["gates"],
    queryFn: () => gatesAPI.getAll(),
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      <View style={{ flex: 1 }}>
        {/* <Text style={{ color: "white" }}>
            {`
          state1: ${status}
          fetchStatus: ${fetchStatus}
          isError: ${isError}
          isRefetchError: ${isRefetchError}
          `}
          </Text> */}

        <ErrorState
          message={error?.message || "Failed to load gates"}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <>
      {/* <View style={{ flex: 1 }}>
        <Text style={{ color: "white" }}>
          {`
        state11: ${status}
        fetchStatus: ${fetchStatus}
        isError: ${isError}
        isRefetchError: ${isRefetchError}
        `}
        </Text>
      </View> */}
      <GateList
        gates={gates || []}
        isRefreshing={isLoading}
        onRefresh={handleRefresh}
        onGatePress={handleGatePress}
      />
    </>
  );
}
