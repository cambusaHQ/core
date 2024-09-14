import 'dotenv/config';
import { Elysia } from 'elysia';
import config from '@/config';

// Initialize the global cambusa object
global.cambusa = {
  config,
  // ... other global properties like services, loggers, etc.
};

// Create a new Elysia app instance
const app = new Elysia();

// Load routes from the lib directory
import loadRoutes from '@lib/routesLoader.js';
await loadRoutes(app);

// Start the server
const { host, port } = cambusa.config.server;
const normalizedPort = parseInt(port, 10);
app.listen({
  port: normalizedPort,
  hostname: host,
 }, () => {
  console.log(`Cambusa server running at http://${host}:${port}`);
});
