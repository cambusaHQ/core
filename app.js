import 'dotenv/config';
import { Elysia } from 'elysia';
import config from '@/config';
import logger from '@lib/logger';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import requestLogger from '@lib/middlewares/requestLogger';

// Initialize the global cambusa object
global.cambusa = {
  config,
  log: logger,
};

// Create a new Elysia app instance
const app = new Elysia();

cambusa.log.info('🚣 Starting Cambusa server...');

// Conditionally apply request logging middleware based on configuration
if (cambusa.config.logger?.logRequests) {
  app.use(requestLogger);
}

// Conditionally enable swagger documentation
if (cambusa.config.swagger?.enabled) {
  app.use(swagger(cambusa.config.swagger));
}

// Cors
app.use(cors(cambusa.config.security.cors));

cambusa.log.info('⚙️  Plugins loaded.');

// Load routes from the lib directory
import loadRoutes from '@lib/routesLoader.js';
await loadRoutes(app);

cambusa.log.info('🗺️  Routes loaded.');

// Start the server
const { host, port } = cambusa.config.server;
const normalizedPort = parseInt(port, 10);
app.listen({
  port: normalizedPort,
  hostname: host,
 }, () => {
  logger.info(`Cambusa server running at http://${host}:${port} in ${config.env} mode`);
});

// Global errors
app.on('error', (err) => {
  logger.error(`Unhandled error: ${err.message}`, err);
});
