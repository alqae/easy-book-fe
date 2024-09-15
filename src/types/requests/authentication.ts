import { UserRole } from '../enums';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  phoneNumber?: string;
  email?: string;
  password: string;
  token?: string;
  role: UserRole;
  description?: string;
  address?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  confirmPassword: String;
  password: String;
  token: String;
}

export interface AuthenticationSuccessResponse {
  token: string;
}
