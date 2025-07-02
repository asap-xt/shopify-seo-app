// frontend/src/components/settings/LanguageSelector.jsx
// A simple component to change the application's language from the settings page.

import { Select } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = useCallback((value) => {
    i18n.changeLanguage(value);
  }, [i18n]);

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
    { label: 'Español', value: 'es' },
    { label: 'Deutsch', value: 'de' },
  ];

  return (
    <div style={{ maxWidth: '250px' }}>
        <Select
            label={t('settings.language.title')}
            options={languageOptions}
            onChange={handleLanguageChange}
            value={i18n.language}
        />
    </div>
  );
};

export default LanguageSelector;
