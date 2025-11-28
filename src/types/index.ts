export interface Gate {
  code: string;
  name: string;
  uuid?: string;
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
  segments: RouteSegment[];
  totalCost: number;
  totalDistance: number;
}

export type ThemeType = 'purple' | 'teal';

export interface ThemeColors {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  card: string;
}

