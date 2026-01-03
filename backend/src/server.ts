import app from './app';
import connectDB from './config/database';
import config from './config/env';
import logger from './utils/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const server = app.listen(config.PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
  console.log(`🚀 Server started on http://localhost:${config.PORT}`);
  console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
  console.log(`📡 API endpoint: http://localhost:${config.PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default server;
