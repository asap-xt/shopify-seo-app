// frontend/src/App.jsx (Final "Smart" Version)
// This single component now handles initialization and renders the entire app.

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider as PolarisProvider, Frame, Navigation, Page, Banner } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './Routes';

// Import Polaris styles and i18n
import '@shopify/polaris/build/esm/styles.css';
import './i18n';
import enPolaris from '@shopify/polaris/locales/en.json';

// Import icons and other components
import { HomeIcon, ProductIcon, NoteIcon, SettingsIcon, ChatIcon } from '@shopify/polaris-icons';
import { useTranslation } from 'react-i18next';
import TopBarMarkup from './components/TopBar.jsx';

// Create the query client instance outside the component to prevent re-creation on re-renders.
const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
});

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // This is the most robust way to get the config.
  // We only need to provide the API key. App Bridge will detect the host automatically.
  const appBridgeConfig = useMemo(() => {
    const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;
    const host = new URLSearchParams(location.search).get('host');

    if (apiKey) {
      return {
        apiKey,
        // If the host is present in the URL (during OAuth), we use it.
        // If not (when opened from the Apps list), App Bridge will detect it.
        host: host ? atob(host) : undefined,
        forceRedirect: true,
      };
    }
    return null;
  }, [location.search]);

  // If the API key is missing, render an error.
  if (!appBridgeConfig) {
    return (
      <PolarisProvider i18n={enPolaris}>
        <Page>
          <Banner title="Configuration Error" tone="critical">
            <p>This application cannot start because the <strong>VITE_SHOPIFY_API_KEY</strong> environment variable is not set correctly in your Railway project.</p>
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
      <QueryClientProvider client={queryClient}>
        <AppBridgeProvider config={appBridgeConfig} router={{ location, navigate }}>
          <Frame topBar={<TopBarMarkup />} navigation={navigationMarkup}>
            <AppRoutes />
          </Frame>
        </AppBridgeProvider>
      </QueryClientProvider>
    </PolarisProvider>
  );
}

export default App;
