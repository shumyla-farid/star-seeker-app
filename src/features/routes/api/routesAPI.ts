import { apiClient } from "../../../shared/api/apiClient";
import { Route } from "../../../types";

export const routesAPI = {
  getRoute: async (from: string, to: string): Promise<Route> => {
    const response = await apiClient.get(`/gates/${from}/to/${to}`);
    return response.data;
  },

  getAllRoutes: async (from: string, to: string): Promise<Route[]> => {
    const response = await apiClient.get(`/gates/${from}/to/${to}`);
    return response.data;
  },
};
