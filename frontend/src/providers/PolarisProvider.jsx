// frontend/src/providers/PolarisProvider.jsx
// This component wraps the application with Shopify's Polaris AppProvider.
// It's essential for using Polaris components and ensures the app's UI
// matches the Shopify Admin look and feel. It also handles i18n for Polaris.

import { AppProvider } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';

// Import Polaris translations for supported languages
import enPolaris from '@shopify/polaris/locales/en.json';
import frPolaris from '@shopify/polaris/locales/fr.json';
import esPolaris from '@shopify/polaris/locales/es.json';
import dePolaris from '@shopify/polaris/locales/de.json';

const polarisTranslations = {
  en: enPolaris,
  fr: frPolaris,
  es: esPolaris,
  de: dePolaris,
};

function PolarisProvider({ children }) {
  const { i18n } = useTranslation();
  
  // Get the current language code (e.g., 'en', 'fr')
  const locale = i18n.language.split('-')[0];
  
  // Select the appropriate Polaris translation file based on the current language
  const translation = polarisTranslations[locale] || enPolaris;

  return (
    <AppProvider i18n={translation}>
      {children}
    </AppProvider>
  );
}

export default PolarisProvider;
