/**
 * RouteX - Mock Routes Data
 * University bus routes with stops (Islamabad/Rawalpindi area)
 */

import { Route, Stop } from '../models/route.model';

// Reusable stops (many routes share common stops)
const STOPS = {
    mainGate: {
        id: 'stop-main-gate',
        name: 'Main Gate',
        shortName: 'Main',
        location: { lat: 33.6844, lng: 73.0479 },
        order: 0,
        address: 'University Main Entrance',
        isMainStop: true
    },
    library: {
        id: 'stop-library',
        name: 'Central Library',
        shortName: 'Library',
        location: { lat: 33.6856, lng: 73.0492 },
        order: 1,
        address: 'Near Central Library Building',
        isMainStop: true
    },
    cafeteria: {
        id: 'stop-cafeteria',
        name: 'Cafeteria',
        shortName: 'Cafe',
        location: { lat: 33.6861, lng: 73.0510 },
        order: 2,
        address: 'Student Cafeteria Area'
    },
    adminBlock: {
        id: 'stop-admin',
        name: 'Admin Block',
        shortName: 'Admin',
        location: { lat: 33.6870, lng: 73.0525 },
        order: 3,
        address: 'Administrative Building'
    },
    boysHostel: {
        id: 'stop-boys-hostel',
        name: 'Boys Hostel',
        shortName: 'BH',
        location: { lat: 33.6832, lng: 73.0445 },
        order: 4,
        address: 'Boys Hostel Complex',
        isMainStop: true
    },
    girlsHostel: {
        id: 'stop-girls-hostel',
        name: 'Girls Hostel',
        shortName: 'GH',
        location: { lat: 33.6825, lng: 73.0460 },
        order: 5,
        address: 'Girls Hostel Complex',
        isMainStop: true
    },
    sportsComplex: {
        id: 'stop-sports',
        name: 'Sports Complex',
        shortName: 'Sports',
        location: { lat: 33.6880, lng: 73.0540 },
        order: 6,
        address: 'Sports & Recreation Center'
    },
    engineering: {
        id: 'stop-engineering',
        name: 'Engineering Block',
        shortName: 'Eng',
        location: { lat: 33.6875, lng: 73.0505 },
        order: 7,
        address: 'Faculty of Engineering'
    },
    business: {
        id: 'stop-business',
        name: 'Business School',
        shortName: 'BBA',
        location: { lat: 33.6865, lng: 73.0475 },
        order: 8,
        address: 'Faculty of Business Administration'
    },
    parking: {
        id: 'stop-parking',
        name: 'Parking Area',
        shortName: 'Park',
        location: { lat: 33.6840, lng: 73.0465 },
        order: 9,
        address: 'Main Parking Lot'
    }
};

export const MOCK_ROUTES: Route[] = [
    {
        id: 'route-001',
        name: 'Main Campus Loop',
        shortCode: 'R1',
        description: 'Circular route covering all major campus buildings',
        color: '#6366f1', // Indigo - Primary
        stops: [
            { ...STOPS.mainGate, order: 1 },
            { ...STOPS.library, order: 2 },
            { ...STOPS.cafeteria, order: 3 },
            { ...STOPS.adminBlock, order: 4 },
            { ...STOPS.engineering, order: 5 },
            { ...STOPS.business, order: 6 },
            { ...STOPS.sportsComplex, order: 7 },
            { ...STOPS.mainGate, id: 'stop-main-gate-return', order: 8 }
        ],
        estimatedDuration: 25,
        frequency: 15,
        isActive: true,
        operatingHours: { start: '07:00', end: '22:00' },
        assignedDriverId: 'driver-001',
        assignedBusId: 'bus-001'
    },
    {
        id: 'route-002',
        name: 'Hostel Express',
        shortCode: 'HX',
        description: 'Quick connection between hostels and main campus',
        color: '#10b981', // Emerald - Success
        stops: [
            { ...STOPS.boysHostel, order: 1 },
            { ...STOPS.girlsHostel, order: 2 },
            { ...STOPS.parking, order: 3 },
            { ...STOPS.mainGate, order: 4 },
            { ...STOPS.library, order: 5 },
            { ...STOPS.cafeteria, order: 6 }
        ],
        estimatedDuration: 15,
        frequency: 10,
        isActive: true,
        operatingHours: { start: '06:30', end: '23:00' },
        assignedDriverId: 'driver-002',
        assignedBusId: 'bus-002'
    },
    {
        id: 'route-003',
        name: 'Library Shuttle',
        shortCode: 'LIB',
        description: 'Direct route to Central Library from all points',
        color: '#f59e0b', // Amber - Warning color for visibility
        stops: [
            { ...STOPS.boysHostel, order: 1 },
            { ...STOPS.girlsHostel, order: 2 },
            { ...STOPS.mainGate, order: 3 },
            { ...STOPS.library, order: 4 }
        ],
        estimatedDuration: 12,
        frequency: 20,
        isActive: true,
        operatingHours: { start: '08:00', end: '21:00' },
        assignedDriverId: 'driver-003',
        assignedBusId: 'bus-003'
    },
    {
        id: 'route-004',
        name: 'Evening Route',
        shortCode: 'EVE',
        description: 'Extended evening service for late classes',
        color: '#8b5cf6', // Violet
        stops: [
            { ...STOPS.mainGate, order: 1 },
            { ...STOPS.library, order: 2 },
            { ...STOPS.engineering, order: 3 },
            { ...STOPS.boysHostel, order: 4 },
            { ...STOPS.girlsHostel, order: 5 }
        ],
        estimatedDuration: 18,
        frequency: 30,
        isActive: false, // Only active in evening
        operatingHours: { start: '18:00', end: '23:30' }
    }
];

/**
 * Get all active routes
 */
export function getActiveRoutes(): Route[] {
    return MOCK_ROUTES.filter(route => route.isActive);
}

/**
 * Get route by ID
 */
export function getRouteById(id: string): Route | undefined {
    return MOCK_ROUTES.find(route => route.id === id);
}

/**
 * Export stops for reuse
 */
export { STOPS };
