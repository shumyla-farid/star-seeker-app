import { apiClient } from "../../../shared/api/apiClient";

import { JourneyCostResponse } from "../types/cost.types";

export const transportAPI = {
  getCost: async (
    distance: number,
    passengers: number,
    parking: number,
  ): Promise<JourneyCostResponse> => {
    const response = await apiClient.get(
      `/transport/${distance}?passengers=${passengers}&parking=${parking}`,
    );
    return response.data;
  },
};
