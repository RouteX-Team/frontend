/**
 * RouteX - Auth Service
 * Handles authentication, role management, and session state
 * Uses signals for reactive state management
 */

import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User, UserRole, LoginCredentials, AuthResponse } from '../../data/models';
import { validateCredentials, MOCK_USERS } from '../../data/mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);
    private isBrowser = isPlatformBrowser(this.platformId);

    private readonly STORAGE_KEY = 'rx-auth-user';

    // Private state
    private currentUser = signal<User | null>(this.loadStoredUser());
    private isLoading = signal(false);
    private authError = signal<string | null>(null);

    // Public readonly signals
    readonly user = this.currentUser.asReadonly();
    readonly loading = this.isLoading.asReadonly();
    readonly error = this.authError.asReadonly();

    // Computed properties
    readonly isAuthenticated = computed(() => !!this.currentUser());
    readonly role = computed(() => this.currentUser()?.role ?? null);
    readonly isAdmin = computed(() => this.role() === 'admin');
    readonly isStudent = computed(() => this.role() === 'student');
    readonly isDriver = computed(() => this.role() === 'driver');
    readonly userName = computed(() => this.currentUser()?.name ?? 'Guest');
    readonly userAvatar = computed(() => this.currentUser()?.avatar);

    constructor() {
        // Persist user changes to storage
        effect(() => {
            const user = this.currentUser();
            if (this.isBrowser) {
                if (user) {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
                } else {
                    localStorage.removeItem(this.STORAGE_KEY);
                }
            }
        });
    }

    /**
     * Login with email and password
     */
    login(credentials: LoginCredentials): AuthResponse {
        this.isLoading.set(true);
        this.authError.set(null);

        // Simulate network delay
        const user = validateCredentials(credentials.email, credentials.password);

        this.isLoading.set(false);

        if (user) {
            this.currentUser.set(user);
            return { success: true, user, token: 'mock-jwt-token-' + user.id };
        } else {
            const error = 'Invalid email or password';
            this.authError.set(error);
            return { success: false, error };
        }
    }

    /**
     * Quick login by role (for demo purposes)
     */
    loginAsRole(role: UserRole): AuthResponse {
        const user = MOCK_USERS.find(u => u.role === role);
        if (user) {
            this.currentUser.set(user);
            return { success: true, user };
        }
        return { success: false, error: 'No user found with that role' };
    }

    /**
     * Logout and clear session
     */
    logout(): void {
        this.currentUser.set(null);
        this.authError.set(null);
        this.router.navigate(['/login']);
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: UserRole): boolean {
        return this.role() === role;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: UserRole[]): boolean {
        const currentRole = this.role();
        return currentRole ? roles.includes(currentRole) : false;
    }

    /**
     * Update current user data (for favorites, etc.)
     */
    updateUser(updates: Partial<User>): void {
        const current = this.currentUser();
        if (current) {
            this.currentUser.set({ ...current, ...updates });
        }
    }

    /**
     * Load user from storage (SSR-safe)
     */
    private loadStoredUser(): User | null {
        if (!this.isBrowser) {
            return null;
        }

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored) as User;
            }
        } catch (e) {
            console.error('Failed to load stored user', e);
        }

        return null;
    }

    /**
     * Get redirect path based on role
     */
    getDefaultRoute(): string {
        switch (this.role()) {
            case 'admin':
                return '/admin';
            case 'driver':
                return '/driver';
            case 'student':
                return '/student';
            default:
                return '/login';
        }
    }
}
