import "../../global.css";
import React from "react";
import { Platform, UIManager } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "../shared/api/reactQueryNativeEvents";
import { AppProviders } from "./providers/AppProviders";
import AppNavigator from "./navigation/AppNavigator";
import {
  clearAllAsyncStorage,
  logAllAsyncStorage,
} from "../shared/utils/asyncStorageUtils";

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

export default function App() {
  // logAllAsyncStorage();
  // clearAllAsyncStorage();

  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}
