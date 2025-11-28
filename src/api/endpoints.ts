import { apiClient } from "./client";
import { Gate, TransportOption, Route } from "../types";

export const gatesAPI = {
  getAll: async (): Promise<Gate[]> => {
    const response = await apiClient.get("/gates");
    return response.data;
  },

  getDetails: async (gateCode: string): Promise<Gate> => {
    const response = await apiClient.get(`/gates/${gateCode}`);
    return response.data;
  },

  getRoute: async (from: string, to: string): Promise<Route> => {
    const response = await apiClient.get(`/gates/${from}/to/${to}`);
    return response.data;
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
