// backend/middleware/rateLimiter.js
// Implements basic rate limiting to protect the API against brute-force attacks
// and excessive requests.

import { rateLimit } from 'express-rate-limit';

// General rate limiter for most API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// A stricter rate limiter for sensitive routes like login or password reset
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Limit each IP to 10 auth attempts per window
    message: 'Too many authentication attempts. Please try again later.',
});

export { apiLimiter, authLimiter };
