import { statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads middleware plugins based on the provided configuration
 * @param {string[]} config - An array of middleware names to be loaded
 * @returns {Function[]} An array of loaded middleware functions
 */
export async function loadMiddlewares(config) {
  const orderedMiddlewares = config;
  const middlewares = [];

  for (const middlewareName of orderedMiddlewares) {
    let middleware;

    // First, try to load from the user's project
    try {
      const userFilePath = path.join(
        process.cwd(),
        'api',
        'middlewares',
        `${middlewareName}.js`
      );
      const stat = statSync(userFilePath);

      if (stat.isFile() && userFilePath.endsWith('.js')) {
        middleware = await import(userFilePath);
        cambusa.log.verbose(
          `[Middleware]: ${middlewareName} loaded from user project`
        );
      }
    } catch (error) {
      // If not found in user's project, try to load from the core package
      try {
        const coreFilePath = path.join(
          __dirname,
          '..',
          'api',
          'middlewares',
          `${middlewareName}.js`
        );
        const stat = statSync(coreFilePath);

        if (stat.isFile() && coreFilePath.endsWith('.js')) {
          middleware = await import(coreFilePath);
          cambusa.log.verbose(
            `[Middleware]: ${middlewareName} loaded from core package`
          );
        }
      } catch (coreError) {
        cambusa.log.error(
          `Error loading middleware ${middlewareName}: Not found in user project or core package`
        );
        continue;
      }
    }

    if (middleware && middleware.default) {
      middlewares.push(middleware.default);
    } else {
      cambusa.log.error(
        `Error loading middleware ${middlewareName}: Invalid middleware format`
      );
    }
  }

  // Return the array of loaded middleware functions
  return middlewares;
}

// Export the loadMiddlewares function as the default export
export default loadMiddlewares;
