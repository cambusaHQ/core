import { statSync } from 'fs';
import path from 'path';

/**
 * Loads middleware plugins based on the provided configuration
 * @param {string[]} config - An array of middleware names to be loaded
 * @returns {Function[]} An array of loaded middleware functions
 */
export async function loadMiddlewares(config) {
  const orderedMiddlewares = config;
  const middlewares = [];

  for (const middlewareName of orderedMiddlewares) {
    // Construct the full file path for the middleware
    const filePath = path.join('api/middlewares', `${middlewareName}.js`);
    const stat = statSync(filePath);

    // Check if the file exists and is a JavaScript file
    if (stat.isFile() && filePath.endsWith('.js')) {
      // Dynamically import the middleware plugin based on the order
      const plugin = await import(filePath);

      // Log the successful loading of the middleware
      cambusa.log.verbose(`[Middleware]: ${middlewareName} loaded`);

      // Add the middleware function to the array
      middlewares.push(plugin.default);
    }
  }

  // Return the array of loaded middleware functions
  return middlewares;
}

// Export the loadMiddlewares function as the default export
export default loadMiddlewares;
