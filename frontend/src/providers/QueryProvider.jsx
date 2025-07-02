// frontend/src/providers/QueryProvider.jsx
// This provider sets up the client for TanStack Query (formerly React Query),
// which is a powerful library for managing server state in React applications.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function QueryProvider({ children }) {
  // Create a new QueryClient instance.
  // We use useState to ensure the client is created only once per component lifecycle.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime determines how long data is considered fresh.
        // After this time, it becomes stale and can be refetched.
        staleTime: 1000 * 60 * 5, // 5 minutes
        
        // retry defines how many times a failed query will be retried.
        retry: 1,

        // refetchOnWindowFocus can be disabled to prevent refetching data every
        // time the user focuses the browser window, which can be excessive.
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    // The QueryClientProvider makes the QueryClient available to all components
    // in the application tree via custom hooks like useQuery and useMutation.
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
