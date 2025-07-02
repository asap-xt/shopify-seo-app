// frontend/src/pages/Products.jsx
// This page displays a list of the merchant's products, allowing them to
// search, paginate, and initiate the AI optimization process.

import { useState } from 'react';
import { Page, Card, BlockStack } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import ProductTable from '../components/products/ProductTable';
import PageSkeleton from '../components/skeletons/PageSkeleton';
import { useProducts } from '../hooks/useProducts';

const ProductsPage = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Use our custom hook to fetch product data.
  // The hook will automatically refetch when currentPage or searchTerm changes.
  const { data, isLoading, isError, isFetching } = useProducts(currentPage, searchTerm);

  if (isLoading && !data) {
    return <PageSkeleton title={t('products.title')} />;
  }
  
  if (isError) {
      return <Page title={t('products.title')}><Text tone="critical">{t('general.error')}</Text></Page>;
  }

  return (
    <Page
      title={t('products.title')}
      fullWidth
    >
      <Card>
          <BlockStack>
             <ProductTable
                products={data?.products || []}
                pageInfo={{
                    currentPage: data?.page,
                    totalPages: data?.pages,
                    hasNextPage: data?.page < data?.pages,
                    hasPreviousPage: data?.page > 1,
                }}
                onPageChange={setCurrentPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                loading={isFetching} // Use isFetching to show loading indicator on refetches
             />
          </BlockStack>
      </Card>
    </Page>
  );
};

export default ProductsPage;
