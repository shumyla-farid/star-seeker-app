import "../../global.css";
import React from "react";
import { Platform, UIManager } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "../shared/api/reactQueryNativeEvents";
import { AppProviders } from "./providers/AppProviders";
import AppNavigator from "./navigation/AppNavigator";
// import {
//   logAllAsyncStorage,
//   clearAllAsyncStorage,
// } from "../shared/utils/asyncStorageUtils";

// Enable LayoutAnimations on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

export default function App() {
  // logAllAsyncStorage();

  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}
