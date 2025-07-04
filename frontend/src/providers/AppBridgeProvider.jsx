// frontend/src/providers/AppBridgeProvider.jsx (Final Simplified Version)
// This version trusts the Shopify App Bridge library to handle its own initialization.

import { Provider } from '@shopify/app-bridge-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Spinner, Banner } from '@shopify/polaris';
import { useMemo } from 'react';

function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // This is the most robust way to get the config.
  // We only need the API key. App Bridge will detect the host automatically
  // when the app is embedded inside the Shopify Admin.
  const appBridgeConfig = useMemo(() => {
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;
    const host = new URLSearchParams(location.search).get('host');

    if (apiKey) {
      return {
        apiKey,
        host: host || undefined,
        forceRedirect: true,
      };
    }
    // This case should not happen if VITE_SHOPIFY_API_KEY is set correctly.
    console.error("VITE_SHOPIFY_API_KEY is not defined!");
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

  // Once the config is ready, render the App Bridge Provider with the main app inside.
  return (
    <Provider config={appBridgeConfig} router={{ location, navigate }}>
      {children}
    </Provider>
  );
}

export default AppBridgeProvider;
