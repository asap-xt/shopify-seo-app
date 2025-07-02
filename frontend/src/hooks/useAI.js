// frontend/src/hooks/useAI.js
// This hook encapsulates mutations related to AI functionalities.

import { useAppMutation } from './useAppMutation';
import { useQueryClient } from '@tanstack/react-query';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Toast } from '@shopify/app-bridge/actions';

export const useGenerateSeoMutation = () => {
  const queryClient = useQueryClient();
  const app = useAppBridge();

  return useAppMutation({
    url: '/api/ai/generate-seo',
    method: 'post',
    onSuccess: () => {
      // When an AI query is made, we can invalidate the 'recentQueries'
      // to refetch the list on the dashboard.
      queryClient.invalidateQueries({ queryKey: ['recentQueries'] });

      // Show a success toast message to the user.
      const toastNotice = Toast.create(app, {
        message: 'Content generated successfully!',
        duration: 3000,
      });
      toastNotice.dispatch(Toast.Action.SHOW);
    },
    onError: (error) => {
        // Show an error toast if the mutation fails.
        const toastNotice = Toast.create(app, {
            message: error.response?.data?.message || 'An error occurred during generation.',
            duration: 5000,
            isError: true,
        });
        toastNotice.dispatch(Toast.Action.SHOW);
    }
  });
};

// You could add other AI-related mutations here, e.g., for bulk optimization.
