import 'dotenv/config';
import { Elysia } from 'elysia';
import config from '@/config';
import logger from '@lib/logger';

// Initialize the global cambusa object
global.cambusa = {
  config,
  log: logger,
};

// Create a new Elysia app instance
const app = new Elysia();

// Function to print the welcome banner
function printWelcomeBanner({ host, port }) {
  console.log(`
************************************************************
*                                                          *
*                    Welcome to Cambusa 🚣                 *
*           Your modern framework for smooth sailing       *
*                                                          *
*                  Running at ${host}:${port}                 *
*                                                          *
************************************************************
  `.trim());
}

// Dynamically load and apply middlewares
import loadMiddlewares from '@lib/middlewaresLoader';
await loadMiddlewares(app);

cambusa.log.info('⚙️  Middlewares loaded.');

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
  printWelcomeBanner({ host, port }); // Print the welcome banner
});

// Global errors
app.on('error', (err) => {
  logger.error(`Unhandled error: ${err.message}`, err);
});
