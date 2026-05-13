import Redis from 'ioredis';
import { logger } from '../../utils/logger';

// Retrieve Redis connection string from environment variable
// We fall back to localhost for native non-docker runs if REDIS_URL is not provided
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL, {
  // Retry strategy for resilient connection
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Health logging events
redis.on('connect', () => {
  logger.info('Redis connection established successfully');
});

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

export default redis;
