// frontend/src/providers/AppBridgeProvider.jsx (Final Version)
// This provider is responsible for initializing the Shopify App Bridge.

import { Provider } from '@shopify/app-bridge-react';
import { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Spinner, Banner, Text } from '@shopify/polaris';

function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [appBridgeConfig, setAppBridgeConfig] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shop = searchParams.get('shop');
    const host = searchParams.get('host');

    // The VITE_SHOPIFY_API_KEY must be set in the Railway environment variables
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

    if (host && shop && apiKey) {
      try {
        setAppBridgeConfig({
          apiKey,
          host: atob(host), // Decode the base64-encoded host
          forceRedirect: true,
        });
      } catch (e) {
        console.error("Failed to decode host parameter:", e);
        setAppBridgeConfig(false); // Set to false to indicate an error
      }
    } else {
      // If parameters are missing, it's likely not embedded in Shopify.
      // We will redirect to a login page.
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [location.search, navigate, location.pathname]);

  // While waiting for the configuration to be determined
  if (appBridgeConfig === null) {
    return (
      <Page>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner />
        </div>
      </Page>
    );
  }

  // If the configuration is valid, provide the App Bridge context
  if (appBridgeConfig) {
    return (
      <Provider config={appBridgeConfig} router={{ location, navigate }}>
        {children}
      </Provider>
    );
  }

  // If the configuration is invalid (e.g., failed to decode host), show an error.
  return (
      <Page>
          <Banner title="Application Error" tone="critical">
              <p>Could not initialize the application. The host parameter is invalid.</p>
          </Banner>
      </Page>
  );
}

export default AppBridgeProvider;
