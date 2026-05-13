import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { createTestUser } from '../utils/factories';
import prisma from '../../src/infrastructure/database/prisma';
import bcrypt from 'bcryptjs';

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.plainPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      
      // Verify HttpOnly cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.includes('refreshToken='))).toBe(true);
      expect(cookies.some((cookie: string) => cookie.includes('HttpOnly'))).toBe(true);

      // Verify token hash is saved in DB
      const savedTokens = await prisma.refreshToken.findMany({
        where: { userId: user.id }
      });
      expect(savedTokens.length).toBe(1);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid login credentials');
    });
  });

  describe('Security & Middleware', () => {
    it('should return security headers (Helmet)', async () => {
      const response = await request(app).get('/health/live');
      
      expect(response.headers['x-dns-prefetch-control']).toBe('off');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });
});
