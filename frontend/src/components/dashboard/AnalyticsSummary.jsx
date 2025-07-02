// frontend/src/components/dashboard/AnalyticsSummary.jsx
// Provides a quick summary of key analytics metrics for the dashboard.

import { useAppQuery } from '../../hooks/useAppQuery';
import { Text, LegacyCard, LegacyStack, Spinner } from '@shopify/polaris';

const AnalyticsSummary = () => {
    const { data: analyticsData, isLoading } = useAppQuery({
        url: '/api/analytics',
        queryKey: ['analyticsSummary']
    });

    if (isLoading) return <Spinner size="small" />;

    return (
        <LegacyStack distribution="fillEvenly">
            <LegacyStack.Item>
                <LegacyCard.Section>
                    <Text as="p" tone="subdued">Total Queries (30d)</Text>
                    <Text variant="headingXl" as="p">
                        {analyticsData?.summary?.totalQueries || 0}
                    </Text>
                </LegacyCard.Section>
            </LegacyStack.Item>
             <LegacyStack.Item>
                <LegacyCard.Section>
                    <Text as="p" tone="subdued">Optimizations (30d)</Text>
                    <Text variant="headingXl" as="p">
                        {analyticsData?.summary?.totalOptimizations || 0}
                    </Text>
                </LegacyCard.Section>
            </LegacyStack.Item>
        </LegacyStack>
    );
};

export default AnalyticsSummary;
