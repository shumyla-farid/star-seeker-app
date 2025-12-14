import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "../atoms/Icons";
import { RouteStopsPath } from "../../../features/routes/components/molecules/RouteStopsPath";
import { Route } from "../../../types";

interface RouteCardProps {
  route: Route;
  costClass?: string;
  currencySymbol?: string;
  badgeIcon?: keyof typeof Ionicons.glyphMap;
  badgeIconClass?: string;
  badgeText?: string;
  badgeBackgroundClass?: string;
  badgeTextClass?: string;
  actions?: ReactNode;
}

export function RouteCard({
  route,
  costClass = "text-primary",
  currencySymbol = "£",
  badgeIcon,
  badgeIconClass = "text-primary",
  badgeText,
  badgeBackgroundClass,
  badgeTextClass,
  actions,
}: RouteCardProps) {
  return (
    <>
      <View className="flex-row items-center justify-between mb-3">
        <View className={`px-3 py-1 rounded-full ${badgeBackgroundClass}`}>
          <View className="flex-row items-center">
            <Ionicons
              name={badgeIcon}
              size={14}
              className={`mr-2 ${badgeIconClass}`}
            />

            <Text className={`text-xs font-bold ${badgeTextClass}`}>
              {badgeText}
            </Text>
          </View>
        </View>

        {actions}
      </View>

      {/* From/To Section */}
      <View className="flex-row items-start justify-between mb-3 pb-3 border-b border-gray-700">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-xs mr-2 text-gray-400">From:</Text>
            <Text className="text-sm font-semibold text-text">
              {route.from.code} - {route.from.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xs mr-2 text-gray-400">To:</Text>
            <Text className="text-sm font-semibold text-text">
              {route.to.code} - {route.to.name}
            </Text>
          </View>
        </View>

        <View className="items-end ml-3">
          <Text className={`text-3xl font-bold ${costClass}`}>
            {currencySymbol}
            {route.totalCost}
          </Text>
        </View>
      </View>

      {/* Route Stops Path */}
      <RouteStopsPath stops={route.route} />
    </>
  );
}
