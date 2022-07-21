import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createRouter } from './context';

export const userRouter = createRouter()
  .query('get-all', {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    },
  })
  .query('get-by-id', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      return await ctx.prisma.user.findFirst({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation('create', {
    input: z.object({
      email: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.user.create({
        data: {
          email: input.email,
        },
      });
    },
  });
