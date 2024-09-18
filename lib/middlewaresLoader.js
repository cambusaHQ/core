import { statSync } from 'fs';
import path from 'path';

export async function loadMiddlewares(config) {
  const orderedMiddlewares = config;
  const middlewares = [];

  for (const middlewareName of orderedMiddlewares) {
    const filePath = path.join('api/middlewares', `${middlewareName}.js`);
    const stat = statSync(filePath);

    if (stat.isFile() && filePath.endsWith('.js')) {
      // Dynamically import the middleware plugin based on the order
      const plugin = await import(filePath);

      cambusa.log.verbose(`[Middleware]: ${middlewareName} loaded`);

      // Use the middleware plugin
      middlewares.push(plugin.default);
    }
  }

  return middlewares;
}

export default loadMiddlewares;
