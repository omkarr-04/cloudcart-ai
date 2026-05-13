import express from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { authRouter } from './modules/auth/auth.routes';
import { healthRouter } from './modules/health/health.routes';
import { errorHandler } from './middleware/error.middleware';
import { setupSwagger } from './utils/swagger';
import {
  helmetMiddleware,
  corsMiddleware,
  rateLimiterMiddleware,
  sanitizePayloadMiddleware,
} from './middleware/security.middleware';
import { httpLogger } from './middleware/logger.middleware';

const app = express();

app.use(httpLogger);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiterMiddleware);

app.use(express.json({ limit: '10kb' })); // Mitigate oversized payload attacks
app.use(cookieParser());
app.use(sanitizePayloadMiddleware);

setupSwagger(app);

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
