/**
 * RouteX - Mock Users Data
 * Dummy accounts for testing all three roles
 */

import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
    // Admin Users
    {
        id: 'admin-001',
        email: 'admin@routex.edu',
        password: 'admin123',
        name: 'Dr. Sarah Ahmed',
        role: 'admin',
        phone: '+92-300-1234567',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        createdAt: new Date('2024-01-01')
    },
    {
        id: 'admin-002',
        email: 'transport@routex.edu',
        password: 'transport123',
        name: 'Muhammad Ali Khan',
        role: 'admin',
        phone: '+92-321-9876543',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
        createdAt: new Date('2024-01-15')
    },

    // Driver Users
    {
        id: 'driver-001',
        email: 'driver1@routex.edu',
        password: 'driver123',
        name: 'Imran Hassan',
        role: 'driver',
        phone: '+92-333-1112223',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Imran',
        assignedRouteId: 'route-001',
        assignedBusId: 'bus-001',
        isTracking: false,
        licenseNumber: 'LHR-DL-2020-4567',
        createdAt: new Date('2024-02-01')
    },
    {
        id: 'driver-002',
        email: 'driver2@routex.edu',
        password: 'driver123',
        name: 'Rashid Mehmood',
        role: 'driver',
        phone: '+92-345-4445556',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rashid',
        assignedRouteId: 'route-002',
        assignedBusId: 'bus-002',
        isTracking: false,
        licenseNumber: 'LHR-DL-2019-8901',
        createdAt: new Date('2024-02-10')
    },
    {
        id: 'driver-003',
        email: 'driver3@routex.edu',
        password: 'driver123',
        name: 'Tariq Jameel',
        role: 'driver',
        phone: '+92-301-7778889',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq',
        assignedRouteId: 'route-003',
        assignedBusId: 'bus-003',
        isTracking: false,
        licenseNumber: 'LHR-DL-2021-2345',
        createdAt: new Date('2024-03-01')
    },

    // Student Users
    {
        id: 'student-001',
        email: 'ahmed.ali@student.routex.edu',
        password: 'student123',
        name: 'Ahmed Ali',
        role: 'student',
        phone: '+92-311-1234567',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
        studentId: 'FA21-BCS-001',
        department: 'Computer Science',
        favoriteRouteIds: ['route-001', 'route-003'],
        createdAt: new Date('2024-01-20')
    },
    {
        id: 'student-002',
        email: 'fatima.khan@student.routex.edu',
        password: 'student123',
        name: 'Fatima Khan',
        role: 'student',
        phone: '+92-322-2345678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
        studentId: 'FA21-BBA-045',
        department: 'Business Administration',
        favoriteRouteIds: ['route-002'],
        createdAt: new Date('2024-01-22')
    },
    {
        id: 'student-003',
        email: 'usman.raza@student.routex.edu',
        password: 'student123',
        name: 'Usman Raza',
        role: 'student',
        phone: '+92-333-3456789',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Usman',
        studentId: 'FA22-EE-112',
        department: 'Electrical Engineering',
        favoriteRouteIds: [],
        createdAt: new Date('2024-02-05')
    },
    {
        id: 'student-004',
        email: 'ayesha.nawaz@student.routex.edu',
        password: 'student123',
        name: 'Ayesha Nawaz',
        role: 'student',
        phone: '+92-344-4567890',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha',
        studentId: 'FA20-CS-089',
        department: 'Computer Science',
        favoriteRouteIds: ['route-001'],
        createdAt: new Date('2024-01-25')
    }
];

/**
 * Get user by email for login
 */
export function findUserByEmail(email: string): User | undefined {
    return MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Validate user credentials
 */
export function validateCredentials(email: string, password: string): User | null {
    const user = findUserByEmail(email);
    if (user && user.password === password) {
        return user;
    }
    return null;
}
