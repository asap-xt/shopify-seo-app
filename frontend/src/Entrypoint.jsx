// frontend/src/Entrypoint.jsx
// This component is the new main entry point for the application.
// Its only job is to ensure that App Bridge can be initialized before rendering the rest of the app.

import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import App from './App';

// Import Polaris styles and i18n
import '@shopify/polaris/build/esm/styles.css';
import './i18n';

function Entrypoint() {
  const [appBridgeConfig, setAppBridgeConfig] = useState(null);
  const [isConfigReady, setIsConfigReady] = useState(false);

  useEffect(() => {
    // Get the parameters from the current URL
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const host = params.get('host');
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

    if (shop && host && apiKey) {
      // If all parameters are present, create the config
      setAppBridgeConfig({
        apiKey,
        host: atob(host),
        forceRedirect: true,
      });
    }
    // Mark the configuration check as complete
    setIsConfigReady(true);
  }, []);

  // If the configuration is valid, render the full application
  if (isConfigReady && appBridgeConfig) {
    return (
      <BrowserRouter>
        <AppBridgeProvider config={appBridgeConfig}>
          <PolarisProvider i18n={{}}>
            <App />
          </PolarisProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    );
  }

  // If the configuration is NOT valid (e.g., app opened outside Shopify),
  // you can render a login page or an error message.
  // For now, we render nothing to avoid loops, but a login page is the best practice.
  if (isConfigReady && !appBridgeConfig) {
     // Ideally, you would render a <LoginPage /> component here.
     // For now, we show a simple message.
     return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Could not initialize the application.</h1>
            <p>Please make sure you are opening the app from within the Shopify Admin dashboard.</p>
        </div>
     );
  }

  // While checking the configuration, render nothing or a loader
  return null;
}

export default Entrypoint;
