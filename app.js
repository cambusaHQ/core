import 'dotenv/config';
import { Elysia } from 'elysia';

import loadMiddlewares from '@lib/middlewaresLoader';
import loadRoutes from '@lib/routesLoader.js';
import datastore from '@lib/datastore.js';
import logger from '@lib/logger';
import welcomeBanner from '@lib/welcomeBanner';

import config from '@/config';

// Initialize the global cambusa object
const cambusa = global.cambusa = { config };

// Create a new Elysia app instance
cambusa.app = new Elysia().decorate('cambusa', cambusa);

// Inject logger
cambusa.log = logger(cambusa);

// Dynamically load and apply middlewares
await loadMiddlewares();
cambusa.log.info('⚙️  Middlewares loaded.');

// Load models
cambusa.db = await datastore(cambusa);
await cambusa.db.initialize();
cambusa.log.info('📚  Database initialized.');

// Load routes from the lib directory
await loadRoutes();
cambusa.log.info('🗺️  Routes loaded.');


// Start the server
const { host, port } = cambusa.config.server;
const normalizedPort = parseInt(port, 10);
cambusa.app.listen({
  port: normalizedPort,
  hostname: host,
 }, () => {
  welcomeBanner({ host, port }); // Print the welcome banner
});

// Global errors
cambusa.app.on('error', (err) => {
  logger.error(`Unhandled error: ${err.message}`, err);
});
