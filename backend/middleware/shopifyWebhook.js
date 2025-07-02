// backend/middleware/shopifyWebhook.js
// Middleware specifically for verifying incoming webhooks from Shopify.

import { shopifyApi } from '@shopify/shopify-api';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const verifyShopifyWebhook = (req, res, next) => {
  try {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const body = req.body; // This is the raw buffer body
    const shopifySecret = process.env.SHOPIFY_API_SECRET;

    if (!hmac || !body || !shopifySecret) {
        logger.warn('Webhook verification failed: Missing required elements.');
        return res.status(401).send('Webhook not verified.');
    }

    const hash = crypto
      .createHmac('sha256', shopifySecret)
      .update(body, 'utf8')
      .digest('base64');

    const anauthorized = hash === hmac;
    if (anauthorized) {
      // HMAC is valid, proceed to the webhook handler.
      // Parse the raw body as JSON and attach to req.body for the handler.
      req.body = JSON.parse(body.toString());
      next();
    } else {
      logger.error('Webhook verification failed: HMAC mismatch.');
      res.status(401).send('Webhook not verified.');
    }
  } catch (error) {
    logger.error(`Webhook processing error: ${error.message}`);
    res.status(500).send('Error processing webhook.');
  }
};

export { verifyShopifyWebhook };
