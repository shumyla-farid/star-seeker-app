import React from "react";

import { useSyncQueriesExternal } from "react-query-external-sync";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../shared/api/queryClient";
import { Platform } from "react-native";
import * as ExpoDevice from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

type Props = {
  children: React.ReactNode;
};

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  // optional:
  // throttleTime: 1000,
  key: "react-query-cache-star-seeker",
});

export function AppProviders({ children }: Props) {
  useSyncQueriesExternal({
    queryClient,
    socketURL: "http://localhost:42831", // Default port for React Native DevTools
    deviceName: Platform?.OS || "web", // Platform detection
    platform: Platform?.OS || "web", // Use appropriate platform identifier
    deviceId: Platform?.OS || "web", // Use a PERSISTENT identifier (see note below)
    isDevice: ExpoDevice.isDevice, // Automatically detects real devices vs emulators
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
      // Add any private environment variables you want to monitor
      // Public environment variables are automatically loaded
    },
    // Storage monitoring with CRUD operations
    // mmkvStorage: storage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    // asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    // secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
  });

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: 300_000 }}
        onSuccess={() => {
          // after hydration, React Query has cache available
          // you can optionally refetch to refresh stale data:
          queryClient.invalidateQueries();
        }}
      >
        {/* <QueryClientProvider client={queryClient}> */}
        {children}
        {/* </QueryClientProvider> */}
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
