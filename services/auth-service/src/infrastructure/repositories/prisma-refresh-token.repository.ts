import type { RefreshTokenEntity, RefreshTokenRepository } from '../../modules/auth/auth.types';
import prisma from '../database/prisma';

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  public async create(data: Omit<RefreshTokenEntity, 'id'>): Promise<RefreshTokenEntity> {
    const token = await prisma.refreshToken.create({
      data: {
        tokenHash: data.tokenHash,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });

    return {
      id: token.id,
      tokenHash: token.tokenHash,
      userId: token.userId,
      expiresAt: token.expiresAt,
    };
  }

  public async findByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    const tokens = await prisma.refreshToken.findMany({
      where: { userId },
    });

    return tokens.map((token) => ({
      id: token.id,
      tokenHash: token.tokenHash,
      userId: token.userId,
      expiresAt: token.expiresAt,
    }));
  }

  public async deleteById(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { id },
    });
  }

  public async deleteAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
