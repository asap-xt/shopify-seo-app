// frontend/src/pages/ExitIframe.jsx
// This component is crucial for handling the final step of the OAuth redirect flow.
// It helps the app break out of the Shopify iframe to complete authentication.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';

function ExitIframe() {
  const app = useAppBridge();
  const { search } = useLocation();

  useEffect(() => {
    if (app) {
      const params = new URLSearchParams(search);
      const redirectUrl = params.get('redirectUri');
      
      if (redirectUrl) {
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.REMOTE, redirectUrl);
      }
    }
  }, [app, search]);

  return null; // This component renders nothing.
}

export default ExitIframe;
