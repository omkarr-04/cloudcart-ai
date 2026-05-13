import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import redis from '../../src/infrastructure/database/redis';

describe('Rate Limiting API', () => {
  beforeEach(async () => {
    await redis.flushall();
  });

  afterEach(async () => {
    await redis.flushall();
  });

  it('should allow requests below the rate limit', async () => {
    // Make 10 requests, which is well below the 100 limit
    for (let i = 0; i < 10; i++) {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      // Even if it returns 401 Unauthorized, it should NOT return 429 Too Many Requests
      expect(response.status).not.toBe(429);
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
    }
  });

  it('should trigger 429 Too Many Requests when limit is exceeded', async () => {
    // Max is 100 per windowMs. We will fire 101 requests.
    const requests = Array.from({ length: 101 }).map(() => 
      request(app)
        .post('/api/auth/login')
        .send({ email: 'spam@example.com', password: 'password123' })
    );

    const responses = await Promise.all(requests);
    
    // The last request should definitely be rate limited
    const lastResponse = responses[100];
    
    expect(lastResponse.status).toBe(429);
    expect(lastResponse.body.success).toBe(false);
    expect(lastResponse.body.message).toContain('Too many requests');
  });
});
