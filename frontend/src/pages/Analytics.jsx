// frontend/src/pages/Analytics.jsx
// Displays detailed analytics and performance charts.

import { Page, Layout, Card, BlockStack, Text } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { useAppQuery } from '../hooks/useAppQuery';
import PageSkeleton from '../components/skeletons/PageSkeleton';
import QueriesChart from '../components/analytics/QueriesChart';
import TopOptimizedProducts from '../components/analytics/TopOptimizedProducts';

const AnalyticsPage = () => {
    const { t } = useTranslation();

    const { data: analyticsData, isLoading, isError } = useAppQuery({
        url: '/api/analytics',
        queryKey: ['analytics']
    });

    if (isLoading) {
        return <PageSkeleton title={t('navigation.analytics')} />;
    }

    if (isError) {
        return <Page title={t('navigation.analytics')}><Text tone="critical">{t('general.error')}</Text></Page>;
    }

    return (
        <Page title={t('navigation.analytics')}>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Card.Header title={t('analytics.dailyQueriesTitle')} />
                        <Card.Section>
                            <QueriesChart data={analyticsData.dailyData} />
                        </Card.Section>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <Card.Header title={t('analytics.topOptimizedTitle')} />
                         <TopOptimizedProducts data={analyticsData.topOptimizedProducts} />
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default AnalyticsPage;
