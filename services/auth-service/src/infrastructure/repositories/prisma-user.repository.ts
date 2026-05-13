import type { UserEntity, UserRepository } from '../../modules/auth/auth.types';
import prisma from '../database/prisma';
import type { UserRole } from '@cloudcart/shared';

export class PrismaUserRepository implements UserRepository {
  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role as UserRole,
    };
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role as UserRole,
    };
  }
}
