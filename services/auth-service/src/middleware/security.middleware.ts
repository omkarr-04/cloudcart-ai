import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../infrastructure/database/redis';
import { NODE_ENV } from '../config';

// 1. Helmet configuration for secure HTTP headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
});

// 2. CORS Strategy
export const corsMiddleware = cors({
  origin: NODE_ENV === 'production' ? ['https://cloudcart.ai'] : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// 3. Rate Limiting using Redis
export const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, 
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// 4. Request payload sanitization (Oversized requests and generic limits)
export const sanitizePayloadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // express.json() with limit already handles basic size.
  // We can strip out specific forbidden keys if necessary.
  if (req.body && typeof req.body === 'object') {
    // Prevent prototype pollution or basic NoSQL injection patterns if using NoSQL.
    // For Prisma (SQL), parameterized queries handle SQL injection automatically.
    // But we still sanitize reserved keys.
    const forbiddenKeys = ['$where', '$ne', '$gt', '$lt'];
    for (const key of Object.keys(req.body)) {
      if (forbiddenKeys.includes(key)) {
        delete req.body[key];
      }
    }
  }
  next();
};
