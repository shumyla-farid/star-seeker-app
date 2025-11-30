import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteCard } from "../../../../shared/components/organisms";
import Animated, {
  FadeInDown,
  FadeOutRight,
  Layout,
} from "react-native-reanimated";

interface FavouriteRoute {
  id: string;
  totalCost: number;
  from: { code: string; name: string };
  to: { code: string; name: string };
  route: string[];
  timestamp: number;
}

interface FavouriteRouteCardProps {
  route: FavouriteRoute;
  onDelete: (id: string) => void;
  index: number;
}

export function FavouriteRouteCard({
  route,
  onDelete,
  index,
}: FavouriteRouteCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      exiting={FadeOutRight.duration(300)}
      layout={Layout.springify()}
      className={`p-5 rounded-xl mb-4 bg-card border-l-4 border-primary`}
    >
      <RouteCard
        route={route}
        costClass="text-primary"
        badgeIcon="star"
        badgeIconClass="text-primary"
        badgeText={`Saved ${new Date(route.timestamp).toLocaleDateString()}`}
        badgeBackgroundClass="bg-primary/20"
        badgeTextClass="text-primary"
        actions={
          <TouchableOpacity
            onPress={() => onDelete(route.id)}
            className="px-3 py-2 rounded-lg bg-red-500/20"
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        }
      />
    </Animated.View>
  );
}
