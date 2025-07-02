// backend/config/aiProviders.js
// This file centralizes the configuration for all supported AI providers.
// It makes it easy to add new providers or update API endpoints and models.

// Enum-like object for provider names to avoid magic strings
export const AI_PROVIDERS = {
  CLAUDE: 'claude',
  OPENAI: 'openai',
  GEMINI: 'gemini',
  DEEPSEEK: 'deepseek',
  LLAMA: 'llama',
};

// Detailed configuration for each AI provider, including API keys, URLs, and default models.
// API keys are loaded from environment variables for security.
export const AI_PROVIDER_CONFIG = {
  [AI_PROVIDERS.CLAUDE]: {
    name: 'Claude (Anthropic)',
    apiKey: process.env.CLAUDE_API_KEY,
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20240229',
  },
  [AI_PROVIDERS.OPENAI]: {
    name: 'OpenAI',
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o',
  },
  [AI_PROVIDERS.GEMINI]: {
    name: 'Gemini (Google)',
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'models/gemini-1.5-flash',
  },
  [AI_PROVIDERS.DEEPSEEK]: {
    name: 'DeepSeek',
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  [AI_PROVIDERS.LLAMA]: {
    name: 'Llama',
    // Llama is often accessed via a third-party platform like Replicate or can be self-hosted.
    // This configuration assumes a Replicate-like API.
    apiKey: process.env.LLAMA_API_KEY,
    baseURL: 'https://api.replicate.com/v1', // This is an example, adjust if using a different service
    model: 'meta/meta-llama-3.1-70b-instruct',
  },
};

// This object maps plan names (from the Plan model) to the AI providers they are allowed to use.
// This is used by the middleware to authorize API calls based on the shop's subscription.
export const PLAN_PROVIDERS = {
    'Starter': [AI_PROVIDERS.DEEPSEEK, AI_PROVIDERS.LLAMA],
    'Professional': [AI_PROVIDERS.OPENAI, AI_PROVIDERS.LLAMA, AI_PROVIDERS.DEEPSEEK],
    'Growth': [AI_PROVIDERS.CLAUDE, AI_PROVIDERS.OPENAI, AI_PROVIDERS.GEMINI], // As specified, but can be adjusted
    'Growth Extra': [AI_PROVIDERS.CLAUDE, AI_PROVIDERS.OPENAI, AI_PROVIDERS.GEMINI, AI_PROVIDERS.LLAMA], // As specified
    'Enterprise': Object.values(AI_PROVIDERS), // Enterprise has access to all providers
};

