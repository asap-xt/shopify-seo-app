// frontend/src/providers/AppBridgeProvider.jsx (Final Version)
// This provider is responsible for initializing the Shopify App Bridge.

import { Provider } from '@shopify/app-bridge-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Banner, Spinner } from '@shopify/polaris';

function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // useMemo will re-evaluate if the URL search string changes.
  const appBridgeConfig = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const shop = params.get('shop');
    const host = params.get('host');

    // The VITE_SHOPIFY_API_KEY must be set in the Railway environment variables
    // and prefixed with VITE_ to be exposed to the frontend.
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

    if (host && shop && apiKey) {
      try {
        // If all parameters are present (typically during/after OAuth), create the config.
        return {
          apiKey,
          host: atob(host), // Decode the base64-encoded host
          forceRedirect: true,
        };
      } catch (e) {
        console.error("Failed to decode host parameter:", e);
        return 'invalid'; // Return a specific error state
      }
    }
    
    // If parameters are missing, it means the app is likely opened from the Apps list
    // or outside Shopify. The app should show a loader and wait for Shopify to reload it
    // with the correct context.
    return null;
  }, [location.search]);

  // If the config is still being determined, show a loader.
  if (appBridgeConfig === null) {
    return (
      <Page>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner />
        </div>
      </Page>
    );
  }

  // If the configuration is valid, provide the App Bridge context.
  if (appBridgeConfig !== 'invalid') {
    return (
      <Provider config={appBridgeConfig} router={{ location, navigate }}>
        {children}
      </Provider>
    );
  }

  // If the host parameter was invalid, show an error.
  return (
    <Page>
      <Banner title="Application Error" tone="critical">
        <p>Could not initialize the application. The host parameter from Shopify is invalid.</p>
      </Banner>
    </Page>
  );
}

export default AppBridgeProvider;
