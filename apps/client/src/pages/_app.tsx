// src/pages/_app.tsx
import React from 'react';
import { withTRPC } from '@trpc/next';
import type { AppType } from 'next/dist/shared/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import superjson from 'superjson';

import type { AppRouter } from '@root/server/router';

import '@root/styles/globals.css';

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    import('react-dom').then((ReactDOM) => {
      import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 1000, {});
      });
    });
  }

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx: _ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(appWithTranslation(MyApp as React.FunctionComponent));
