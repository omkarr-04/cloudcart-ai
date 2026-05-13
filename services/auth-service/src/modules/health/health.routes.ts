import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../../infrastructure/database/prisma';
import redis from '../../infrastructure/database/redis';

export const healthRouter = Router();

/**
 * @openapi
 * /health/live:
 *   get:
 *     tags:
 *       - Health
 *     summary: Liveness probe for orchestration
 *     description: Returns 200 OK if the HTTP server is alive. Does not check dependencies.
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: auth-service
 *                 timestamp:
 *                   type: string
 *                   example: 2026-05-12T10:00:00.000Z
 */
healthRouter.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() });
});

/**
 * @openapi
 * /health/ready:
 *   get:
 *     tags:
 *       - Health
 *     summary: Readiness probe for orchestration
 *     description: Returns 200 OK if the service AND its dependencies (Redis, PostgreSQL) are reachable. Returns 503 otherwise.
 *     responses:
 *       200:
 *         description: Service and dependencies are ready
 *       503:
 *         description: Service or dependencies are down
 */
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  let isDbReady = false;
  let isRedisReady = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbReady = true;
  } catch (e) {
    // DB not ready
  }

  try {
    const ping = await redis.ping();
    if (ping === 'PONG') isRedisReady = true;
  } catch (e) {
    // Redis not ready
  }

  const isReady = isDbReady && isRedisReady;
  const status = isReady ? 200 : 503;

  res.status(status).json({
    status: isReady ? 'ready' : 'not_ready',
    service: 'auth-service',
    dependencies: {
      database: isDbReady ? 'up' : 'down',
      redis: isRedisReady ? 'up' : 'down',
    },
    timestamp: new Date().toISOString()
  });
});
