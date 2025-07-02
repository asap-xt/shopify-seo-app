// frontend/src/App.jsx (Final "Smart" Version)
// This single component now handles initialization and renders the entire app.

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider as PolarisProvider, Frame, Navigation, Page, Banner, Spinner } from '@shopify/polaris';
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
  // It reads directly from the browser's URL when the component first loads.
  const appBridgeConfig = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
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
  }, []); // The empty dependency array ensures this runs only once.

  // If the app is not embedded in Shopify, it will not have the 'host' parameter.
  // We show a spinner while waiting for Shopify to reload the page with the correct context.
  if (!appBridgeConfig) {
    return (
      <PolarisProvider i18n={enPolaris}>
        <Page>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spinner />
          </div>
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
