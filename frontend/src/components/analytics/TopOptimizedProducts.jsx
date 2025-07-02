// frontend/src/components/analytics/TopOptimizedProducts.jsx
// Displays a simple list of the most frequently optimized products.

import { BlockStack, Text } from '@shopify/polaris';

const TopOptimizedProducts = ({ data }) => {
    if (!data || data.length === 0) {
        return <Text as="p" tone="subdued">No optimization data available yet.</Text>;
    }

    return (
        <BlockStack as="ul" gap="200">
            {data.map((item, index) => (
                <li key={index}>
                    <Text as="p">{item.title} ({item.count} optimizations)</Text>
                </li>
            ))}
        </BlockStack>
    );
};

export default TopOptimizedProducts;
