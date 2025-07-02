// frontend/src/pages/Login.jsx
// A fallback page shown when the app is opened outside of the Shopify Admin context.
// It prompts the user to enter their shop domain to initiate the auth process.

import { useState, useCallback } from 'react';
import { Page, Layout, Card, TextField, Button, BlockStack, Text } from '@shopify/polaris';

function LoginPage() {
    const [shop, setShop] = useState('');

    const handleShopChange = useCallback((value) => setShop(value), []);

    const handleLogin = () => {
        if (shop) {
            // Construct the auth URL. The backend will handle the redirect to Shopify.
            const authUrl = `/api/auth/shopify?shop=${shop}`;
            // Redirect the browser to initiate the installation/login flow.
            window.location.href = authUrl;
        }
    };

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                        <Card>
                            <BlockStack gap="400" padding="500">
                                <Text variant="headingLg" as="h1">Log in to AI SEO 2.0</Text>
                                <Text as="p" tone="subdued">
                                    Please enter your .myshopify.com domain to install or log in to the app.
                                </Text>
                                <TextField
                                    label="Shop Domain"
                                    labelHidden
                                    value={shop}
                                    onChange={handleShopChange}
                                    autoComplete="off"
                                    placeholder="your-store.myshopify.com"
                                />
                                <Button variant="primary" onClick={handleLogin} fullWidth disabled={!shop}>
                                    Install or Log In
                                </Button>
                            </BlockStack>
                        </Card>
                    </div>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default LoginPage;