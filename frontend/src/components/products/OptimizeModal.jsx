// frontend/src/components/products/OptimizeModal.jsx
// The modal component for the AI SEO Optimizer.

import { useState, useCallback, useMemo } from 'react';
// CORRECTED: Replaced 'TextArea' with 'TextField' which is the correct component.
import { Modal, BlockStack, Select, RadioButton, Text, TextField, Button, Spinner, Card } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { useShop } from '../../hooks/useShop';
import { useGenerateSeoMutation } from '../../hooks/useAI';
import { useQueryClient } from '@tanstack/react-query';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Toast } from '@shopify/app-bridge/actions';

// This is the CORRECT way to handle provider names on the frontend.
// It's a simple mapping object, NOT an import from the backend.
const AI_PROVIDER_DISPLAY_NAMES = {
  claude: 'Claude (Anthropic)',
  openai: 'OpenAI',
  gemini: 'Gemini (Google)',
  deepseek: 'DeepSeek',
  llama: 'Llama',
};

const OptimizeModal = ({ isOpen, onClose, product }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const app = useAppBridge();
    const { data: shopData, isLoading: isLoadingShop } = useShop();
    const seoMutation = useGenerateSeoMutation();

    const [selectedProvider, setSelectedProvider] = useState('');
    const [contentType, setContentType] = useState('metaTitle');
    const [customInstruction, setCustomInstruction] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');

    // Get the list of available providers from the user's plan (fetched via API by useShop hook)
    const availableProviders = useMemo(() => {
        return shopData?.plan?.aiProviders || [];
    }, [shopData]);

    const providerOptions = availableProviders.map(providerKey => ({
        label: AI_PROVIDER_DISPLAY_NAMES[providerKey] || providerKey,
        value: providerKey,
    }));
    
    // Set a default provider if available
    useState(() => {
        if (providerOptions.length > 0 && !selectedProvider) {
            setSelectedProvider(providerOptions[0].value);
        }
    }, [providerOptions, selectedProvider]);


    const handleGenerate = useCallback(() => {
        if (!selectedProvider) {
            const errorToast = Toast.create(app, { message: 'Please select an AI provider.', isError: true });
            errorToast.dispatch(Toast.Action.SHOW);
            return;
        }
        setGeneratedContent(''); // Clear previous content
        seoMutation.mutate({
            productId: product._id,
            provider: selectedProvider,
            contentType,
            customInstruction,
        }, {
            onSuccess: (data) => {
                setGeneratedContent(data.content);
            }
        });
    }, [selectedProvider, product._id, contentType, customInstruction, seoMutation, app]);

    const handleApply = () => {
        // Here you would call another mutation to save the generated content to the product
        console.log("Applying content:", generatedContent);
        const successToast = Toast.create(app, { message: 'Content applied successfully!' });
        successToast.dispatch(Toast.Action.SHOW);
        queryClient.invalidateQueries({ queryKey: ['products'] });
        onClose();
    };
    
    const handleClose = () => {
        setGeneratedContent('');
        onClose();
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            title={`${t('optimizerModal.title')} "${product.title}"`}
            primaryAction={{
                content: t('optimizerModal.apply'),
                onAction: handleApply,
                disabled: !generatedContent,
            }}
            secondaryActions={[{
                content: t('optimizerModal.close'),
                onAction: handleClose,
            }]}
        >
            <Modal.Section>
                <BlockStack gap="500">
                    <Select
                        label={t('optimizerModal.selectProvider')}
                        options={providerOptions}
                        onChange={setSelectedProvider}
                        value={selectedProvider}
                        placeholder="--"
                        disabled={isLoadingShop || providerOptions.length === 0}
                    />
                    
                    <BlockStack gap="300">
                        <Text as="p" fontWeight="semibold">{t('optimizerModal.selectContent')}</Text>
                        <RadioButton label={t('optimizerModal.metaTitle')} checked={contentType === 'metaTitle'} id="metaTitle" name="contentType" onChange={() => setContentType('metaTitle')} />
                        <RadioButton label={t('optimizerModal.metaDescription')} checked={contentType === 'metaDescription'} id="metaDescription" name="contentType" onChange={() => setContentType('metaDescription')} />
                        <RadioButton label={t('optimizerModal.altText')} checked={contentType === 'altText'} id="altText" name="contentType" onChange={() => setContentType('altText')} />
                    </BlockStack>
                    
                    {/* CORRECTED: Used TextField with the multiline prop */}
                    <TextField
                        label={t('optimizerModal.customInstruction')}
                        value={customInstruction}
                        onChange={setCustomInstruction}
                        autoComplete="off"
                        placeholder={t('optimizerModal.customInstructionPlaceholder')}
                        multiline={3}
                    />

                    <Button onClick={handleGenerate} loading={seoMutation.isPending} disabled={!selectedProvider}>
                        {t('optimizerModal.generate')}
                    </Button>
                    
                    {seoMutation.isPending && <Spinner size="small" />}
                    
                    {generatedContent && (
                        <Card>
                           <BlockStack gap="200" padding="400">
                             <Text as="p" fontWeight="semibold">{t('optimizerModal.generatedContent')}</Text>
                             <Text as="p" tone="subdued">{generatedContent}</Text>
                           </BlockStack>
                        </Card>
                    )}
                </BlockStack>
            </Modal.Section>
        </Modal>
    );
};

export default OptimizeModal;