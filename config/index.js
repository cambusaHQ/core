// config/index.js

import 'dotenv/config';
import minimist from 'minimist';
import path from 'path';
import { existsSync, readdirSync } from 'fs';

// Function to deeply merge two objects
function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Load and merge configuration fragments
async function loadConfigurations() {
  const configData = {};

  const configDir = path.join(process.cwd(), 'config');
  const configFiles = readdirSync(configDir).filter(
    (file) =>
      file.endsWith('.js') &&
      file !== 'index.js' &&
      file !== 'custom-schema.js' &&
      file !== 'env' // Exclude the 'env' directory
  );

  for (const file of configFiles) {
    const configFilePath = path.join(configDir, file);
    const configModule = await import(configFilePath);
    deepMerge(configData, configModule.default || configModule);
  }

  return configData;
}

// Initialize the configuration object
let config = {};

// Load default configurations
const defaultConfig = await loadConfigurations();
deepMerge(config, defaultConfig);

// Parse command-line arguments
const argv = minimist(process.argv.slice(2));

// Determine the environment
const env = argv.env || process.env.NODE_ENV || config.env || 'development';
config.env = env;

// Load environment-specific configuration values
const envConfigPath = path.join(process.cwd(), 'config', 'env', `${env}.js`);
if (existsSync(envConfigPath)) {
  const envConfig = await import(envConfigPath);
  deepMerge(config, envConfig.default || envConfig);
}

// Load user-specific configuration values from the user's home directory
const userConfigPath = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.cambusa',
  'config.js'
);
if (existsSync(userConfigPath)) {
  const userConfig = await import(userConfigPath);
  deepMerge(config, userConfig.default || userConfig);
}

// Apply environment variables to the configuration
function applyEnvVariables(config) {
  for (const key in process.env) {
    // Convert environment variable names to lower case and replace underscores with dots
    const configKey = key.toLowerCase().replace(/_/g, '.');
    const value = process.env[key];

    // Set the value in the config object
    setConfigValue(config, configKey, value);
  }
}

// Helper function to set a nested value in the config object
function setConfigValue(obj, key, value) {
  const keys = key.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];

    // Ensure current[k] is an object
    if (
      !current[k] ||
      typeof current[k] !== 'object' ||
      Array.isArray(current[k])
    ) {
      current[k] = {};
    }

    current = current[k];
  }
  current[keys[keys.length - 1]] = value;
}

// Apply environment variables
applyEnvVariables(config);

// Apply command-line arguments to the configuration
function applyCommandLineArgs(config, argv) {
  for (const key in argv) {
    if (key === '_') continue; // Skip non-option arguments
    const value = argv[key];
    setConfigValue(config, key, value);
  }
}

// Apply command-line arguments
applyCommandLineArgs(config, argv);

// Export the final configuration
export default config;
