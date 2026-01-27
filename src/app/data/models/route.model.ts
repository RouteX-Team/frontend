/**
 * RouteX - Route & Stop Models
 * Defines bus routes and their stops
 */

export interface GeoLocation {
    lat: number;
    lng: number;
}

export interface Stop {
    id: string;
    name: string;
    shortName?: string;
    location: GeoLocation;
    order: number;
    address?: string;
    isMainStop?: boolean; // Major stops like library, hostel, etc.
}

export interface Route {
    id: string;
    name: string;
    shortCode: string;        // e.g., "R1", "EXP", "HOSTEL"
    description?: string;
    color: string;            // Hex color for map display
    stops: Stop[];
    estimatedDuration: number; // Total route duration in minutes
    frequency: number;        // How often bus runs in minutes
    isActive: boolean;
    operatingHours: {
        start: string;          // e.g., "07:00"
        end: string;            // e.g., "22:00"
    };
    assignedDriverId?: string;
    assignedBusId?: string;
}

export interface RouteWithLiveData extends Route {
    currentBusLocation?: GeoLocation;
    nextStopId?: string;
    etaToNextStop?: number; // minutes
    status: 'active' | 'delayed' | 'completed' | 'not-started';
}
