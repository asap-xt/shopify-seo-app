// backend/config/db.js
// This module handles the connection logic to the MongoDB database using Mongoose.

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    // The options `useNewUrlParser` and `useUnifiedTopology` are deprecated
    // in recent versions of the Mongoose driver and are no longer needed.
    // Removing them cleans up the startup logs.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the connection fails, log the error and terminate the application process.
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;