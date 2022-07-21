import { appRouter, createContext } from '@acme/routers';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';

async function main() {
  const app = express();

  app.use((req, _res, next) => {
    // request logger
    //eslint-disable-next-line no-console
    console.log('⬅️ ', req.method, req.path, req.body ?? req.query);

    next();
  });

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  app.listen(2021, () => {
    //eslint-disable-next-line no-console
    console.log('listening on port 2021');
  });
}

main();
