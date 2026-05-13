# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
# Enable corepack for modern package management if needed, but we use npm
RUN apk add --no-cache openssl
# Copy root package.json and workspace configuration
COPY package.json package-lock.json* ./
COPY services/auth-service/package.json ./services/auth-service/
COPY services/shared/package.json ./services/shared/

# ---- Dependencies ----
FROM base AS dependencies
# Install all dependencies (including dev for building)
RUN npm install --legacy-peer-deps
COPY services/auth-service/prisma ./services/auth-service/prisma
RUN npx prisma generate --schema=services/auth-service/prisma/schema.prisma

# ---- Development ----
FROM dependencies AS dev
# We will mount code as volumes for hot-reload in docker-compose
CMD ["npm", "run", "dev:auth"]

# ---- Builder ----
FROM dependencies AS builder
COPY . .
# Generate Prisma Client
RUN cd services/auth-service && npx prisma generate
# Build the workspace
RUN npm run build:auth

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# Copy only the necessary build artifacts and production dependencies
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/auth-service/package.json ./services/auth-service/
COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist
COPY --from=builder /app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY --from=builder /app/services/shared/package.json ./services/shared/
COPY --from=builder /app/services/shared/dist ./services/shared/dist

# Expose port
EXPOSE 4000
# Run the compiled code
CMD ["node", "services/auth-service/dist/index.js"]
