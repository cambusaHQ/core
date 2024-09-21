// CORS (Cross-Origin Resource Sharing) support
// This middleware enables and configures CORS for the application

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

// Create a new Elysia plugin for CORS
const plugin = new Elysia({
  name: 'cors', // Name the plugin for easy identification
}).use(cors(cambusa.config.security.cors)); // Apply CORS middleware with configuration from cambusa.config.security.cors

// Export the plugin for use in the main application
export default plugin;
