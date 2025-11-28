import { apiClient } from "../../../shared/api/apiClient";
import { Gate, Route } from "../../../types";

export const gatesAPI = {
  getAll: async (): Promise<Gate[]> => {
    const response = await apiClient.get("/gates");
    return response.data;
  },

  getDetails: async (gateCode: string): Promise<Gate> => {
    const response = await apiClient.get(`/gates/${gateCode}`);
    return response.data;
  },
};
