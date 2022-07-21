import { createRouter } from './context';
import { userRouter } from './user';

export { createContext, createRouter } from './context';

export const appRouter = createRouter().merge('user.', userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
