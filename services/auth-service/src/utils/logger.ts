import pino from 'pino';
import { NODE_ENV } from '../config';

const isDev = NODE_ENV === 'development';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label }; // Keep string-based levels instead of numbers
    },
  },
  base: {
    env: NODE_ENV,
    service: 'auth-service',
  },
});

