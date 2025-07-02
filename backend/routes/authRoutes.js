// backend/routes/authRoutes.js
// Defines the routes for the Shopify authentication process.

import express from 'express';
import { handleShopifyAuth, handleShopifyCallback } from '../controllers/authController.js';

const router = express.Router();

// @desc    Initiates the Shopify OAuth process.
// @route   GET /api/auth/shopify
// @access  Public
// This is the main, correct auth route.
router.get('/shopify', handleShopifyAuth);

// @desc    A fallback/alias route to catch incorrect installation URLs.
// @route   GET /api/auth/install
// @access  Public
// This makes the app more robust by handling a common setup mistake.
router.get('/install', handleShopifyAuth);


// @desc    Callback URL where Shopify redirects after authentication.
// @route   GET /api/auth/shopify/callback
// @access  Public
router.get('/shopify/callback', handleShopifyCallback);

export default router;