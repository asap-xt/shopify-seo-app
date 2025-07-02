// frontend/src/components/ai-queries/AIQueryHistoryTable.jsx
// Renders a detailed table of past AI queries.

import { IndexTable, Text, Thumbnail, Badge } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
// REMOVED the problematic icon import entirely.

const AIQueryHistoryTable = ({ queries }) => {
    const { t, i18n } = useTranslation();

    const rowMarkup = queries.map((query, index) => (
        <IndexTable.Row id={query._id} key={query._id} position={index}>
            <IndexTable.Cell>
                <Thumbnail
                    // FINAL FIX: If there's no image URL, the Thumbnail will show initials.
                    // This avoids importing any icons and guarantees the build will not fail.
                    source={query.product?.imageUrl}
                    alt={query.product?.title || 'General Query'}
                    size="small"
                    initials={(query.product?.title || 'Q').charAt(0)}
                />
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text variant="bodyMd">{query.product?.title || 'N/A'}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {query.provider}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {query.contentType}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text as="p" tone="subdued">{query.response}</Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge tone={query.success ? 'success' : 'critical'}>
                    {query.success ? 'Success' : 'Failed'}
                </Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {new Date(query.createdAt).toLocaleString(i18n.language)}
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <IndexTable
            itemCount={queries.length}
            headings={[
                { title: '' },
                { title: 'Product' },
                { title: 'Provider' },
                { title: 'Content Type' },
                { title: 'Response' },
                { title: 'Status' },
                { title: 'Date' },
            ]}
            selectable={false}
        >
            {rowMarkup}
        </IndexTable>
    );
};

export default AIQueryHistoryTable;
