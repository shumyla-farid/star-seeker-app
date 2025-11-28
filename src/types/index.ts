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
  links?: Array<{ code: string; hu: string }>;
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

export type ThemeType = "purple" | "teal";

export interface ThemeColors {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  card: string;
}
