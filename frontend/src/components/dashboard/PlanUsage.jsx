// frontend/src/components/dashboard/PlanUsage.jsx
// Displays the current subscription plan and usage metrics.

import { Card, Text, ProgressBar, InlineStack, Button, BlockStack } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PlanUsage = ({ shopData }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { plan, usage } = shopData;
    
    // Calculate usage percentages, ensuring they don't exceed 100%
    const queryUsagePercent = Math.min((usage.aiQueriesUsed / plan.queryLimit) * 100, 100);
    const productUsagePercent = Math.min((usage.productCount / plan.productLimit) * 100, 100);

    return (
        <Card>
            <BlockStack gap="400">
                <Card.Header 
                    title={t('planUsage.planTitle')}
                    actions={[{
                        content: t('planUsage.managePlan'),
                        onAction: () => navigate('/settings'),
                    }]}
                >
                     <Text variant="headingMd" as="p">
                        {plan.name} Plan
                    </Text>
                </Card.Header>
                <Card.Section>
                    <BlockStack gap="500">
                        {/* AI Queries Usage */}
                        <BlockStack gap="200">
                            <Text as="p" variant="bodyMd" fontWeight="semibold">
                                {t('planUsage.aiQueries')}
                            </Text>
                            <ProgressBar 
                                progress={queryUsagePercent} 
                                tone={queryUsagePercent > 85 ? 'critical' : 'primary'} 
                            />
                            <Text as="p" tone="subdued">
                                {usage.aiQueriesUsed} / {plan.queryLimit}
                            </Text>
                        </BlockStack>
                        
                        {/* Products Synced Usage */}
                        <BlockStack gap="200">
                            <Text as="p" variant="bodyMd" fontWeight="semibold">
                                {t('planUsage.productsSynced')}
                            </Text>
                            <ProgressBar 
                                progress={productUsagePercent}
                                tone={productUsagePercent > 95 ? 'warning' : 'primary'}
                            />
                            <Text as="p" tone="subdued">
                                {usage.productCount} / {plan.productLimit}
                            </Text>
                        </BlockStack>
                    </BlockStack>
                </Card.Section>
            </BlockStack>
        </Card>
    );
};

export default PlanUsage;
