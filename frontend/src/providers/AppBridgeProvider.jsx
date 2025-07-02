// frontend/src/providers/AppBridgeProvider.jsx (UI Debug Version)
// This version will render diagnostic information directly to the screen.

import { Provider } from '@shopify/app-bridge-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';

function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const diagnosticData = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      shop: params.get('shop'),
      host: params.get('host'),
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      fullUrl: location.search,
    };
  }, [location.search]);

  const isConfigValid = diagnosticData.shop && diagnosticData.host && diagnosticData.apiKey;

  if (isConfigValid) {
    // If everything is OK, run the app normally.
    const config = {
      apiKey: diagnosticData.apiKey,
      host: atob(diagnosticData.host),
      forceRedirect: true,
    };
    return (
      <Provider config={config} router={{ location, navigate }}>
        {children}
      </Provider>
    );
  }

  // If config is NOT valid, render the diagnostic panel instead of a blank screen.
  return (
    <Page title="Application Diagnostics">
      <Card>
        <BlockStack gap="400" padding="400">
          <Text variant="headingLg" as="h1" tone="critical">Initialization Failed</Text>
          <p>The application could not start because it is missing critical information. Please check the values below.</p>
          
          <div>
            <Text as="p" fontWeight="bold">URL Parameters Received:</Text>
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', wordBreak: 'break-all' }}>
              {diagnosticData.fullUrl || "No URL parameters found."}
            </pre>
          </div>

          <div>
            <Text as="p" fontWeight="bold">Parsed 'shop':</Text>
            <Text as="p" tone={diagnosticData.shop ? 'success' : 'critical'}>
              {diagnosticData.shop || "MISSING"}
            </Text>
          </div>

          <div>
            <Text as="p" fontWeight="bold">Parsed 'host':</Text>
            <Text as="p" tone={diagnosticData.host ? 'success' : 'critical'}>
              {diagnosticData.host || "MISSING"}
            </Text>
          </div>

          <div>
            <Text as="p" fontWeight="bold">VITE_SHOPIFY_API_KEY:</Text>
            <Text as="p" tone={diagnosticData.apiKey ? 'success' : 'critical'}>
              {diagnosticData.apiKey ? "FOUND" : "MISSING or not configured in Railway"}
            </Text>
            <p>Please ensure a variable named <strong>VITE_SHOPIFY_API_KEY</strong> exists in your Railway project variables.</p>
          </div>

        </BlockStack>
      </Card>
    </Page>
  );
}

export default AppBridgeProvider;
