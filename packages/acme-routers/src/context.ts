import { PrismaClient } from '@acme/db';
import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

const prisma = new PrismaClient();

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
