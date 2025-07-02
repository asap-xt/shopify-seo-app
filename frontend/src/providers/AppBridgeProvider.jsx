// frontend/src/providers/AppBridgeProvider.jsx (Final Debug Version)
// This provider is responsible for initializing the Shopify App Bridge.

import { Provider } from '@shopify/app-bridge-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Banner, Text } from '@shopify/polaris';

function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // --- FINAL DEBUGGING STEP ---
  // We will log everything to the browser's console to see what the frontend receives.
  console.log('--- AppBridgeProvider Initializing ---');
  console.log('Current location.search:', location.search);

  const appBridgeConfig = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const shop = params.get('shop');
    const host = params.get('host');
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

    // Log the values we've parsed.
    console.log('Parsed shop:', shop);
    console.log('Parsed host:', host);
    console.log('VITE_SHOPIFY_API_KEY from env:', apiKey);
    // --- END DEBUGGING STEP ---

    if (host && shop && apiKey) {
      try {
        const config = {
          apiKey,
          host: atob(host),
          forceRedirect: true,
        };
        console.log('Successfully created App Bridge config:', config);
        return config;
      } catch (e) {
        console.error("Failed to decode host parameter:", e);
        return null;
      }
    }
    
    console.warn('One or more required parameters are missing.');
    return null;
  }, [location.search]);

  if (appBridgeConfig) {
    return (
      <Provider config={appBridgeConfig} router={{ location, navigate }}>
        {children}
      </Provider>
    );
  }

  // If config is invalid, render an error message IN THE UI to stop the loop.
  return (
      <Page>
          <Banner title="Application Initialization Error" tone="critical">
              <p>Could not initialize the application. Please check the browser console for more details.</p>
              <Text variant="bodySm" as="p">
                This usually happens if the <strong>VITE_SHOPIFY_API_KEY</strong> environment variable is not set correctly in Railway, or if the app is opened outside of the Shopify Admin.
              </Text>
          </Banner>
      </Page>
  );
}

export default AppBridgeProvider;
