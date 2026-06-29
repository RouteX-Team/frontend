export interface LiveBus {
  busId: number;
  busNumber: string;
  routeId: number;
  routeName: string;
  tripId: number;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: string;
  isStale: boolean;
}

export interface Trip {
  id: number;
  busId: number;
  busNumber: string;
  routeId: number;
  routeName: string;
  driverId: number;
  driverName: string;
  startedAt: string;
  endedAt: string | null;
  status: 'Active' | 'Completed';
}

export interface StartTripRequest {
  busId: number;
  routeId: number;
}

export interface StopEta {
  stopId: number;
  stopName: string;
  routeId: number;
  routeName: string;
  hasActiveBus: boolean;
  busId: number | null;
  busNumber: string | null;
  distanceMeters: number | null;
  etaSeconds: number | null;
  etaText: string;
  nextScheduledDeparture: string | null;
}
