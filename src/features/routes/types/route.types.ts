export type GateLink = {
  hu: string; // distance/cost-ish unit, you can treat as number later
  code: string; // destination gate code
};

export type Gate = {
  uuid: string;
  updatedAt: number | null;
  createdAt: number;
  name: string;
  code: string;
  links: GateLink[];
};

export type RouteResponse = {
  from: Gate;
  to: Gate;
  route: string[]; // e.g. ["RAN", "SOL", "PRX"]
  totalCost: number;
};
