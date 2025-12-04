import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gate } from "../../../../types";

interface GatePickerModalProps {
  visible: boolean;
  title: string;
  gates: Gate[];
  onSelect: (code: string) => void;
  onClose: () => void;
}

export function GatePickerModal({
  visible,
  title,
  gates,
  onSelect,
  onClose,
}: GatePickerModalProps) {
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  const filteredGates = gates.filter(
    (g) =>
      g.code.toLowerCase().includes(search.toLowerCase()) ||
      g.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (code: string) => {
    onSelect(code);
    setSearch("");
  };

  const handleClose = () => {
    onClose();
    setSearch("");
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top, // 👈 avoid status bar / notch
          paddingBottom: insets.bottom, // 👈 avoid home indicator
          backgroundColor: "#020617",
        }}
      >
        <View className="p-4 border-b border-gray-700">
          <Text className="text-xl font-bold mb-4 text-text">{title}</Text>
          <TextInput
            className="p-3 rounded-lg border border-gray-600 text-text"
            placeholder="Search gates..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredGates}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 border-b border-gray-700"
              onPress={() => {
                handleSelect(item.code);
                handleClose();
              }}
            >
              <Text className="text-lg font-bold mb-1 text-accent">
                {item.code}
              </Text>
              <Text className="text-text">{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          className="p-4 m-4 rounded-lg bg-primary"
          onPress={handleClose}
        >
          <Text className="text-white text-center text-lg font-bold">
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
