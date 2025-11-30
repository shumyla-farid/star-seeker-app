import NetInfo from "@react-native-community/netinfo";
import { AppState, Platform } from "react-native";
import { onlineManager, focusManager } from "@tanstack/react-query";

// Online/offline detection
onlineManager.setEventListener((setOnline) => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    // treat "internetReachable === false" as offline
    const isOnline = !!state.isConnected && state.isInternetReachable !== false;
    setOnline(isOnline);
  });

  return unsubscribe;
});

// Focus detection (like "window focus" on web)
focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener("change", (status) => {
    if (status === "active") {
      handleFocus();
    }
  });

  return () => {
    subscription.remove();
  };
});
