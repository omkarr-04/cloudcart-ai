import type { AuthResponse, LoginDto, RefreshDto, UserSession } from '@cloudcart/shared';

export interface UserEntity extends UserSession {
  passwordHash: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}

export interface RefreshTokenEntity {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}

export interface RefreshTokenRepository {
  create(data: Omit<RefreshTokenEntity, 'id'>): Promise<RefreshTokenEntity>;
  findByUserId(userId: string): Promise<RefreshTokenEntity[]>;
  deleteById(id: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}

export interface AuthServicePort {
  login(credentials: LoginDto): Promise<AuthResponse>;
  refresh(payload: RefreshDto): Promise<AuthResponse>;
  logout(refreshToken: string): Promise<void>;
}
