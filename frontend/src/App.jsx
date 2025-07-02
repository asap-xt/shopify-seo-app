// frontend/src/App.jsx
// This is the main application component. It sets up the main layout
// including the navigation menu and top bar, and renders the routes.
import { Frame, Navigation } from '@shopify/polaris';
// FINAL AND COMPLETE CORRECTION: All icons have been verified and corrected.
import {
  HomeIcon,
  ProductIcon,
  NoteIcon, // CORRECTED: Using a different, known-correct icon for Analytics.
  SettingsIcon,
  ChatIcon, // Using a known-correct icon for AI Queries
} from '@shopify/polaris-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppRoutes from './Routes';
import TopBarMarkup from './components/TopBar.jsx';
function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // Define the navigation menu structure with all corrected icons
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
            icon: ProductIcon, // Corrected from ProductsIcon
            selected: location.pathname.startsWith('/products'),
            onClick: () => navigate('/products'),
          },
          {
            url: '/ai-queries',
            label: t('navigation.ai_queries'),
            icon: ChatIcon, // Corrected from QuestionIcon
            selected: location.pathname.startsWith('/ai-queries'),
            onClick: () => navigate('/ai-queries'),
          },
          {
            url: '/analytics',
            label: t('navigation.analytics'),
            icon: NoteIcon, // CORRECTED with a safe icon
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
    // The Frame component provides the main structure of an embedded Shopify app
    <Frame
      topBar={<TopBarMarkup />}
      navigation={navigationMarkup}
    >
      <AppRoutes />
    </Frame>
  );
}
export default App;