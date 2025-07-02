// frontend/src/hooks/useAppQuery.js
// A custom hook that wraps TanStack Query's useQuery for making authenticated GET requests to our backend.
// It simplifies data fetching in components by abstracting away the boilerplate.

import { useQuery } from '@tanstack/react-query';
import { useAppBridge } from '@shopify/app-bridge-react';
import axios from 'axios';

export const useAppQuery = ({ url, queryKey, ...options }) => {
  const app = useAppBridge();

  // The fetcher function that will be called by useQuery.
  const fetcher = async () => {
    // Get a session token from App Bridge. This token is a JWT that authenticates
    // the frontend request with our backend.
    const token = await app.auth.getToken();
    
    // Make the authenticated request using axios.
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };

  // The useQuery hook from TanStack Query.
  // It handles caching, background refetching, loading/error states, etc.
  return useQuery({
    // The query key uniquely identifies this query's data in the cache.
    // It's an array, often starting with the data type and including any params.
    queryKey: queryKey,
    // The function that performs the data fetching.
    queryFn: fetcher,
    // Any additional options passed to useQuery.
    ...options,
  });
};
