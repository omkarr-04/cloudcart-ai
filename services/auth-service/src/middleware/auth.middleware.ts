import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';
import { JWT_ACCESS_TOKEN_SECRET } from '../config';
import type { TokenPayload } from '@cloudcart/shared';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized: Missing or invalid token format');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError(401, 'Unauthorized: Invalid or expired token');
  }
};

export const requireRole = (roles: Array<TokenPayload['role']>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized: User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, `Forbidden: Requires one of roles: ${roles.join(', ')}`);
    }

    next();
  };
};
