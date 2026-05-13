import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { createTestUser } from '../utils/factories';

// We mock the database and redis clients specifically for this test suite
vi.mock('../../src/infrastructure/database/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn().mockRejectedValue(new Error('Simulated Database Connection Timeout')),
    },
    refreshToken: {
      findMany: vi.fn().mockRejectedValue(new Error('Database unavailable')),
    },
    $disconnect: vi.fn(),
  }
}));

vi.mock('../../src/infrastructure/database/redis', () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error('Simulated Redis Timeout')),
    set: vi.fn().mockRejectedValue(new Error('Simulated Redis Timeout')),
    del: vi.fn().mockRejectedValue(new Error('Simulated Redis Timeout')),
    exists: vi.fn().mockRejectedValue(new Error('Simulated Redis Timeout')),
    call: vi.fn().mockRejectedValue(new Error('Simulated Redis Rate Limit Timeout')),
    flushall: vi.fn(),
    quit: vi.fn(),
  }
}));

describe('Resiliency & Failure Handling', () => {
  describe('Prisma Failure Handling', () => {
    it('should degrade gracefully and return a 500 status when the DB is unavailable during login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      // Because Prisma throws, our error middleware should catch it
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
      // Verify correlation ID is still attached even on failure
      expect(response.body).toHaveProperty('correlationId');
    });
  });

  describe('Middleware Failure & Error Propagation', () => {
    it('should handle unhandled synchronous errors safely', async () => {
      // Intentionally cause a malformed JSON error by bypassing the standard JSON parser limit
      // or by forcing a route that throws. We rely on the security edge case test for 400.
      // Here we check if the global error handler traps generic failures.
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{ invalid JSON }');
      
      expect(response.status).toBe(400); // Caught by Express JSON parser, passed to Error Handler
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('correlationId');
    });
  });
});
