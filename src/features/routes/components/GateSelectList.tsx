import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Gate } from "../../../types";
import { FlashList } from "@shopify/flash-list";

const CARD_BG_COLOR = "#1e1b4b";
const TEXT_COLOR = "#e9d5ff";

type Props = {
  visible: boolean;
  onClose: () => void;
  gates: Gate[];
  title: string;
  onSelect: (gateCode: string) => void;
};

export function GateSelectModal({
  visible,
  onClose,
  gates,
  title,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredGates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return gates;
    return gates.filter(
      (g) =>
        g.code.toLowerCase().includes(q) || g.name.toLowerCase().includes(q),
    );
  }, [gates, search]);

  const handleSelect = (code: string) => {
    onSelect(code);
    onClose();
  };

  return (
    <FlashList
      data={filteredGates}
      estimatedItemSize={60}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: CARD_BG_COLOR,
          }}
          onPress={() => handleSelect(item.code)}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: TEXT_COLOR }}>
            {item.code} – {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
