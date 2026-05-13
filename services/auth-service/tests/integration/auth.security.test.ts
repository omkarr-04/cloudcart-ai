import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Security Edge Cases', () => {
  it('should reject requests with completely invalid JSON payloads (Parse Error)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": "test@example.com", "password": "password123", }'); // Trailing comma makes it invalid JSON
      
    // Express JSON parser catches this and returns 400
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Unexpected token');
  });

  it('should reject oversized payloads to prevent buffer attacks', async () => {
    const hugeString = 'a'.repeat(20000); // 20kb, limit is 10kb
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: hugeString });
      
    expect(response.status).toBe(413); // Payload Too Large
  });

  it('should sanitize restricted payload keys (NoSQL injection simulation)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      // Attempting to pass a $gt operator or similar
      .send({ email: 'test@example.com', password: { $gt: '' } });
      
    // Zod validation should catch this because password is expected to be a string
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
  });

  it('should strip X-Powered-By header', async () => {
    const response = await request(app).get('/health/live');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
