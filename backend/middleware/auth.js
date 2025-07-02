// backend/middleware/auth.js
// This middleware is used to protect routes that require an authenticated shop.
// It verifies the JSON Web Token (JWT) sent in the Authorization header.

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Shop from '../models/Shop.js';
import logger from '../utils/logger.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // The token is expected in the format 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the shop associated with the token's ID.
      // We exclude the shop's accessToken from being returned for security.
      req.shop = await Shop.findById(decoded.id).select('-accessToken');

      if (!req.shop) {
        res.status(401);
        throw new Error('Not authorized, shop not found');
      }

      // If successful, proceed to the next middleware or route handler
      next();
    } catch (error) {
      logger.error(`Authentication Error: ${error.message}`);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

export { protect };
