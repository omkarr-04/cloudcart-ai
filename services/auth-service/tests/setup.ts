import dotenv from 'dotenv';
import path from 'path';

// Load .env.test before anything else runs
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

import { beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../src/infrastructure/database/prisma';
import redis from '../src/infrastructure/database/redis';

beforeAll(async () => {
  // Verify we are actually connected to the test database to prevent wiping dev DB
  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('CRITICAL: Refusing to run tests against non-test database!');
  }
});

beforeEach(async () => {
  // Clean the database before every single test
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    console.error({ error }, 'Error truncating tables');
  }

  // Clear Redis
  await redis.flushall();
});

afterAll(async () => {
  await prisma.$disconnect();
  await redis.quit();
});
