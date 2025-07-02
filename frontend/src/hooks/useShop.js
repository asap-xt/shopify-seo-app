// frontend/src/hooks/useShop.js
// A specific hook for fetching the main shop status and subscription data.
// It utilizes our generic useAppQuery hook.

import { useAppQuery } from './useAppQuery';

export const useShop = () => {
  return useAppQuery({
    // The URL of the API endpoint to fetch data from.
    url: '/api/shop/status',
    // The unique key for this query in the TanStack Query cache.
    queryKey: ['shopStatus'],
    // Options for the query.
    // We can set a longer staleTime as this data doesn't change very often.
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
