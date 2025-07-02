// backend/utils/logger.js
// Configures a universal logger for the application using Winston.
// This allows for consistent, leveled logging throughout the backend.

import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, align, json } = format;

// Custom format for log messages to make them readable
const logFormat = printf(({ level, message, timestamp, stack }) => {
  // If a stack trace is available (for errors), include it.
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  // Set the default logging level. In development, we see all logs ('debug').
  // In production, we would typically only see 'info' and above.
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    // Use colors for the log level in the console, which helps with readability.
    colorize(),
    // Add a timestamp to each log entry.
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Align log messages.
    align(),
    // Apply the custom printf format.
    logFormat
  ),
  // Define where the logs should be sent.
  transports: [
    // Always log to the console. This is the primary output.
    new transports.Console(),
    
    // In a production environment, it's good practice to also log to files
    // for auditing and long-term storage.
    /*
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    */
  ],
  // Prevent Winston from exiting the process on an unhandled exception.
  exitOnError: false,
});

export default logger;
