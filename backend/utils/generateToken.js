// backend/utils/generateToken.js
// This utility function is responsible for creating JSON Web Tokens (JWT).
// These tokens are used to authenticate requests from the frontend to the backend.

import jwt from 'jsonwebtoken';

/**
 * @desc    Generate a JWT for a given shop ID
 * @param   {string} id - The shop's MongoDB document ID
 * @returns {string} The generated JSON Web Token
 */
const generateToken = (id) => {
  // The token is signed with a secret key from your environment variables.
  // It includes the shop's ID as its payload and is set to expire in 30 days.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;