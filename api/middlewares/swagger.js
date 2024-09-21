// Swagger Documentation Middleware
// This module conditionally enables Swagger documentation for the API

import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

// Create a new Elysia plugin for Swagger
const plugin = new Elysia({
  name: 'swagger', // Name the plugin for easy identification
});

// Check if Swagger is enabled in the configuration
if (cambusa.config.swagger.enabled) {
  // If enabled, apply the Swagger middleware
  // Use the configuration from cambusa.config.swagger
  plugin.use(swagger(cambusa.config.swagger));
}

// Export the plugin for use in the main application
export default plugin;
