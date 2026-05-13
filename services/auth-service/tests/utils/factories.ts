import bcrypt from 'bcryptjs';
import prisma from '../../src/infrastructure/database/prisma';
import { randomUUID } from 'crypto';

export const createTestUser = async (overrides = {}) => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const defaultUser = {
    email: `test-${randomUUID()}@example.com`,
    passwordHash,
    name: 'Test User',
    role: 'customer',
  };

  const user = await prisma.user.create({
    data: { ...defaultUser, ...overrides },
  });

  return {
    ...user,
    plainPassword: 'password123'
  };
};

export const createTestAdmin = async () => {
  return createTestUser({ role: 'admin' });
};
