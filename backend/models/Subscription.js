// backend/models/Subscription.js
// Defines the Mongoose schema for a Subscription, which links a Shop to a Plan.
// It tracks the status and usage for a specific shop's subscription.

import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  // Reference to the Shop this subscription belongs to.
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    unique: true, // A shop can only have one subscription document.
    index: true,
  },
  // Reference to the Plan template for this subscription.
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  // The current status of the subscription.
  status: {
    type: String,
    enum: ['trialing', 'active', 'cancelled', 'past_due', 'frozen'],
    default: 'trialing',
  },
  // The Shopify Charge ID for billing purposes.
  shopifyChargeId: {
    type: String,
  },
  // The date when the free trial period ends.
  trialEndDate: {
    type: Date,
  },
  // The start date of the current billing cycle.
  currentPeriodStart: {
    type: Date,
    default: Date.now,
  },
  // The end date of the current billing cycle.
  currentPeriodEnd: {
    type: Date,
  },
  // Counter for the number of AI queries used in the current billing cycle.
  // This should be reset when a new billing cycle starts.
  aiQueriesUsed: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
