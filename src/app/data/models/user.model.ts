/**
 * RouteX - User Model
 * Defines user types for Admin, Student, and Driver roles
 */

export type UserRole = 'admin' | 'student' | 'driver';

export interface User {
    id: string;
    email: string;
    password: string; // For mock auth only - never store plain passwords in production!
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    createdAt: Date;

    // Driver-specific fields
    assignedRouteId?: string;
    assignedBusId?: string;
    isTracking?: boolean;
    licenseNumber?: string;

    // Student-specific fields
    studentId?: string;
    favoriteRouteIds?: string[];
    department?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
}
