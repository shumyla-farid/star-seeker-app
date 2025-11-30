import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoutesStore } from "../../routes/store/routesStore";
import { useGatesStore } from "../../gates/store/gatesStore";
import { RootStackParamList } from "../../../app/navigation/AppNavigator";
import { LoadingSpinner } from "../../../shared/components/atoms";
import {
  TabSwitcher,
  TabOption,
} from "../../../shared/components/organisms/TabSwitcher";
import {
  FavouriteRoutesTabContent,
  FavouriteGatesTabContent,
} from "../components";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function FavouritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    favouriteRoutes,
    isLoading: routesLoading,
    loadData: loadRoutesData,
    removeFavorite,
  } = useRoutesStore();
  const {
    favoriteGates,
    isLoading: gatesLoading,
    loadData: loadGatesData,
    removeFavoriteGate,
  } = useGatesStore();
  const [activeTab, setActiveTab] = useState("routes");

  const isLoading = routesLoading || gatesLoading;

  useEffect(() => {
    loadRoutesData();
    loadGatesData();
  }, []);

  const handleDeleteRoute = (id: string) => {
    removeFavorite(id);
  };

  const handleDeleteGate = (gateCode: string) => {
    removeFavoriteGate(gateCode);
  };

  const handleNavigateToGateDetails = (gateCode: string) => {
    navigation.navigate("GateDetails", { gateCode });
  };

  const tabs: TabOption[] = [
    { value: "routes", label: "Routes", count: favouriteRoutes.length ?? 0 },
    { value: "gates", label: "Gates", count: favoriteGates.length ?? 0 },
  ];

  if (isLoading) {
    return <LoadingSpinner color="#a78bfa" />;
  }

  return (
    <View className="flex-1 bg-background">
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "routes" ? (
        <FavouriteRoutesTabContent
          routes={favouriteRoutes}
          onDeleteRoute={handleDeleteRoute}
        />
      ) : (
        <FavouriteGatesTabContent
          gates={favoriteGates}
          onDeleteGate={handleDeleteGate}
          onNavigateToDetails={handleNavigateToGateDetails}
        />
      )}
    </View>
  );
}
