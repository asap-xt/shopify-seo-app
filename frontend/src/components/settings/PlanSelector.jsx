// frontend/src/components/settings/PlanSelector.jsx
// This component displays the available subscription plans and allows the user to change their plan.

import { useAppQuery } from '../../hooks/useAppQuery';
import { useAppMutation } from '../../hooks/useAppMutation';
import { useShop } from '../../hooks/useShop';
import { useTranslation } from 'react-i18next';
import { BlockStack, Card, Text, Button, InlineGrid, Spinner } from '@shopify/polaris';
import { CheckCircleIcon } from '@shopify/polaris-icons';
import { useQueryClient } from '@tanstack/react-query';

const PlanCard = ({ plan, isCurrent, onSelect, isLoading }) => {
    const { t } = useTranslation();
    return (
        <Card>
            <BlockStack gap="500" inlineAlign="center" padding="500">
                <Text variant="headingLg" as="h3">{plan.name}</Text>
                <Text variant="heading2xl" as="h2">${plan.price / 100}</Text>
                <Text as="p" tone="subdued">{t('settings.plans.monthly')}</Text>
                
                <BlockStack gap="200" as="ul">
                    <li>{t('settings.plans.productLimit', { count: plan.productLimit.toLocaleString() })}</li>
                    <li>{t('settings.plans.queryLimit', { count: plan.queryLimit.toLocaleString() })}</li>
                    <li>{t('settings.plans.syncFrequency', { count: plan.syncFrequencyHours })}</li>
                    <li>{t('settings.plans.providerAccess', { count: plan.aiProviders.length })}</li>
                </BlockStack>

                {isCurrent ? (
                    <Button fullWidth disabled icon={CheckCircleIcon}>{t('settings.plans.currentPlan')}</Button>
                ) : (
                    <Button fullWidth variant="primary" onClick={() => onSelect(plan.name)} loading={isLoading}>
                        {t('settings.plans.selectPlan')}
                    </Button>
                )}
            </BlockStack>
        </Card>
    );
};


const PlanSelector = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { data: plansData, isLoading: isLoadingPlans } = useAppQuery({ url: '/api/subscriptions/plans', queryKey: ['plans'] });
    const { data: shopData } = useShop();

    const changePlanMutation = useAppMutation({
        url: '/api/subscriptions/change-plan',
        method: 'post',
        onSuccess: () => {
            // Refetch shop status to update the UI with the new plan
            queryClient.invalidateQueries({ queryKey: ['shopStatus'] });
        }
    });

    if (isLoadingPlans) return <Spinner />;

    // The current plan ID is nested inside the subscription object.
    const currentPlanId = shopData?.subscription?.plan;
    
    return (
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="400">
            {plansData?.map(plan => (
                <PlanCard 
                    key={plan._id} 
                    plan={plan}
                    isCurrent={plan._id === currentPlanId}
                    onSelect={(planName) => changePlanMutation.mutate({ newPlanName: planName })}
                    isLoading={changePlanMutation.isLoading}
                />
            ))}
        </InlineGrid>
    );
};

export default PlanSelector;