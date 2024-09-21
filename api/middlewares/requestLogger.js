// Request Logger Middleware
// This module provides conditional request logging functionality based on the application configuration.

import { Elysia } from 'elysia';

// Create a new Elysia plugin for request logging
const plugin = new Elysia({
  name: 'requestLogger', // Name the plugin for easy identification
});

// Check if request logging is enabled in the configuration
if (cambusa.config.logger?.logRequests) {
  // If enabled, add an onRequest hook to log incoming requests
  plugin.onRequest(({ request, path }) => {
    // Log the HTTP method and path of each request
    // This uses the configured logger (cambusa.log) with the 'http' log level
    cambusa.log.http(`[${request.method}] ${path}`);
  });
}

// Export the plugin for use in the main application
export default plugin;
