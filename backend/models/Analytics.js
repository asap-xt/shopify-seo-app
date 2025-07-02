// backend/models/Analytics.js
// Defines a schema for storing aggregated daily analytics data per shop.
// This is more efficient for dashboards than calculating stats on the fly from raw query logs.

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    // Reference to the shop these analytics belong to.
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    // The date for which the analytics are recorded (stored as the start of the day in UTC).
    date: {
        type: Date,
        required: true,
    },
    // The total number of AI queries made on this day.
    dailyQueries: {
        type: Number,
        default: 0,
    },
    // The number of successful product optimizations performed.
    optimizationsPerformed: {
        type: Number,
        default: 0,
    },
    // A breakdown of queries by provider for more detailed stats.
    // The keys are the provider names (e.g., 'openai') and values are the counts.
    queriesByProvider: {
        type: Map,
        of: Number,
        default: {},
    },
}, {
    timestamps: true,
});

// Compound index to ensure one analytics document per shop per day.
analyticsSchema.index({ shop: 1, date: 1 }, { unique: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
