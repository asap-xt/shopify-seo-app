// frontend/src/App.jsx (Final "Smart" Version)
// This single component now handles initialization and renders the entire app.

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider as PolarisProvider, Frame, Navigation, Page, Banner } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import AppRoutes from './Routes';

// Import Polaris styles and i18n
import '@shopify/polaris/build/esm/styles.css';
import './i18n';
import enPolaris from '@shopify/polaris/locales/en.json';

// Import icons and other components
import { HomeIcon, ProductIcon, NoteIcon, SettingsIcon, ChatIcon } from '@shopify/polaris-icons';
import { useTranslation } from 'react-i18next';
import TopBarMarkup from './components/TopBar.jsx';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // FINAL CORRECTION:
  // The dependency array for useMemo now includes 'location.search'.
  // This ensures that the configuration is re-calculated whenever the URL parameters change,
  // which is crucial for when the app is loaded from the Shopify Admin Apps list.
  const appBridgeConfig = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const host = params.get('host');
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

    if (host && apiKey) {
      try {
        return {
          apiKey,
          host: atob(host),
          forceRedirect: true,
        };
      } catch (e) {
        console.error("Invalid host parameter:", e);
        return null;
      }
    }
    return null;
  }, [location.search]); // The dependency is added here.

  // If the app is not embedded in Shopify, it will not have the 'host' parameter.
  if (!appBridgeConfig) {
    return (
      <PolarisProvider i18n={enPolaris}>
        <Page>
          <Banner title="Configuration Error" tone="critical">
            <p>This application can only be used from within the Shopify Admin dashboard.</p>
            <p>If you are seeing this after installation, please ensure the <strong>VITE_SHOPIFY_API_KEY</strong> variable is set correctly in your Railway project.</p>
          </Banner>
        </Page>
      </PolarisProvider>
    );
  }

  // If we have a valid config, render the full application.
  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          { url: '/', label: t('navigation.dashboard'), icon: HomeIcon, selected: location.pathname === '/', onClick: () => navigate('/') },
          { url: '/products', label: t('navigation.products'), icon: ProductIcon, selected: location.pathname.startsWith('/products'), onClick: () => navigate('/products') },
          { url: '/ai-queries', label: t('navigation.ai_queries'), icon: ChatIcon, selected: location.pathname.startsWith('/ai-queries'), onClick: () => navigate('/ai-queries') },
          { url: '/analytics', label: t('navigation.analytics'), icon: NoteIcon, selected: location.pathname.startsWith('/analytics'), onClick: () => navigate('/analytics') },
          { url: '/settings', label: t('navigation.settings'), icon: SettingsIcon, selected: location.pathname.startsWith('/settings'), onClick: () => navigate('/settings') },
        ]}
      />
    </Navigation>
  );

  return (
    <PolarisProvider i18n={enPolaris}>
      <AppBridgeProvider config={appBridgeConfig} router={{ location, navigate }}>
        <Frame topBar={<TopBarMarkup />} navigation={navigationMarkup}>
          <AppRoutes />
        </Frame>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

export default App;
