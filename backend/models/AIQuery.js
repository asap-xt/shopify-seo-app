// backend/models/AIQuery.js
// Defines the Mongoose schema for logging every AI query made through the app.
// This is useful for history, analytics, and debugging.

import mongoose from 'mongoose';

const aiQuerySchema = new mongoose.Schema({
    // Reference to the shop that initiated the query.
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
        index: true,
    },
    // Optional reference to the product the query was about.
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    // The AI provider used for this query (e.g., 'openai', 'gemini').
    provider: {
        type: String,
        required: true,
    },
    // The exact prompt sent to the AI model.
    prompt: {
        type: String,
        required: true,
    },
    // The response received from the AI model.
    response: {
        type: String,
        required: true,
    },
    // The type of content that was generated (e.g., 'metaTitle', 'metaDescription').
    contentType: {
        type: String,
        required: true,
    },
    // To track token usage for more granular control and analytics (optional).
    promptTokens: {
        type: Number,
    },
    completionTokens: {
        type: Number,
    },
    // Flag to indicate if the generation was successful.
    success: {
        type: Boolean,
        default: true,
    },
    // Store any error message if the generation failed.
    errorMessage: {
        type: String,
    }
}, {
    timestamps: true // Adds 'createdAt' and 'updatedAt' fields.
});

const AIQuery = mongoose.model('AIQuery', aiQuerySchema);

export default AIQuery;
