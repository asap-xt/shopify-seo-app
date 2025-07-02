// backend/services/aiService.js
// This service encapsulates all interactions with external AI platforms.
import axios from 'axios';
import asyncHandler from 'express-async-handler';
import { AI_PROVIDER_CONFIG, PLAN_PROVIDERS } from '../config/aiProviders.js';
import Product from '../models/Product.js';
import Subscription from '../models/Subscription.js';
import AIQuery from '../models/AIQuery.js';
import logger from '../utils/logger.js';
import Plan from '../models/Plan.js';
import Analytics from '../models/Analytics.js';

// --- Generic AI Caller ---
const callAiApi = async (provider, prompt) => {
    const config = AI_PROVIDER_CONFIG[provider];
    if (!config) throw new Error(`Provider '${provider}' is not configured.`);

    // Each API has a slightly different request/response structure.
    try {
        let response;
        switch (provider) {
            case 'openai':
            case 'deepseek':
                response = await axios.post(`${config.baseURL}/chat/completions`, 
                    { model: config.model, messages: [{ role: 'user', content: prompt }] },
                    { headers: { 'Authorization': `Bearer ${config.apiKey}` } }
                );
                return response.data.choices[0].message.content;

            case 'claude':
                response = await axios.post(`${config.baseURL}/messages`,
                    { model: config.model, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] },
                    { headers: { 'x-api-key': config.apiKey, 'anthropic-version': '2023-06-01' } }
                );
                return response.data.content[0].text;

            case 'gemini':
                const url = `${config.baseURL}/${config.model}:generateContent?key=${config.apiKey}`;
                response = await axios.post(url, { contents: [{ parts: [{ text: prompt }] }] });
                return response.data.candidates[0].content.parts[0].text;
            
            case 'llama':
                // Placeholder for Llama. This will depend on the specific API used (e.g., Replicate).
                logger.warn('Llama API is simulated. Implement actual API call.');
                return `This is a simulated Llama response.`;

            default:
                throw new Error(`API call for provider '${provider}' not implemented.`);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        logger.error(`AI API call to ${provider} failed: ${errorMessage}`);
        throw new Error(`Failed to get response from ${config.name}.`);
    }
};

// --- Prompt Generation ---
const getPromptForContentType = (product, contentType, customInstruction) => {
    // Strips HTML from description for a cleaner prompt
    const cleanDescription = product.description ? product.description.replace(/<[^>]*>?/gm, '') : '';
    const baseInstruction = `You are a world-class SEO expert and e-commerce copywriter. Analyze the following product data and generate the requested content. The tone should be persuasive, clear, and optimized for search engines.`;
    const productInfo = `Product Data:\n- Name: ${product.title}\n- Description: ${cleanDescription.substring(0, 500)}\n- Vendor: ${product.vendor}\n- Type: ${product.productType}\n- Tags: ${product.tags.join(', ')}\n- Price: ${product.price}`;

    let taskInstruction = '';
    switch (contentType) {
        case 'metaTitle':
            taskInstruction = 'Generate a compelling, SEO-friendly meta title. It must be under 60 characters and include the main keyword.';
            break;
        case 'metaDescription':
            taskInstruction = 'Generate an engaging meta description. It must be under 160 characters, avoid duplicate content, and encourage clicks with a clear call-to-action.';
            break;
        case 'altText':
            taskInstruction = 'Generate a descriptive alt text for the main product image. It should be concise, describe the image accurately for visually impaired users, and include relevant keywords.';
            break;
        default:
            throw new Error('Invalid content type for prompt generation.');
    }
    return `${baseInstruction}\n\n${productInfo}\n\nTask: ${taskInstruction}\n\n${customInstruction ? `Additional Instruction from merchant: ${customInstruction}` : ''}`;
};

// --- Main Service Logic ---
export const generateSeoForProduct = asyncHandler(async (shopId, productId, provider, contentType, customInstruction) => {
    const product = await Product.findOne({ _id: productId, shop: shopId });
    if (!product) throw new Error('Product not found.');

    const prompt = getPromptForContentType(product, contentType, customInstruction);
    let result = { success: false, content: '', queryId: null };

    try {
        const generatedContent = await callAiApi(provider, prompt);
        
        const queryLog = await AIQuery.create({
            shop: shopId,
            product: productId,
            provider,
            prompt,
            response: generatedContent,
            contentType,
            success: true,
        });

        result = { success: true, content: generatedContent, queryId: queryLog._id };
    } catch (error) {
        const queryLog = await AIQuery.create({
            shop: shopId,
            product: productId,
            provider,
            prompt,
            response: 'Generation failed.',
            contentType,
            success: false,
            errorMessage: error.message,
        });
        result = { success: false, content: error.message, queryId: queryLog._id };
    }
    return result;
});


// --- Usage and Limits Management ---
export const checkQueryLimitAndPlan = asyncHandler(async (shopId, provider) => {
    const subscription = await Subscription.findOne({ shop: shopId }).populate('plan');
    if (!subscription || !subscription.plan) {
        throw new Error('No active subscription found. Cannot perform AI generation.');
    }
    
    // Check 1: Has the query limit been reached?
    if (subscription.aiQueriesUsed >= subscription.plan.queryLimit) {
        throw new Error('You have exceeded your monthly AI query limit. Please upgrade your plan.');
    }
    
    // Check 2: Does the plan allow this specific provider?
    if (!subscription.plan.aiProviders.includes(provider)) {
        throw new Error(`Your current plan does not grant access to the '${AI_PROVIDER_CONFIG[provider].name}' provider.`);
    }

    // Check 3: Does the plan allow SEO optimization at all?
    if (!subscription.plan.hasSeoOptimizer) {
        throw new Error('The AI SEO Optimizer feature is not available on your current plan. Please upgrade to a Professional plan or higher.');
    }
});

export const incrementQueryCount = asyncHandler(async (shopId) => {
    // Increment the subscription's query counter
    await Subscription.findOneAndUpdate(
        { shop: shopId, status: { $in: ['trialing', 'active'] } },
        { $inc: { aiQueriesUsed: 1 } }
    );
    // Also update the daily analytics data
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    await Analytics.findOneAndUpdate(
        { shop: shopId, date: today },
        { $inc: { dailyQueries: 1 } },
        { upsert: true, new: true }
    );
});
