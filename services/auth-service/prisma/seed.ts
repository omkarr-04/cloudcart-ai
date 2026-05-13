import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial users...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cloudcart.ai' },
    update: {},
    create: {
      email: 'admin@cloudcart.ai',
      name: 'System Admin',
      passwordHash,
      role: 'admin',
    },
  });

  const merchant = await prisma.user.upsert({
    where: { email: 'merchant@cloudcart.ai' },
    update: {},
    create: {
      email: 'merchant@cloudcart.ai',
      name: 'Test Merchant',
      passwordHash,
      role: 'merchant',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@cloudcart.ai' },
    update: {},
    create: {
      email: 'customer@cloudcart.ai',
      name: 'Test Customer',
      passwordHash,
      role: 'customer',
    },
  });

  console.log({ admin, merchant, customer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
