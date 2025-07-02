// frontend/src/pages/AIQueries.jsx
// This page shows a more detailed history of all AI queries made by the user.

import { Page, Card, Text } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { useAppQuery } from '../hooks/useAppQuery';
import PageSkeleton from '../components/skeletons/PageSkeleton';
import AIQueryHistoryTable from '../components/ai-queries/AIQueryHistoryTable';

const AIQueriesPage = () => {
    const { t } = useTranslation();

    // Fetching all queries (or a paginated list) would go here.
    // Reusing the recent queries endpoint for demonstration.
    const { data: queries, isLoading, isError } = useAppQuery({
        url: '/api/ai/queries?limit=50', // Fetch more for the history page
        queryKey: ['allAiQueries']
    });

    if (isLoading) {
        return <PageSkeleton title={t('navigation.ai_queries')} />;
    }

    if (isError) {
        return <Page title={t('navigation.ai_queries')}><Text tone="critical">{t('general.error')}</Text></Page>;
    }

    return (
        <Page title={t('navigation.ai_queries')} fullWidth>
            <Card>
                <AIQueryHistoryTable queries={queries} />
            </Card>
        </Page>
    );
};

export default AIQueriesPage;
