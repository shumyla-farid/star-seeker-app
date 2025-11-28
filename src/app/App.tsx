import "../../global.css";
import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { AppProviders } from "./providers/AppProviders";
import AppNavigator from "./navigation/AppNavigator";

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

export default function App() {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
}
