// frontend/src/providers/AppBridgeProvider.jsx (Final Simplified Version)
// This version trusts the Shopify App Bridge library to handle its own initialization,
// which is the modern and correct approach for embedded apps.

import { Provider } from '@shopify/app-bridge-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Spinner, Banner } from '@shopify/polaris';
import { useEffect, useState } from 'react';

function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [appBridgeConfig, setAppBridgeConfig] = useState(null);

  useEffect(() => {
    // The host is now automatically detected by App Bridge when embedded.
    // We only need to provide our API key from the environment variables.
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

    if (apiKey) {
      setAppBridgeConfig({
        apiKey,
        // By not providing a 'host', we allow the library to detect it automatically
        // from the URL parameters that Shopify provides when loading the iframe.
        forceRedirect: true,
      });
    } else {
      // This case should not happen if VITE_SHOPIFY_API_KEY is set correctly in Railway.
      console.error("VITE_SHOPIFY_API_KEY is not defined! Please check your environment variables.");
    }
  }, []); // This effect runs only once when the component mounts.

  // Show a loader while the configuration is being prepared.
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
