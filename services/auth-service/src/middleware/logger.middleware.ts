import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger';

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => {
    // Return existing correlation ID or generate a new one
    return req.headers['x-request-id'] || randomUUID();
  },
  customProps: (req, res) => {
    return {
      correlationId: req.id,
    };
  },
  // Optionally redact sensitive information
  redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
  // Clean up the log output for health checks
  autoLogging: {
    ignore: (req) => {
      if (req.url?.startsWith('/health')) {
        return true;
      }
      return false;
    },
  },
});
