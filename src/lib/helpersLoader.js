import { readdirSync, statSync } from 'fs';
import path from 'path';

/**
 * Loads helper functions from a specified directory
 * @param {string} dir - The directory path where helper files are located (default: 'api/helpers')
 * @returns {Object} An object containing all loaded helper functions
 */
export function loadHelpers(dir = 'api/helpers') {
  // Resolve the full path to the helpers directory
  const helpersDir = path.join(process.cwd(), dir);

  // Read all files in the helpers directory
  const files = readdirSync(helpersDir);

  // Object to hold all helper functions
  const helpers = {};

  // Iterate through each file in the helpers directory
  files.forEach((file) => {
    const filePath = path.join(helpersDir, file);
    const stat = statSync(filePath);

    // Only load .js files that are not directories
    if (stat.isFile() && file.endsWith('.js')) {
      // Import the helper function from the file
      const helperFunction = require(filePath).default;

      // Use the filename (without extension) as the key for the helper
      const helperName = path.basename(file, '.js');

      // Add the helper function to the helpers object
      helpers[helperName] = helperFunction;

      // Log that the helper has been loaded
      cambusa.log.verbose(`[Helper]: ${helperName} loaded`);
    }
  });

  // Return the object containing all loaded helper functions
  return helpers;
}

// Export the loadHelpers function as the default export
export default loadHelpers;
