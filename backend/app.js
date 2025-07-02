// backend/app.js
// This file defines and configures the Express application.
// It sets up middleware, routes, and error handlers.
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// Import local modules
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { verifyShopifyWebhook } from './middleware/shopifyWebhook.js';
// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
// Initialize express app
const app = express();
// --- Core Middleware ---
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "frame-ancestors": ["'self'", "https://*.myshopify.com", "https://admin.shopify.com"],
        },
    },
}));
app.post('/api/webhooks/shopify', express.raw({ type: 'application/json' }), verifyShopifyWebhook, (req, res) => {
    console.log('Webhook verified and processed:', req.body);
    res.sendStatus(200);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/analytics', analyticsRoutes);
// --- Frontend Serving (for Production) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV === 'production') {
    // FINAL, FINAL CORRECTION:
    // In the final Docker image, __dirname is /app. The frontend assets are in /app/frontend/dist.
    // Therefore, the correct path is a direct join.
    const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(frontendDistPath));
    // The catch-all route now correctly resolves the path to index.html.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendDistPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
}
// --- Error Handling Middleware (must be last) ---
app.use(notFound);
app.use(errorHandler);
export default app;