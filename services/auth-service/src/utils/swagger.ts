import type { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { PORT } from '../config';
import { logger } from './logger';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CloudCart AI - Auth Service API',
      version: '1.0.0',
      description: 'API documentation for the CloudCart Auth microservice.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Pass the JWT Access Token here.',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'HttpOnly cookie containing the refresh token.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-v4-string' },
            email: { type: 'string', format: 'email', example: 'user@cloudcart.ai' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', enum: ['admin', 'merchant', 'customer'] },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string', example: 'eyJhbGci...' },
                refreshToken: { type: 'string', description: 'Also set as HttpOnly cookie' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Invalid request' },
            correlationId: { type: 'string', example: 'uuid-v4-string' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(`Docs available at http://localhost:${PORT}/api-docs`);
};
