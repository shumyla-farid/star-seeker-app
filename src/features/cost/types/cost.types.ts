export type JourneyCostResponse = {
  recommendedTransport: RecommendedTransport;
  journeyCost: number;
  parkingFee: number;
  currency: string;
};

export type RecommendedTransport = {
  name: string;
  ratePerAu: number;
};
