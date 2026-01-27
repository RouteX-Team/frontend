/**
 * RouteX - User Service
 * Manages students, drivers and admins
 */

import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { MOCK_USERS } from '../mock/users.data';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersState = signal<User[]>(MOCK_USERS);

    readonly users = this.usersState.asReadonly();
    readonly drivers = computed(() => this.usersState().filter(u => u.role === 'driver'));
    readonly students = computed(() => this.usersState().filter(u => u.role === 'student'));

    /**
     * Get user by ID
     */
    getUser(id: string): User | undefined {
        return this.usersState().find(u => u.id === id);
    }

    /**
     * Add new user
     */
    addUser(user: Omit<User, 'id'>): void {
        const newUser: User = {
            ...user,
            id: `user-${Date.now()}`
        };
        this.usersState.update(users => [...users, newUser]);
    }

    /**
     * Update existing user
     */
    updateUser(id: string, updates: Partial<User>): void {
        this.usersState.update(users =>
            users.map(u => u.id === id ? { ...u, ...updates } : u)
        );
    }

    /**
     * Delete user
     */
    deleteUser(id: string): void {
        this.usersState.update(users => users.filter(u => u.id !== id));
    }
}
