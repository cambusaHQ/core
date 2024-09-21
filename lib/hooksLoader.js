// @lib/hooksLoader.js
// This module is responsible for loading and executing hooks in the Cambusa framework

import fs from 'fs';
import path from 'path';

/**
 * Loads and executes hooks from the specified directory
 * @param {string} hooksDirectory - The directory path where hook files are located (default: 'api/hooks')
 */
async function loadHooks(hooksDirectory = 'api/hooks') {
  // Resolve the full path to the hooks directory
  const hooksPath = path.resolve(process.cwd(), hooksDirectory);

  // Check if the hooks directory exists
  if (!fs.existsSync(hooksPath)) {
    cambusa.log.warn(`Hooks directory does not exist: ${hooksPath}`);
    return;
  }

  // Read all files in the hooks directory
  let files = fs.readdirSync(hooksPath);

  // Array to store hook objects
  const hooks = [];

  // Load hooks from files
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      const hookPath = path.join(hooksPath, file);
      try {
        // Dynamically import the hook module
        const hookModule = await import(hookPath);
        const hookFunction = hookModule.default || hookModule;
        // Get the priority of the hook, default to 0 if not specified
        const priority = hookModule.priority || 0;

        // Ensure the imported module exports a function
        if (typeof hookFunction === 'function') {
          hooks.push({ hookFunction, priority, file });
        } else {
          cambusa.log.warn(`Hook file does not export a function: ${file}`);
        }
      } catch (error) {
        cambusa.log.error(`Failed to load hook ${file}: ${error.message}`);
      }
    }
  }

  // Sort hooks by priority (lower numbers execute first)
  hooks.sort((a, b) => a.priority - b.priority);

  // Execute hooks in order of priority
  for (const { hookFunction, file } of hooks) {
    try {
      await hookFunction(cambusa);
      cambusa.log.verbose(`[Hook]: ${file} loaded and executed`);
    } catch (error) {
      cambusa.log.error(`Error executing hook ${file}: ${error.message}`);
    }
  }
}

export default loadHooks;
