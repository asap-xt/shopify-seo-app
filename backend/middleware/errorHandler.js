// backend/middleware/errorHandler.js
// This file contains custom error handling middleware for the Express app.

import logger from '../utils/logger.js';

// Middleware to handle 404 Not Found errors.
// This is triggered if no other route matches the request.
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the global error handler
};

// Global error handling middleware.
// It catches all errors passed via next(error) from any route or middleware.
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come with a success status code.
  // We ensure the status code is an error code.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose validation errors can be verbose. We can simplify them.
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }
  
  // Log the error for debugging purposes
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  logger.error(err.stack);

  // Send a structured error response to the client.
  // In production, we might not want to send the stack trace.
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
