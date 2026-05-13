import type { RequestHandler } from 'express';
import type { AnyZodObject } from 'zod';

export const validateBody = (schema: AnyZodObject): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
    return next({ statusCode: 400, message: 'Validation failed', errors });
  }

  req.body = result.data;
  return next();
};
