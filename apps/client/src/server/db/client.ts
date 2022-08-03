// src/server/db/client.ts
import { PrismaClient } from '@acme/db';
import { env } from '@root/server/env.mjs';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
