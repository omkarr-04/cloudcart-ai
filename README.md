# CloudCart AI

CloudCart AI is a production-oriented, cloud-native e-commerce platform built with a scalable TypeScript monorepo architecture.

The project is designed to evolve from a modular backend system into a distributed microservices platform with enterprise-grade engineering practices including authentication, observability, testing, CI/CD, Dockerized infrastructure, and scalable service boundaries.

---

# Features

## Authentication & Security
- JWT access + refresh token authentication
- Role-based access control (RBAC)
- HttpOnly secure cookie strategy
- Redis-backed rate limiting
- Helmet security middleware
- Zod request validation
- Centralized error handling

## Backend Architecture
- Clean Architecture (Controller → Service → Repository)
- TypeScript monorepo with npm workspaces
- Prisma ORM with PostgreSQL
- Redis caching and token/session support
- Structured logging with Pino
- Health checks and graceful shutdown handling
- Swagger/OpenAPI documentation

## Frontend
- Next.js + TypeScript frontend
- TailwindCSS UI foundation
- Zustand authentication state management
- Axios API client abstraction
- React Hook Form + Zod validation

## DevOps & Infrastructure
- Dockerized development environment
- Docker Compose setup
- Kubernetes-ready infrastructure scaffolding
- Nginx reverse proxy scaffolding
- GitHub Actions CI pipeline
- Environment-based configuration

## Testing
- Vitest integration testing architecture
- Supertest API testing
- Security edge case testing
- RBAC authorization tests
- Refresh token rotation tests
- Redis rate limiter tests

---

# Monorepo Structure

```txt
frontend/               Next.js frontend application
services/
  auth-service/         Authentication microservice
  product-service/      Product service scaffold
  order-service/        Order service scaffold
  payment-service/      Payment service scaffold
  notification-service/ Notification service scaffold
  recommendation-service/ AI recommendation scaffold
  shared/               Shared DTOs and utilities

infra/
  docker/               Docker configuration
  kubernetes/           Kubernetes manifests
  nginx/                Reverse proxy configuration

docs/
  ARCHITECTURE.md
  ROADMAP.md