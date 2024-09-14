#!/usr/bin/env node

import 'dotenv/config';
import { Elysia } from 'elysia';
import minimist from 'minimist';
import path from 'path';
import { existsSync } from 'fs';

import config from '@/config';

// Parse command-line arguments
const argv = minimist(process.argv.slice(2));

// Load configurations from command-line arguments
config.load(argv);

// Determine the environment
const env = config.get('env') || process.env.NODE_ENV || 'development';

// Load environment-specific configurations
const envConfigPath = path.join(process.cwd(), 'config', 'env', `${env}.js`);
if (existsSync(envConfigPath)) {
  const envConfig = await import(envConfigPath);
  config.load(envConfig.default || envConfig);
}

// Load user-specific configurations from the user's home directory
const userConfigPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.cambusa',
  'config.js'
);
if (existsSync(userConfigPath)) {
  const userConfig = await import(userConfigPath);
  config.load(userConfig.default || userConfig);
}

// Validate configurations
config.validate({ allowed: 'strict' });

// Initialize the global cambusa object
global.cambusa = {
  config: config.getProperties(),
  // ... other global properties like services, loggers, etc.
};

// Create a new Elysia app instance
const app = new Elysia();

// Load routes from the lib directory
import loadRoutes from '../lib/routesLoader.js';
await loadRoutes(app); // Ensure loadRoutes is awaited if it's asynchronous

// Start the server
const { host, port } = cambusa.config.server || { host: '127.0.0.1', port: 3000 };
app.listen(port, host, () => {
  console.log(`Cambusa server running at http://${host}:${port}`);
});
