    // frontend/src/providers/PolarisProvider.jsx
    import { AppProvider } from '@shopify/polaris';
    import { useTranslation } from 'react-i18next';
    import enPolaris from '@shopify/polaris/locales/en.json';
    import frPolaris from '@shopify/polaris/locales/fr.json';
    import esPolaris from '@shopify/polaris/locales/es.json';
    import dePolaris from '@shopify/polaris/locales/de.json';

    const polarisTranslations = { en: enPolaris, fr: frPolaris, es: esPolaris, de: dePolaris };

    function PolarisProvider({ children }) {
      const { i18n } = useTranslation();
      const locale = i18n.language.split('-')[0];
      const translation = polarisTranslations[locale] || enPolaris;
      return <AppProvider i18n={translation}>{children}</AppProvider>;
    }
    export default PolarisProvider;
    