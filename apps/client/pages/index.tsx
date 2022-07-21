import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from '@root/utils/trpc';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const hello = trpc.useQuery(['user.get-all']);
  if (!hello.data) return <div>Loading...</div>;

  if (hello.status == 'error') return <div>Error</div>;

  return (
    <>
      {hello.data.map((user) => (
        <p>{user.email}</p>
      ))}
    </>
  );
};

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `http://localhost:2021/trpc`,

      // optional
      // headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   };
      // },
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
