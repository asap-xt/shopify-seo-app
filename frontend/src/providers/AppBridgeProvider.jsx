// frontend/src/providers/AppBridgeProvider.jsx (Final Simplified Version)
// This version trusts the Shopify App Bridge library to handle its own initialization.

import { Provider } from '@shopify/app-bridge-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Spinner } from '@shopify/polaris';
import { useEffect, useState, useMemo } from 'react';

function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const appBridgeConfig = useMemo(() => {
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;
    const host = new URLSearchParams(location.search).get('host');

    if (apiKey && host) {
      return {
        apiKey,
        host: atob(host),
        forceRedirect: true,
      };
    }
    // If the app is opened from the Apps list, App Bridge can initialize without the host param
    // as long as it's embedded correctly.
    if (apiKey && !host) {
        return {
            apiKey,
            forceRedirect: true,
        };
    }
    return null;
  }, [location.search]);

  // If the API key is missing, we can't proceed.
  if (!appBridgeConfig) {
    return (
      <Page>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner />
        </div>
      </Page>
    );
  }

  return (
    <Provider config={appBridgeConfig} router={{ location, navigate }}>
      {children}
    </Provider>
  );
}

export default AppBridgeProvider;
