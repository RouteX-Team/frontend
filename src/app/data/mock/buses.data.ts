/**
 * RouteX - Mock Buses Data
 * University fleet of buses
 */

import { Bus } from '../models/bus.model';

export const MOCK_BUSES: Bus[] = [
    {
        id: 'bus-001',
        plateNumber: 'RXB-1234',
        name: 'Campus Cruiser 1',
        capacity: 45,
        model: 'Toyota Coaster',
        year: 2022,
        status: 'on-route',
        currentLocation: { lat: 33.6850, lng: 73.0490 },
        heading: 45,
        speed: 25,
        lastUpdated: new Date(),
        currentRouteId: 'route-001',
        nextStopId: 'stop-library',
        eta: 3,
        fuelLevel: 78,
        isAirConditioned: true,
        features: ['wifi', 'wheelchair-accessible', 'usb-charging']
    },
    {
        id: 'bus-002',
        plateNumber: 'RXB-5678',
        name: 'Hostel Hopper',
        capacity: 35,
        model: 'Hino Liesse',
        year: 2021,
        status: 'arriving',
        currentLocation: { lat: 33.6830, lng: 73.0450 },
        heading: 120,
        speed: 15,
        lastUpdated: new Date(),
        currentRouteId: 'route-002',
        nextStopId: 'stop-girls-hostel',
        eta: 1,
        fuelLevel: 55,
        isAirConditioned: true,
        features: ['wheelchair-accessible']
    },
    {
        id: 'bus-003',
        plateNumber: 'RXB-9012',
        name: 'Library Link',
        capacity: 30,
        model: 'Isuzu Journey',
        year: 2023,
        status: 'delayed',
        currentLocation: { lat: 33.6835, lng: 73.0460 },
        heading: 270,
        speed: 0,
        lastUpdated: new Date(Date.now() - 120000), // 2 minutes ago
        currentRouteId: 'route-003',
        nextStopId: 'stop-main-gate',
        eta: 8,
        fuelLevel: 90,
        isAirConditioned: true,
        features: ['wifi', 'usb-charging']
    },
    {
        id: 'bus-004',
        plateNumber: 'RXB-3456',
        name: 'Evening Express',
        capacity: 40,
        model: 'Toyota Coaster',
        year: 2020,
        status: 'idle',
        currentLocation: { lat: 33.6840, lng: 73.0465 },
        lastUpdated: new Date(),
        fuelLevel: 65,
        isAirConditioned: true,
        features: ['wifi']
    },
    {
        id: 'bus-005',
        plateNumber: 'RXB-7890',
        name: 'Reserve Unit',
        capacity: 45,
        model: 'Hino Liesse',
        year: 2019,
        status: 'maintenance',
        currentLocation: { lat: 33.6842, lng: 73.0468 },
        lastUpdated: new Date(Date.now() - 86400000), // 1 day ago
        fuelLevel: 30,
        isAirConditioned: false,
        features: []
    }
];

/**
 * Get all active buses (not in maintenance or offline)
 */
export function getActiveBuses(): Bus[] {
    return MOCK_BUSES.filter(bus =>
        bus.status !== 'maintenance' && bus.status !== 'offline'
    );
}

/**
 * Get bus by ID
 */
export function getBusById(id: string): Bus | undefined {
    return MOCK_BUSES.find(bus => bus.id === id);
}

/**
 * Get buses currently on a specific route
 */
export function getBusesByRoute(routeId: string): Bus[] {
    return MOCK_BUSES.filter(bus => bus.currentRouteId === routeId);
}
