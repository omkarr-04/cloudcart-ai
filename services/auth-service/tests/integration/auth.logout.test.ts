import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { createTestUser } from '../utils/factories';
import prisma from '../../src/infrastructure/database/prisma';

describe('Logout API', () => {
  it('should successfully logout and revoke the token in DB', async () => {
    const user = await createTestUser();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.plainPassword });

    const refreshToken = loginRes.body.data.refreshToken;
    
    // Ensure it exists in DB
    const tokensBefore = await prisma.refreshToken.findMany({ where: { userId: user.id }});
    expect(tokensBefore.length).toBe(1);

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    // Ensure it was deleted from DB
    const tokensAfter = await prisma.refreshToken.findMany({ where: { userId: user.id }});
    expect(tokensAfter.length).toBe(0);

    // Verify clear-cookie header is sent
    const cookies = logoutRes.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.includes('refreshToken=;'))).toBe(true);
  });

  it('should successfully clear cookie even if token is missing/invalid', async () => {
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'invalid.token' });

    expect(logoutRes.status).toBe(200);
    const cookies = logoutRes.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.includes('refreshToken=;'))).toBe(true);
  });
});
