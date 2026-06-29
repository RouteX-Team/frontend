import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthApi } from '../api/auth-api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from '../../shared/models/user.model';

const STORAGE_KEY = 'routex.auth';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
}

interface PersistedAuth {
  token: string | null;
  user: User | null;
}

function loadPersisted(): PersistedAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw) as PersistedAuth;
    return { token: parsed.token ?? null, user: parsed.user ?? null };
  } catch {
    return { token: null, user: null };
  }
}

function extractError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.error && typeof err.error === 'object' && 'detail' in err.error) {
      return String((err.error as { detail: unknown }).detail);
    }
    if (err.status === 0) return 'Cannot reach the server. Is the API running?';
    return err.message;
  }
  return 'Something went wrong.';
}

const persisted = loadPersisted();
const initialState: AuthState = {
  user: persisted.user,
  token: persisted.token,
  status: persisted.token ? 'authenticated' : 'idle',
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.token()),
    role: computed<UserRole | null>(() => store.user()?.role ?? null),
    isAdmin: computed(() => store.user()?.role === 'Admin'),
    isDriver: computed(() => store.user()?.role === 'Driver'),
    isStudent: computed(() => store.user()?.role === 'Student'),
    displayName: computed(() => store.user()?.fullName ?? ''),
  })),
  withMethods((store, api = inject(AuthApi)) => {
    function persist(token: string | null, user: User | null): void {
      if (token && user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    function apply(res: AuthResponse): void {
      patchState(store, { user: res.user, token: res.token, status: 'authenticated', error: null });
      persist(res.token, res.user);
    }

    function logout(): void {
      patchState(store, { user: null, token: null, status: 'idle', error: null });
      persist(null, null);
    }

    async function login(body: LoginRequest): Promise<void> {
      patchState(store, { status: 'loading', error: null });
      try {
        apply(await firstValueFrom(api.login(body)));
      } catch (err) {
        patchState(store, { status: 'error', error: extractError(err) });
        throw err;
      }
    }

    async function register(body: RegisterRequest): Promise<void> {
      patchState(store, { status: 'loading', error: null });
      try {
        apply(await firstValueFrom(api.register(body)));
      } catch (err) {
        patchState(store, { status: 'error', error: extractError(err) });
        throw err;
      }
    }

    async function refreshMe(): Promise<void> {
      if (!store.token()) return;
      try {
        const user = await firstValueFrom(api.me());
        patchState(store, { user });
        persist(store.token(), user);
      } catch {
        logout();
      }
    }

    function hasRole(...roles: UserRole[]): boolean {
      const r = store.user()?.role;
      return r != null && roles.includes(r);
    }

    function clearError(): void {
      patchState(store, { error: null });
    }

    return { login, register, logout, refreshMe, hasRole, clearError };
  }),
);
