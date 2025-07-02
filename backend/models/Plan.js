// backend/models/Plan.js
// Defines the Mongoose schema for a subscription Plan. These are the templates
// for the subscriptions that shops can purchase.

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const planSchema = new mongoose.Schema({
  // The public name of the plan.
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Starter', 'Professional', 'Growth', 'Growth Extra', 'Enterprise']
  },
  // Price in the smallest currency unit (e.g., cents for USD).
  price: {
    type: Number,
    required: true,
  },
  // The maximum number of products that can be synced under this plan.
  productLimit: {
    type: Number,
    required: true,
  },
  // The monthly limit of AI queries.
  queryLimit: {
    type: Number,
    required: true,
  },
  // An array of AI provider keys (e.g., 'openai', 'gemini') available on this plan.
  aiProviders: [{
    type: String,
  }],
  // The frequency of automatic product synchronization, in hours.
  syncFrequencyHours: {
    type: Number,
    required: true,
  },
  // A boolean to indicate if the "AI SEO Generation" feature is available.
  hasSeoOptimizer: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

// Static method to seed the database with the predefined subscription plans.
// This ensures the plans are available in the DB for new subscriptions.
planSchema.statics.seed = async function () {
  try {
    const plans = [
      { name: 'Starter', price: 1000, productLimit: 150, queryLimit: 50, aiProviders: ['deepseek', 'llama'], syncFrequencyHours: 336 /* 2 weeks */, hasSeoOptimizer: false },
      { name: 'Professional', price: 3900, productLimit: 300, queryLimit: 600, aiProviders: ['openai', 'llama', 'deepseek'], syncFrequencyHours: 48, hasSeoOptimizer: true },
      { name: 'Growth', price: 5900, productLimit: 1000, queryLimit: 1500, aiProviders: ['claude', 'openai', 'gemini'], syncFrequencyHours: 24, hasSeoOptimizer: true },
      { name: 'Growth Extra', price: 11900, productLimit: 2000, queryLimit: 4000, aiProviders: ['claude', 'openai', 'gemini', 'llama'], syncFrequencyHours: 12, hasSeoOptimizer: true },
      { name: 'Enterprise', price: 29900, productLimit: 10000, queryLimit: 10000, aiProviders: ['claude', 'openai', 'gemini', 'deepseek', 'llama'], syncFrequencyHours: 2, hasSeoOptimizer: true },
    ];
    
    // Use bulk write for efficient upserting
    const operations = plans.map(planData => ({
      updateOne: {
        filter: { name: planData.name },
        update: { $set: planData },
        upsert: true,
      }
    }));

    const result = await this.bulkWrite(operations);
    if (result.upsertedCount > 0 || result.modifiedCount > 0) {
        logger.info('Subscription plans have been successfully seeded/updated.');
    }

  } catch (error) {
    logger.error('Error seeding plans:', error);
  }
};

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
