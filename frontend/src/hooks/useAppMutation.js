// frontend/src/hooks/useAppMutation.js
// A custom hook that wraps TanStack Query's useMutation for making authenticated
// POST, PUT, or DELETE requests to our backend.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppBridge } from '@shopify/app-bridge-react';
import axios from 'axios';

export const useAppMutation = ({ url, method = 'post', ...options }) => {
  const app = useAppBridge();
  const queryClient = useQueryClient();

  // The mutation function that will be called when the mutation is triggered.
  const mutationFn = async (variables) => {
    // Get a session token for authentication.
    const token = await app.auth.getToken();
    
    // Perform the API request using axios.
    // The method (post, put, delete) is configurable.
    const { data } = await axios({
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // The payload for the request.
      data: variables,
    });
    return data;
  };

  return useMutation({
    mutationFn,
    // When the mutation is successful, you often want to refetch related data.
    // The onSuccess callback allows us to invalidate queries, which triggers a refetch.
    onSuccess: (data, variables, context) => {
      // Allow overriding onSuccess from the component.
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    // Invalidate queries specified in the options to refetch data.
    // This is useful for keeping the UI in sync after a change.
    // For example, after creating a new item, you'd invalidate the list query.
    ...options,
  });
};
