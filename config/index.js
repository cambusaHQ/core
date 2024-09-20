import 'dotenv/config';
import { existsSync, readdirSync } from 'fs';
import minimist from 'minimist';
import path from 'path';
import { boolean as toBoolean, isBooleanable } from 'boolean';

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

// Function to parse a value and convert it to the appropriate type
function parseValue(value) {
  if (typeof value !== 'string') {
    return value; // Return the value as is if it's not a string
  }

  const trimmedValue = value.trim();

  if (isBooleanable(trimmedValue)) {
    return toBoolean(trimmedValue);
  }

  // Handle numeric values
  if (!isNaN(trimmedValue) && trimmedValue !== '') {
    return Number(trimmedValue);
  }

  // Handle arrays and objects
  if (
    (trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) ||
    (trimmedValue.startsWith('[') && trimmedValue.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmedValue);
    } catch (error) {
      console.error(error);
      return trimmedValue; // If JSON parsing fails, return the string as is
    }
  }

  return trimmedValue; // Return the string as is if no conversion was possible
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
  current[keys[keys.length - 1]] = parseValue(value); // Apply the parsed value
}

// Apply environment variables to the configuration
function applyEnvVariables(config, prefix = 'CAMBUSA__') {
  for (const key in process.env) {
    // Only process environment variables that start with the given prefix
    if (key.startsWith(prefix)) {
      // Remove the prefix and convert '__' to dots for nested keys
      const configKey = key
        .slice(prefix.length) // Remove the prefix
        .toLowerCase()
        .replace(/__/g, '.'); // Convert double underscores to dots for nesting

      const value = process.env[key];
      setConfigValue(config, configKey, value);
    }
  }
}

// Apply command-line arguments to the configuration
function applyCommandLineArgs(config, argv) {
  const { _, ...args } = argv; // eslint-disable-line no-unused-vars
  deepMerge(config, args);
}

// Initialize and export configuration
async function initConfig() {
  let config = {};

  // Load default configurations
  const defaultConfig = await loadConfigurations();
  deepMerge(config, defaultConfig);

  // Apply environment variables
  applyEnvVariables(config);

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

  // Apply command-line arguments
  applyCommandLineArgs(config, argv);

  // Return the final configuration
  return config;
}

// Export the configuration
export default await initConfig();
