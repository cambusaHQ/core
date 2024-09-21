import 'dotenv/config';
import { existsSync, readdirSync } from 'fs';
import minimist from 'minimist';
import path from 'path';
import { boolean as toBoolean, isBooleanable } from 'boolean';
import { merge as _merge } from 'lodash';

/**
 * Parses a value and converts it to the appropriate type.
 * Handles booleans, numbers, arrays, and objects.
 * @param {*} value - The value to parse.
 * @returns {*} The parsed value.
 */
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

/**
 * Loads and merges configuration fragments from the config directory.
 * @returns {Promise<Object>} A promise that resolves to the merged configuration object.
 */
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
    _merge(configData, configModule.default || configModule);
  }

  return configData;
}

/**
 * Sets a nested value in the config object using a dot-notated key.
 * @param {Object} obj - The object to modify.
 * @param {string} key - The dot-notated key representing the path to set.
 * @param {*} value - The value to set.
 */
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

/**
 * Applies environment variables to the configuration.
 * Only processes variables that start with the given prefix.
 * @param {Object} config - The configuration object to modify.
 * @param {string} [prefix='CAMBUSA__'] - The prefix for relevant environment variables.
 */
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

/**
 * Applies command-line arguments to the configuration.
 * @param {Object} config - The configuration object to modify.
 * @param {Object} argv - The parsed command-line arguments.
 */
function applyCommandLineArgs(config, argv) {
  const { _, ...args } = argv; // eslint-disable-line no-unused-vars
  _merge(config, args);
}

/**
 * Initializes and returns the final configuration object.
 * This function loads default configurations, applies environment variables,
 * loads environment-specific and user-specific configurations, and applies command-line arguments.
 * @returns {Promise<Object>} A promise that resolves to the final configuration object.
 */
async function initConfig() {
  let config = {};

  // Load default configurations
  const defaultConfig = await loadConfigurations();
  _merge(config, defaultConfig);

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
    _merge(config, envConfig.default || envConfig);
  }

  // Load user-specific configuration values from the user's home directory
  const userConfigPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    '.cambusa',
    'config.js'
  );
  if (existsSync(userConfigPath)) {
    const userConfig = await import(userConfigPath);
    _merge(config, userConfig.default || userConfig);
  }

  // Apply command-line arguments
  applyCommandLineArgs(config, argv);

  // Return the final configuration
  return config;
}

// Export the configuration
export default await initConfig();
