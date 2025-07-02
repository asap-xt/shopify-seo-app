// backend/services/authService.js
// This service could contain more complex authentication logic if needed,
// such as handling different auth strategies or user roles.
// For this app, the logic is mostly in the controller and Shopify API library.

import jwt from 'jsonwebtoken';

/**
 * @desc    Generate a JWT for a given shop ID
 * @param   {string} id - The shop's MongoDB document ID
 * @returns {string} The generated JSON Web Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};

export { generateToken };
