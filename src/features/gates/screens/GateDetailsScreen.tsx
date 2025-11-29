import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { gatesAPI } from "../api/gatesAPI";
import { Gate } from "../../../types";
import { useGatesStore } from "../store/gatesStore";
import { LoadingSpinner } from "../../../shared/components/atoms";
import { ErrorState } from "../../../shared/components/molecules";
import {
  GateDetailsHeader,
  GateConnectionsList,
} from "../components/organisms";

export default function GateDetailsScreen() {
  const route = useRoute();
  const { gateCode } = route.params as { gateCode: string };
  const [gate, setGate] = useState<Gate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleFavoriteGate, isFavoriteGate } = useGatesStore();
  const isFavorite = gate ? isFavoriteGate(gate.code) : false;

  useEffect(() => {
    fetchGateDetails();
  }, [gateCode]);

  const fetchGateDetails = async () => {
    try {
      setLoading(true);
      const data = await gatesAPI.getDetails(gateCode);
      setGate(data);
      setError(null);
    } catch (err) {
      setError("Failed to load gate details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !gate) {
    return (
      <ErrorState
        message={error || "Gate not found"}
        onRetry={fetchGateDetails}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16 }}
    >
      <GateDetailsHeader
        gate={gate}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavoriteGate(gate)}
      />

      <GateConnectionsList links={gate.links || []} />
    </ScrollView>
  );
}
