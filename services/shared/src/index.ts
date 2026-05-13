export type UserRole = 'admin' | 'merchant' | 'customer';

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export type { AuthResponse, LoginDto, RefreshDto, UserSession, AuthTokens } from './auth';
