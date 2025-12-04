export interface GateLink {
  code: string;
  hu: string;
}

export interface Gate {
  code: string;
  name: string;
  links?: GateLink[];
}

export interface FavouriteGate extends Gate {
  timestamp: number;
}

export interface Route {
  from: Gate;
  to: Gate;
  route: string[];
  totalCost: number;
}

export interface FavouriteRoute extends Route {
  id: string;
  timestamp: number;
}

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
