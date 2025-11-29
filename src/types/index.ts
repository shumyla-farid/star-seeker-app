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

export interface TransportOption {
  vehicleType: string;
  cost: number;
  capacity: number;
}

export interface RouteSegment {
  from: string;
  to: string;
  cost: number;
  distance: number;
}

export interface Route {
  from: Gate;
  to: Gate;
  route: string[];
  totalCost: number;
}
