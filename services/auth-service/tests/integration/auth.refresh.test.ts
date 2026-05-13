import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { createTestUser } from '../utils/factories';
import prisma from '../../src/infrastructure/database/prisma';

describe('Refresh Token API', () => {
  it('should successfully refresh access token and rotate refresh token', async () => {
    const user = await createTestUser();

    // 1. Initial Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.plainPassword });

    const initialRefreshToken = loginRes.body.data.refreshToken;

    // 2. Refresh the token
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: initialRefreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data).toHaveProperty('accessToken');
    expect(refreshRes.body.data.refreshToken).not.toBe(initialRefreshToken);

    const newRefreshToken = refreshRes.body.data.refreshToken;

    // 3. Verify DB state (Old token deleted, new token stored)
    const savedTokens = await prisma.refreshToken.findMany({
      where: { userId: user.id }
    });
    
    // Because it's a rotation, the count should remain 1, just updated
    expect(savedTokens.length).toBe(1);

    // 4. Verify old token is now rejected (Replay attack prevention)
    const rejectedRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: initialRefreshToken });

    expect(rejectedRes.status).toBe(401);
    expect(rejectedRes.body.message).toBe('Refresh token has been revoked or is invalid');
  });

  it('should reject malformed or fake refresh tokens', async () => {
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'fake.jwt.token' });

    expect(refreshRes.status).toBe(401);
    expect(refreshRes.body.message).toBe('Refresh token is invalid');
  });
});
