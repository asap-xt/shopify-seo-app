// backend/server.js
// This file is the main entry point for starting the Node.js server.
// It imports the Express app instance and starts listening for connections.

import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { startSyncScheduler } from './utils/syncScheduler.js';
import Plan from './models/Plan.js';

// Load environment variables from the root .env file
// The path is relative to where this file is executed from within the Docker container,
// but Railway injects them directly, so this is mainly for local dev.
dotenv.config({ path: '../.env' });

// --- Connect to Database ---
connectDB().then(() => {
    // Seed subscription plans after the DB connection is established
    Plan.seed();
});

// --- Create HTTP Server ---
const server = http.createServer(app);

// --- Start Server ---
const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
    // Start the cron job scheduler for periodic data synchronization
    startSyncScheduler();
});

// Handle unhandled promise rejections for better stability
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process gracefully
    server.close(() => process.exit(1));
});