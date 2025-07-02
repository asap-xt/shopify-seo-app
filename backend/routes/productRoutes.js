// backend/routes/productRoutes.js
// Defines the API routes for managing products.

import express from 'express';
import { getProducts, syncProducts, getProductById, updateProductSeo } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All product routes are protected and require a valid shop session (JWT).
router.use(protect);

// @desc    Fetch all products for the logged-in shop
// @route   GET /api/products
router.route('/').get(getProducts);

// @desc    Manually trigger a product sync with Shopify
// @route   POST /api/products/sync
router.route('/sync').post(syncProducts);

// @desc    Fetch a single product and update its SEO data
// @route   GET /api/products/:id
// @route   PUT /api/products/:id
router.route('/:id')
  .get(getProductById)
  .put(updateProductSeo); // This route will be used to apply the generated SEO

export default router;
