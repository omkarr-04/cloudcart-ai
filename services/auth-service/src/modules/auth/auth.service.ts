import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/errors';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '../../config';
import type { AuthResponse, LoginDto, RefreshDto, TokenPayload } from '@cloudcart/shared';
import type { AuthServicePort, UserRepository, RefreshTokenRepository } from './auth.types';

export class AuthService implements AuthServicePort {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  public async login(credentials: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AppError(401, 'Invalid login credentials');
    }

    const validPassword = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!validPassword) {
      throw new AppError(401, 'Invalid login credentials');
    }

    const tokens = this.buildTokens(user);

    // Hash refresh token for DB storage
    const tokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    
    // Parse duration string like '7d' loosely for expiration (assuming 7 days here)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  public async refresh(payload: RefreshDto): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(payload.refreshToken, JWT_REFRESH_TOKEN_SECRET) as TokenPayload;
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError(401, 'Refresh token is invalid');
      }

      // Check DB for active token
      const activeTokens = await this.refreshTokenRepository.findByUserId(user.id);
      let matchedTokenId: string | null = null;
      
      for (const token of activeTokens) {
        const isMatch = await bcrypt.compare(payload.refreshToken, token.tokenHash);
        if (isMatch) {
          matchedTokenId = token.id;
          break;
        }
      }

      if (!matchedTokenId) {
        throw new AppError(401, 'Refresh token has been revoked or is invalid');
      }

      // Revoke the old token (Rotation)
      await this.refreshTokenRepository.deleteById(matchedTokenId);

      const tokens = this.buildTokens(user);

      // Store new token
      const tokenHash = await bcrypt.hash(tokens.refreshToken, 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.refreshTokenRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };
    } catch (error) {
      throw new AppError(401, 'Refresh token is invalid');
    }
  }

  public async logout(refreshToken: string): Promise<void> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET) as TokenPayload;
      const activeTokens = await this.refreshTokenRepository.findByUserId(decoded.userId);
      
      for (const token of activeTokens) {
        const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
        if (isMatch) {
          await this.refreshTokenRepository.deleteById(token.id);
          break;
        }
      }
    } catch (error) {
      // If token is invalid/expired during logout, just ignore as it's harmless
    }
  }

  private buildTokens(user: { id: string; role: string }): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role as TokenPayload['role']
    };

    const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    });

    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });

    return { accessToken, refreshToken };
  }
}
