// frontend/src/pages/Dashboard.jsx
// This is the main landing page of the application after a merchant logs in.
// It provides a high-level overview of their status and recent activity.

import { Page, Layout, Card, BlockStack, Text } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import PlanUsage from '../components/dashboard/PlanUsage';
import RecentQueries from '../components/dashboard/RecentQueries';
import AnalyticsSummary from '../components/dashboard/AnalyticsSummary';
import { useShop } from '../hooks/useShop';
import PageSkeleton from '../components/skeletons/PageSkeleton';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { data: shopData, isLoading, isError } = useShop();

    if (isLoading) {
        return <PageSkeleton title={t('dashboard.title')} />;
    }
    
    if (isError) {
        return <Page title={t('dashboard.title')}><Text tone="critical">{t('general.error')}</Text></Page>;
    }

    return (
        <Page title={t('dashboard.title')}>
            <Layout>
                {/* Section for Plan Usage */}
                <Layout.Section>
                   <PlanUsage shopData={shopData} />
                </Layout.Section>

                {/* Section for Analytics Summary */}
                <Layout.Section>
                    <Card>
                        <BlockStack gap="500">
                            <Card.Header title={t('dashboard.analyticsSummaryTitle')} />
                            <Card.Section>
                                <AnalyticsSummary />
                            </Card.Section>
                        </BlockStack>
                    </Card>
                </Layout.Section>
                
                {/* Section for Recent AI Queries */}
                <Layout.Section>
                    <Card>
                        <BlockStack gap="500">
                           <Card.Header title={t('dashboard.recentQueriesTitle')} />
                           <RecentQueries />
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default DashboardPage;
