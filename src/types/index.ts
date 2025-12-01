export interface GateLink {
  code: string;
  hu: string;
}

export interface Gate {
  code: string;
  name: string;
  system?: string;
  uuid?: string;
  coordinates?: {
    x: number;
    y: number;
    z: number;
  };
  links?: GateLink[];
}

export interface Route {
  from: Gate;
  to: Gate;
  route: string[];
  totalCost: number;
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
