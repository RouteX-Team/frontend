export interface Stop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface StopInput {
  name: string;
  latitude: number;
  longitude: number;
}

export interface RouteStop {
  id: number;
  stopId: number;
  stopName: string;
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface RouteSummary {
  id: number;
  name: string;
  number: string;
  description: string | null;
  isActive: boolean;
  stopCount: number;
}

export interface RouteDetail {
  id: number;
  name: string;
  number: string;
  description: string | null;
  isActive: boolean;
  stops: RouteStop[];
}

export interface RouteStopInput {
  stopId: number;
  sequence: number;
}

export interface RouteInput {
  name: string;
  number: string;
  description?: string | null;
  isActive: boolean;
  stops: RouteStopInput[];
}

export interface Schedule {
  id: number;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: string;
}

export interface ScheduleInput {
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: string;
}
