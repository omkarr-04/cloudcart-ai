# CloudCart AI Architecture

## High-level vision

CloudCart AI is designed as a scalable SaaS e-commerce platform with a strong separation of concerns:

- **Frontend**: A Next.js application for marketing pages, storefront, admin dashboards, and AI product recommendations.
- **Backend**: Modular services that start as a manageable monolith and later evolve into microservices.
- **Infrastructure**: Containerized deployment with Docker, orchestration with Kubernetes, and edge routing through Nginx.
- **Data services**: PostgreSQL for transactional data, Redis for caching and session state, RabbitMQ for event-driven communication.
- **AI services**: Recommendation engine and product similarity service with future embedding support.

## Architectural principles

- **Clean architecture**: keep business rules independent of delivery, infrastructure, and frameworks.
- **Type safety**: use TypeScript across UI, API, and shared libraries.
- **Incremental complexity**: start with a monolith, then split services once boundaries mature.
- **Secure defaults**: use environment configuration, token-based auth, and centralized validation.
- **Production readiness**: logging, monitoring, CI/CD, and containerization from the start.

## Package boundaries

- `frontend/` — user experience and marketing engine
- `services/auth-service` — user identity, JWT, RBAC, session management
- `services/product-service` — product catalog, search, taxonomy
- `services/order-service` — checkout, cart, order lifecycle
- `services/payment-service` — payment integration and transaction orchestration
- `services/notification-service` — emails, push notifications, event delivery
- `services/recommendation-service` — AI models, similarity, recommendations
- `services/shared` — typed contracts, DTOs, common utilities, and message schemas

## Incremental migration strategy

1. Start with `auth-service` as a backend monolith proof-of-concept.
2. Build shared DTOs and service contracts in `services/shared`.
3. Add PostgreSQL and Prisma to the backend service.
4. Introduce Redis for caching and session token blacklisting.
5. Extract services into separate deployable packages.
6. Add RabbitMQ for events and async workflows.
7. Deploy to Kubernetes and AWS.
