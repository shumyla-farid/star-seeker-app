import { apiClient } from "../../../shared/api/apiClient";
import { Gate, TransportOption, Route } from "../../../types";
import { RouteResponse } from "../types/route.types";

export const routesAPI = {
  getRoute: async (from: string, to: string): Promise<Route> => {
    const response = await apiClient.get(`/gates/${from}/to/${to}`);
    return response.data;
  },

  getAllRoutes: async (from: string, to: string): Promise<Route[]> => {
    // Try to get all routes - the API might not support this parameter
    // Alternative parameters to try: ?all=true, ?multiple=true, or just the base endpoint
    try {
      const response = await apiClient.get(`/gates/${from}/to/${to}?all=true`);
      console.log(
        "API Response for all routes:",
        JSON.stringify(response.data, null, 2),
      );
      console.log("Response is array?", Array.isArray(response.data));
      // If API returns single route, wrap in array. Otherwise return the array.
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.log(
        "Error fetching all routes, falling back to single route:",
        error,
      );
      // Fallback to regular endpoint if ?all=true not supported
      const response = await apiClient.get(`/gates/${from}/to/${to}`);
      return [response.data];
    }
  },
};

export const transportAPI = {
  getCost: async (
    distance: number,
    passengers: number,
    parking: number,
  ): Promise<TransportOption[]> => {
    const response = await apiClient.get(
      `/transport/${distance}?passengers=${passengers}&parking=${parking}`,
    );
    return response.data;
  },
};
