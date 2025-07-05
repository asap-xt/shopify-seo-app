// frontend/src/providers/AppBridgeProvider.jsx (Final Simplified Version)
// This version trusts the Shopify App Bridge library to handle its own initialization.

import { Provider } from '@shopify/app-bridge-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page, Spinner, Banner, Card, TextContainer } from '@shopify/polaris';
import { useMemo, useEffect, useState } from 'react';

// Компонент за автоматичен OAuth redirect с fallback
function OAuthRedirector() {
  const location = useLocation();
  const [missingShop, setMissingShop] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shop = params.get('shop');
    const host = params.get('host');
    if (!shop) {
      setMissingShop(true);
      return;
    }
    if (!host) {
      window.location.href = `/api/auth/shopify?shop=${shop}`;
    }
  }, [location]);
  if (missingShop) {
    return (
      <Page>
        <Card sectioned>
          <TextContainer>
            <Banner status="critical" title="Missing shop parameter">
              <p>This app must be launched from the Shopify Admin. Please open it from your <b>Apps</b> list in Shopify.</p>
            </Banner>
          </TextContainer>
        </Card>
      </Page>
    );
  }
  return null;
}

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
      <OAuthRedirector />
      {children}
    </Provider>
  );
}

export default AppBridgeProvider;
