# Auth Service

This package implements the auth service for CloudCart AI using clean architecture principles.

## Features

- JWT access and refresh tokens
- Role-based user sessions
- Validation with Zod
- Centralized error handling
- In-memory repository for rapid monolith development

## Running locally

```bash
npm --workspace services/auth-service run dev
```

## API endpoints

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /health`

## Notes

This service is intentionally structured to support a future database-backed repository and to isolate business logic from Express delivery details.
