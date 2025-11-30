import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export interface TabOption {
  value: string;
  label: string;
  count?: number;
}

interface TabSwitcherProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwitcher({
  tabs,
  activeTab,
  onTabChange,
}: TabSwitcherProps) {
  return (
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row bg-card rounded-xl p-1">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onTabChange(tab.value)}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === tab.value ? "bg-primary" : "bg-transparent"
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === tab.value ? "text-white" : "text-gray-400"
              }`}
            >
              {`${tab.label} (${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
