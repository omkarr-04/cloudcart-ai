import app from './app';
import { logger } from './utils/logger';
import { PORT } from './config';
import prisma from './infrastructure/database/prisma';
import redis from './infrastructure/database/redis';

const server = app.listen(PORT, () => {
  logger.info(`🚀 Auth service started on port ${PORT}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Gracefully shutting down...`);

  // 1. Stop accepting new connections
  server.close(async (err) => {
    if (err) {
      logger.error('Error during server close', { err });
      process.exit(1);
    }
    logger.info('HTTP server closed.');

    try {
      // 2. Disconnect databases and caches
      await prisma.$disconnect();
      logger.info('Prisma disconnected.');
      
      await redis.quit();
      logger.info('Redis disconnected.');

      logger.info('Graceful shutdown completed.');
      process.exit(0);
    } catch (dbErr) {
      logger.error('Error during database/cache disconnection', { err: dbErr });
      process.exit(1);
    }
  });

  // Failsafe: force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled exceptions & rejections
process.on('uncaughtException', (err) => {
  logger.fatal('Uncaught Exception', { err });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.fatal('Unhandled Rejection', { reason });
  gracefulShutdown('unhandledRejection');
});

