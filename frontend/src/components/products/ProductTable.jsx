// frontend/src/components/products/ProductTable.jsx
// This component renders the main data table for the products page,
// including search, pagination, and actions for each product.

import { useState, useCallback } from 'react';
import {
  IndexTable,
  useIndexResourceState,
  Text,
  Button,
  Pagination,
  TextField,
  InlineStack,
  Thumbnail,
  Spinner
} from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import OptimizeModal from './OptimizeModal';
import { useAppMutation } from '../../hooks/useAppMutation';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Toast } from '@shopify/app-bridge/actions';
import { useQueryClient } from '@tanstack/react-query';


function ProductTable({ products, pageInfo, onPageChange, searchTerm, onSearchChange, loading }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const app = useAppBridge();

  // State for the optimization modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(products);

  const handleOpenModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  // Mutation for syncing products
  const syncMutation = useAppMutation({
      url: '/api/products/sync',
      method: 'post',
      onSuccess: () => {
          const toastNotice = Toast.create(app, { message: t('products.syncSuccess'), duration: 3000 });
          toastNotice.dispatch(Toast.Action.SHOW);
          // Invalidate products to refetch after a delay, allowing sync to start
          setTimeout(() => queryClient.invalidateQueries(['products']), 5000);
      }
  });


  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const rowMarkup = products.map(
    (product, index) => (
      <IndexTable.Row
        id={product._id}
        key={product._id}
        selected={selectedResources.includes(product._id)}
        position={index}
      >
        <IndexTable.Cell>
           <Thumbnail
                source={product.imageUrl || undefined}
                alt={product.title}
                size="small"
            />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {product.title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{product.vendor}</IndexTable.Cell>
        <IndexTable.Cell>{product.productType}</IndexTable.Cell>
        <IndexTable.Cell>
            <Button size="slim" onClick={() => handleOpenModal(product)}>{t('products.optimize')}</Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <>
       {selectedProduct && (
            <OptimizeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
            />
        )}
      <IndexTable
        resourceName={resourceName}
        itemCount={products.length}
        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: '' },
          { title: 'Product' },
          { title: 'Vendor' },
          { title: 'Type' },
          { title: 'Actions' },
        ]}
        loading={loading}
      >
        <div style={{ padding: '16px' }}>
             <InlineStack gap="400" align="space-between">
                <div style={{ flex: '1 1 auto' }}>
                    <TextField
                        placeholder={t('products.searchPlaceholder')}
                        value={searchTerm}
                        onChange={onSearchChange}
                        autoComplete="off"
                        prefix={loading ? <Spinner size="small" /> : null}
                    />
                </div>
                 <Button onClick={() => syncMutation.mutate()} loading={syncMutation.isLoading}>
                     {t('products.syncButton')}
                 </Button>
            </InlineStack>
        </div>
        {rowMarkup}
      </IndexTable>
      <div style={{ padding: '16px', borderTop: '1px solid var(--p-color-border)' }}>
          <Pagination
            hasPrevious={pageInfo.hasPreviousPage}
            onPrevious={() => onPageChange(pageInfo.currentPage - 1)}
            hasNext={pageInfo.hasNextPage}
            onNext={() => onPageChange(pageInfo.currentPage + 1)}
            label={`Page ${pageInfo.currentPage} of ${pageInfo.totalPages}`}
          />
      </div>
    </>
  );
}

export default ProductTable;
