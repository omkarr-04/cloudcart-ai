import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';
import { PrismaRefreshTokenRepository } from '../../infrastructure/repositories/prisma-refresh-token.repository';
import { NODE_ENV } from '../../config';

const authService = new AuthService(
  new PrismaUserRepository(),
  new PrismaRefreshTokenRepository()
);

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents XSS attacks from reading the cookie
    secure: NODE_ENV === 'production', // Requires HTTPS in production
    sameSite: 'strict', // Mitigates CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching JWT expiration
  });
};

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const authResponse = await authService.login(req.body);
      setRefreshCookie(res, authResponse.refreshToken);
      return res.status(200).json({ success: true, data: authResponse });
    } catch (error) {
      return next(error);
    }
  }

  public static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Fallback to body to not break existing clients, but prioritize secure cookie
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const authResponse = await authService.refresh({ refreshToken: token });
      setRefreshCookie(res, authResponse.refreshToken);
      return res.status(200).json({ success: true, data: authResponse });
    } catch (error) {
      return next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (token) {
        await authService.logout(token);
      }
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      return next(error);
    }
  }
}
