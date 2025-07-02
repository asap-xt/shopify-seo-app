// frontend/src/hooks/useProducts.js
// A hook for fetching the list of products from our backend.
// It supports pagination and search functionality.

import { useAppQuery } from './useAppQuery';

export const useProducts = (pageNumber = 1, keyword = '') => {
  // Construct the URL with query parameters for pagination and search.
  const url = `/api/products?pageNumber=${pageNumber}&keyword=${keyword}`;
  
  // The query key must include the parameters to ensure that different pages
  // and search results are cached separately.
  const queryKey = ['products', pageNumber, keyword];

  return useAppQuery({
    url: url,
    queryKey: queryKey,
    // keepPreviousData is a useful option for pagination. It keeps showing the
    // data from the previous page while the new page is being fetched,
    // preventing a "hard loading" state on page change.
    keepPreviousData: true,
  });
};
