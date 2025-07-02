    // frontend/src/providers/QueryProvider.jsx
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { useState } from 'react';

    function QueryProvider({ children }) {
      const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }));
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    }
    export default QueryProvider;
    