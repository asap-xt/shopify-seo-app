// frontend/src/i18n.js
// This file configures the i18next library for internationalization.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation JSON files
import en from './translations/en.json';
import fr from './translations/fr.json';
import es from './translations/es.json';
import de from './translations/de.json';

i18n
  // Detects the user's language from the browser settings
  .use(LanguageDetector)
  // Passes the i18n instance to react-i18next for use in components
  .use(initReactI18next)
  // Initializes i18next with configuration
  .init({
    // Enable debug output in the console during development
    debug: process.env.NODE_ENV === 'development',
    // Default language to use if the detected language is not available
    fallbackLng: 'en',
    interpolation: {
      // React already escapes values, so this is not needed
      escapeValue: false,
    },
    // The translation resources
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
      es: {
        translation: es,
      },
      de: {
        translation: de,
      },
    },
  });

export default i18n;