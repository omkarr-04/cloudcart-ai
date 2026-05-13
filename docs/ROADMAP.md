# CloudCart AI Roadmap

## Phase 1: Planning
- Define product vision and architecture.
- Choose a robust monorepo strategy.
- Establish type-safe shared packages.

## Phase 2: Frontend foundation
- Scaffold Next.js app.
- Configure TailwindCSS.
- Add form validation, API client, and UI structure.

## Phase 3: Backend modular monolith
- Create a backend workspace package for auth and shared services.
- Add Express.js / NestJS infrastructure and clean architecture layers.
- Build DTOs, controllers, services, repositories.

## Phase 4: PostgreSQL + Prisma
- Add PostgreSQL data models.
- Apply Prisma for schema migrations and ORM.

## Phase 5: Authentication
- Add JWT access + refresh tokens.
- Implement role-based auth and secure middleware.
- Validate inputs with Zod.

## Phase 6: Redis caching
- Add caching for product data.
- Implement token revocation and session data.

## Phase 7: Dockerization
- Containerize services and frontend.
- Create a Docker Compose dev environment.

## Phase 8: Microservices extraction
- Split backend into dedicated service packages.
- Use shared contracts and event payloads.

## Phase 9: RabbitMQ
- Add message broker for order and notification events.
- Build async workflows and retry-safe handlers.

## Phase 10: Kubernetes
- Add manifests for deployments, services, secrets, and ingress.
- Use Helm or kubectl manifests for production-like clusters.

## Phase 11: CI/CD
- Add GitHub Actions workflows for lint, typecheck, test, and deploy.

## Phase 12: AWS deployment
- Deploy services using EC2, ECR, or ECS.
- Configure secure environment variables and monitoring.

## Phase 13: Monitoring/logging
- Add Prometheus metrics and Grafana dashboards.
- Add centralized structured logs and alerts.
