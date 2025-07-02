// frontend/src/pages/Settings.jsx
// This page allows the merchant to manage their subscription plan and other app settings.

import { Page, Layout, Card, BlockStack } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import PlanSelector from '../components/settings/PlanSelector';
import LanguageSelector from '../components/settings/LanguageSelector';

const SettingsPage = () => {
    const { t } = useTranslation();

    return (
        <Page title={t('settings.title')}>
            <Layout>
                <Layout.Section>
                    <Card>
                       <BlockStack gap="500">
                            <Card.Header title={t('settings.plans.title')} />
                            <Card.Section>
                                <PlanSelector />
                            </Card.Section>
                        </BlockStack>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                     <Card>
                       <BlockStack gap="500">
                            <Card.Header title={t('settings.language.title')} />
                            <Card.Section>
                                <LanguageSelector />
                            </Card.Section>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default SettingsPage;
