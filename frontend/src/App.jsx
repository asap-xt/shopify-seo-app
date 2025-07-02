// frontend/src/App.jsx (Final Version)

import { Frame, Navigation } from '@shopify/polaris';
// All icons have been verified and corrected.
import {
  HomeIcon,
  ProductIcon,
  NoteIcon,
  SettingsIcon,
  ChatIcon,
} from '@shopify/polaris-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppRoutes from './Routes';
import TopBarMarkup from './components/TopBar.jsx';

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={[
          {
            url: '/',
            label: t('navigation.dashboard'),
            icon: HomeIcon,
            selected: location.pathname === '/',
            onClick: () => navigate('/'),
          },
          {
            url: '/products',
            label: t('navigation.products'),
            icon: ProductIcon,
            selected: location.pathname.startsWith('/products'),
            onClick: () => navigate('/products'),
          },
          {
            url: '/ai-queries',
            label: t('navigation.ai_queries'),
            icon: ChatIcon,
            selected: location.pathname.startsWith('/ai-queries'),
            onClick: () => navigate('/ai-queries'),
          },
          {
            url: '/analytics',
            label: t('navigation.analytics'),
            icon: NoteIcon,
            selected: location.pathname.startsWith('/analytics'),
            onClick: () => navigate('/analytics'),
          },
          {
            url: '/settings',
            label: t('navigation.settings'),
            icon: SettingsIcon,
            selected: location.pathname.startsWith('/settings'),
            onClick: () => navigate('/settings'),
          },
        ]}
      />
    </Navigation>
  );

  return (
    <Frame
      topBar={<TopBarMarkup />}
      navigation={navigationMarkup}
    >
      <AppRoutes />
    </Frame>
  );
}

export default App;
