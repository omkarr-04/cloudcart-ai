import type { UserRole } from './index';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse extends AuthTokens {
  user: UserSession;
}
