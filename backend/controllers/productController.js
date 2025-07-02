// backend/controllers/productController.js
// This controller handles all logic related to managing and retrieving products.

import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import { syncProductsForShop } from '../services/shopifyService.js';
import logger from '../utils/logger.js';

/**
 * @desc    Fetch all products for the logged-in shop with pagination
 * @route   GET /api/products
 * @access  Private (requires 'protect' middleware)
 */
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? { title: { $regex: req.query.keyword, $options: 'i' } } : {};

  const count = await Product.countDocuments({ shop: req.shop._id, ...keyword });
  const products = await Product.find({ shop: req.shop._id, ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

/**
 * @desc    Fetch a single product by its database ID
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, shop: req.shop._id });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @desc    Manually trigger a product sync with Shopify for the current shop
 * @route   POST /api/products/sync
 * @access  Private
 */
const syncProducts = asyncHandler(async (req, res) => {
  const shopDomain = req.shop.shopifyDomain;
  logger.info(`Manual product sync triggered for ${shopDomain}`);
  
  // Run the sync process in the background and return a response immediately
  syncProductsForShop(shopDomain).catch(err => {
    logger.error(`Manual sync failed for ${shopDomain}: ${err.message}`);
  });

  res.status(202).json({ message: 'Product synchronization has started. The product list will update shortly.' });
});

/**
 * @desc    Update a product's SEO data
 * @route   PUT /api/products/:id/optimize
 * @access  Private
 */
const updateProductSeo = asyncHandler(async (req, res) => {
    const { metaTitle, metaDescription, altText } = req.body;

    const product = await Product.findOne({ _id: req.params.id, shop: req.shop._id });

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Here you would call the Shopify API to update the product's metafields
    // For now, we'll just update our local database to reflect the change.
    
    product.optimizedMetaTitle = metaTitle || product.optimizedMetaTitle;
    product.optimizedMetaDescription = metaDescription || product.optimizedMetaDescription;
    product.optimizedAltText = altText || product.optimizedAltText;
    product.isOptimized = true;
    product.lastOptimizedAt = Date.now();
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
});


export { getProducts, getProductById, syncProducts, updateProductSeo };

