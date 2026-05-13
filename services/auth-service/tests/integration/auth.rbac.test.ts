import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { requireAuth, requireRole } from '../../src/middleware/auth.middleware';
import { errorHandler } from '../../src/middleware/error.middleware';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../../src/config';
import { randomUUID } from 'crypto';

describe('RBAC & Auth Middleware', () => {
  // Create an isolated Express app purely for testing the middleware
  const testApp = express();
  
  testApp.get('/protected', requireAuth, (req, res) => {
    res.json({ success: true, user: req.user });
  });

  testApp.get('/admin-only', requireAuth, requireRole(['admin']), (req, res) => {
    res.json({ success: true });
  });

  testApp.get('/merchant-only', requireAuth, requireRole(['merchant']), (req, res) => {
    res.json({ success: true });
  });

  testApp.use(errorHandler);

  const generateToken = (role: string) => {
    return jwt.sign({ userId: randomUUID(), role }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  };

  it('should reject requests without authorization header', async () => {
    const response = await request(testApp).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized: Missing or invalid token format');
  });

  it('should reject malformed tokens', async () => {
    const response = await request(testApp)
      .get('/protected')
      .set('Authorization', 'Bearer fake-token-123');
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized: Invalid or expired token');
  });

  it('should allow access with valid token', async () => {
    const token = generateToken('customer');
    const response = await request(testApp)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toHaveProperty('userId');
    expect(response.body.user.role).toBe('customer');
  });

  it('should enforce role restrictions (Forbidden)', async () => {
    const customerToken = generateToken('customer');
    const response = await request(testApp)
      .get('/admin-only')
      .set('Authorization', `Bearer ${customerToken}`);
    
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden: Requires one of roles: admin');
  });

  it('should allow valid roles (Authorized)', async () => {
    const adminToken = generateToken('admin');
    const response = await request(testApp)
      .get('/admin-only')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
