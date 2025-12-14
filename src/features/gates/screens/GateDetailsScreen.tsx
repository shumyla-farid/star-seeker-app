import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { gatesAPI } from "../api/gatesAPI";
import { Gate } from "../../../types";
import { useGatesStore } from "../store/gatesStore";
import { LoadingSpinner } from "../../../shared/components/atoms";
import { ErrorState } from "../../../shared/components/molecules";
import {
  GateDetailsHeader,
  GateConnectionsList,
} from "../components/organisms";
import { useQuery } from "@tanstack/react-query";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";

type GateDetailsRouteProp = RouteProp<RootStackParamList, "GateDetails">;

export default function GateDetailsScreen() {
  const route = useRoute<GateDetailsRouteProp>();
  const { gateCode } = route.params;

  const { toggleFavoriteGate, isFavoriteGate } = useGatesStore();

  const {
    data: gatesQueryData,
    isLoading,
    isError,
    // fetchStatus,
    error,
    refetch,
    // status,
  } = useQuery({
    queryKey: ["gatesdetails", gateCode],
    queryFn: () => gatesAPI.getDetails(gateCode),
  });
  const isFavorite = gatesQueryData
    ? isFavoriteGate(gatesQueryData.code)
    : false;

  const handleRefresh = () => refetch();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !gatesQueryData) {
    return (
      <View style={{ flex: 1 }}>
        {/* <Text style={{ color: "white" }}>
          {` fetchStatus: ${fetchStatus}
        isError: ${isError}
        state: ${status}`}
        </Text> */}

        <ErrorState
          message={error?.message || "Failed to load gates"}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
    >
      <GateDetailsHeader
        gate={gatesQueryData}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavoriteGate(gatesQueryData)}
      />

      <GateConnectionsList links={gatesQueryData.links || []} />
    </ScrollView>
  );
}
