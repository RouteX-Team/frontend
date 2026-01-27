/**
 * RouteX - Bus Model
 * Defines bus entities and their statuses
 */

import { GeoLocation } from './route.model';

export type BusStatus = 'on-route' | 'arriving' | 'delayed' | 'idle' | 'offline' | 'maintenance';

export interface Bus {
    id: string;
    plateNumber: string;
    name?: string;            // e.g., "Bus A", "Express 1"
    capacity: number;
    model?: string;           // e.g., "Toyota Coaster"
    year?: number;
    status: BusStatus;
    currentLocation?: GeoLocation;
    heading?: number;         // Direction in degrees (0-360)
    speed?: number;           // km/h
    lastUpdated?: Date;
    currentRouteId?: string;
    nextStopId?: string;
    eta?: number;             // Minutes to next stop
    fuelLevel?: number;       // Percentage
    isAirConditioned?: boolean;
    features?: string[];      // e.g., ['wifi', 'wheelchair-accessible']
}

export interface BusLocationUpdate {
    busId: string;
    location: GeoLocation;
    heading?: number;
    speed?: number;
    timestamp: Date;
}
