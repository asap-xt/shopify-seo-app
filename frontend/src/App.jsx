// frontend/src/App.jsx (Final "Smart" Version)
// This component now handles the initialization of Polaris and App Bridge.

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import AppRoutes from './Routes';

// Import Polaris styles and i18n
import '@shopify/polaris/build/esm/styles.css';
import './i18n';
import enPolaris from '@shopify/polaris/locales/en.json';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const appBridgeConfig = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const host = params.get('host');
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

    if (host && apiKey) {
      return {
        apiKey,
        host: atob(host),
        forceRedirect: true,
      };
    }
    return null;
  }, [location.search]);

  // If the app is not embedded in Shopify, it will not have the 'host' parameter.
  // In that case, we don't render the App Bridge Provider.
  if (!appBridgeConfig) {
    // You can render a login page or an error message here.
    // For now, we render a simple message.
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Please open this app from your Shopify Admin.</h1>
      </div>
    );
  }

  // If we have a valid config, render the full application.
  return (
    <PolarisProvider i18n={enPolaris}>
      <AppBridgeProvider config={appBridgeConfig} router={{ location, navigate }}>
        {/* The actual UI of your app is now rendered inside the providers */}
        <AppRoutes />
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

export default App;
