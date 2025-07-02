// backend/services/shopifyService.js
// This service contains functions for interacting with the Shopify Admin API.

import { LATEST_API_VERSION, shopifyApi } from "@shopify/shopify-api";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import logger from "../utils/logger.js";

// Helper to get an authenticated Shopify REST client for a specific shop
const getShopifyRestClient = async (shopDomain) => {
    const shop = await Shop.findOne({ shopifyDomain });
    if (!shop || !shop.accessToken) {
        throw new Error(`Shop or access token not found for ${shopDomain}`);
    }

    const shopify = shopifyApi({
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecretKey: process.env.SHOPIFY_API_SECRET,
        scopes: process.env.SHOPIFY_API_SCOPES.split(','),
        hostName: process.env.HOST.replace(/https?:\/\//, ''),
        apiVersion: LATEST_API_VERSION,
        isEmbeddedApp: true,
        sessionStorage: new shopifyApi.session.MemorySessionStorage(),
    });
    
    const session = new shopify.session.Session({
        shop: shopDomain,
        accessToken: shop.accessToken,
        isOnline: false,
        state: 'temp_state'
    });
    
    return new shopify.clients.Rest({ session });
};

// Function to fetch all products from a Shopify store using pagination
const fetchAllProductsFromShopify = async (client) => {
    const products = [];
    let pageInfo = null;
    let hasNextPage = true;

    while (hasNextPage) {
        const response = await client.get({
            path: 'products',
            query: { limit: 250, page_info: pageInfo },
        });

        products.push(...response.body.products);
        
        // Check for the 'next' page link in the response headers
        if (response.pageInfo && response.pageInfo.nextPage) {
            pageInfo = response.pageInfo.nextPage.query.page_info;
        } else {
            hasNextPage = false;
        }
    }
    return products;
};

// Main function to synchronize products from Shopify to our database
export const syncProductsForShop = async (shopDomain) => {
    logger.info(`Starting product sync for ${shopDomain}...`);
    try {
        const shop = await Shop.findOne({ shopifyDomain });
        if (!shop) {
            logger.error(`Cannot sync, shop not found in DB: ${shopDomain}`);
            return;
        }

        const client = await getShopifyRestClient(shopDomain);
        const shopifyProducts = await fetchAllProductsFromShopify(client);
        logger.info(`Found ${shopifyProducts.length} products in Shopify for ${shopDomain}.`);
        
        if (shopifyProducts.length === 0) {
            logger.warn(`No products found to sync for ${shopDomain}.`);
            return;
        }

        const bulkOps = shopifyProducts.map(p => {
            const cleanDescription = p.body_html ? p.body_html.replace(/<[^>]*>?/gm, '') : '';
            const aiStructuredData = {
                name: p.title,
                description: cleanDescription,
                price: parseFloat(p.variants[0]?.price || 0),
                brand: p.vendor,
                category: p.product_type,
                sku: p.variants[0]?.sku,
                availability: p.variants.some(v => v.inventory_quantity > 0 || v.inventory_policy === 'continue') ? 'in stock' : 'out of stock',
                features: p.options.map(opt => `${opt.name}: ${opt.values.join(', ')}`),
                tags: p.tags.split(',').map(t => t.trim()).filter(t => t),
            };

            return {
                updateOne: {
                    filter: { shop: shop._id, shopifyProductId: p.id.toString() },
                    update: {
                        $set: {
                            title: p.title,
                            description: p.body_html,
                            vendor: p.vendor,
                            productType: p.product_type,
                            tags: p.tags.split(',').map(t => t.trim()).filter(t => t),
                            price: parseFloat(p.variants[0]?.price || 0),
                            imageUrl: p.image?.src || null,
                            aiStructuredData,
                        }
                    },
                    upsert: true
                }
            };
        });

        await Product.bulkWrite(bulkOps);

        shop.lastSync = new Date();
        await shop.save();
        logger.info(`Product sync completed successfully for ${shopDomain}.`);

    } catch (error) {
        logger.error(`Error during product sync for ${shopDomain}: ${error.stack}`);
    }
};
