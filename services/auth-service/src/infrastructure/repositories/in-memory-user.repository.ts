import bcrypt from 'bcryptjs';
import type { UserEntity, UserRepository } from '../../modules/auth/auth.types';

const users: UserEntity[] = [
  {
    id: 'user-1',
    email: 'admin@cloudcart.ai',
    name: 'CloudCart Admin',
    role: 'admin',
    passwordHash: bcrypt.hashSync('Admin123!', 10)
  },
  {
    id: 'user-2',
    email: 'merchant@cloudcart.ai',
    name: 'Merchant User',
    role: 'merchant',
    passwordHash: bcrypt.hashSync('Merchant123!', 10)
  }
];

export class InMemoryUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return users.find((user) => user.id === id) ?? null;
  }
}
