export type UserRole = 'Student' | 'Driver' | 'Admin';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  registrationNo: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  registrationNo?: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}
