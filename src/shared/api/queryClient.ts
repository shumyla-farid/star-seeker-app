import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: true, // 3 attempts
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      networkMode: "offlineFirst",
    },
  },
});
