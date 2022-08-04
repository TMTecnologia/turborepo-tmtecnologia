// src/server/router/context.ts
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { unstable_getServerSession as getServerSession } from 'next-auth';

import { authOptions as nextAuthOptions } from '@root/pages/api/auth/[...nextauth]';
import { prisma } from '@root/server/db/client';
import { i18n } from '@root/server/i18n';

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  const req = opts?.req;
  const res = opts?.res;

  const session =
    req && res && (await getServerSession(req, res, nextAuthOptions));

  const translate = i18n();

  return {
    req,
    res,
    session,
    prisma,
    translate,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
