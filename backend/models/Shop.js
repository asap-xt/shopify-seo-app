// backend/models/Shop.js
// Defines the Mongoose schema for a Shop. Each document represents a Shopify store
// that has installed the application.

import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  // The unique domain of the Shopify store (e.g., 'my-awesome-store.myshopify.com').
  // This is the primary identifier for a shop.
  shopifyDomain: {
    type: String,
    required: [true, 'Shopify domain is required.'],
    unique: true,
    trim: true,
    index: true,
  },
  // The offline access token provided by Shopify OAuth.
  // This is used to make authenticated API calls on behalf of the shop.
  accessToken: {
    type: String,
    required: [true, 'Shopify access token is required.'],
  },
  // The name of the shop.
  name: {
    type: String,
  },
  // The email address of the shop owner.
  email: {
    type: String,
  },
  // Flag to indicate if the app is currently installed and active on the shop.
  // Can be set to false on uninstall webhook.
  isActive: {
    type: Boolean,
    default: true,
  },
  // A reference to the shop's current subscription document.
  // This links a shop to its plan and usage data.
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  // The timestamp of the last successful product synchronization.
  lastSync: {
    type: Date,
  },
  // The timezone of the shop, useful for scheduling tasks.
  timezone: {
    type: String,
  },
}, {
  // Automatically add 'createdAt' and 'updatedAt' timestamps.
  timestamps: true,
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
