import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { NODE_ENV } from '../config';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const correlationId = req.id;
  const isDev = NODE_ENV !== 'production';

  if (err instanceof AppError) {
    req.log?.warn({ err, correlationId }, `AppError: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      correlationId
    });
  }

  if (typeof err === 'object' && err !== null && 'statusCode' in err) {
    const status = Number((err as { statusCode: unknown }).statusCode) || 400;
    const message = (err as { message?: string }).message ?? 'Invalid request';
    req.log?.warn({ err, correlationId }, `ValidationError: ${message}`);
    return res.status(status).json({
      success: false,
      message,
      errors: (err as { errors?: unknown }).errors,
      correlationId
    });
  }

  // Unhandled / Unexpected Errors
  req.log?.error({ err, correlationId }, `Unhandled Error: ${err?.message || 'Unknown'}`);
  
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    correlationId,
    // Only send stack traces to client in development
    ...(isDev && err instanceof Error ? { stack: err.stack } : {})
  });
};
