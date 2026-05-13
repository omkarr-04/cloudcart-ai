import redis from '../database/redis';
import { logger } from '../../utils/logger';

export class RedisCache {
  /**
   * Set a value in the cache with an expiration time
   * @param key Cache key
   * @param value Value to stringify and store
   * @param ttl Expiration time in seconds
   */
  public async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      const stringifiedValue = JSON.stringify(value);
      await redis.set(key, stringifiedValue, 'EX', ttl);
    } catch (error) {
      logger.error(`Redis Cache SET Error for key ${key}:`, error);
      // Fail gracefully - cache errors shouldn't crash the main application flow
    }
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns Parsed object or null if missing/error
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Redis Cache GET Error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a value from the cache
   * @param key Cache key
   */
  public async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error(`Redis Cache DEL Error for key ${key}:`, error);
    }
  }

  /**
   * Check if a key exists
   */
  public async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis Cache EXISTS Error for key ${key}:`, error);
      return false;
    }
  }
}

export const cache = new RedisCache();
