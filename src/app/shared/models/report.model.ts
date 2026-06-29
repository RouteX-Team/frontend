export interface RouteUsage {
  routeId: number;
  routeNumber: string;
  routeName: string;
  tripCount: number;
  completedTripCount: number;
  distinctBusCount: number;
  totalPings: number;
  lastTripStartedAt: string | null;
}

export interface RouteUsageReport {
  fromUtc: string;
  toUtc: string;
  rows: RouteUsage[];
}
