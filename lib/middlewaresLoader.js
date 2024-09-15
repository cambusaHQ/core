import { statSync } from 'fs';
import path from 'path';

export async function loadMiddlewares() {
  const orderedMiddlewares = cambusa.config.middlewares;

  for (const middlewareName of orderedMiddlewares) {
    const filePath = path.join('api/middlewares', `${middlewareName}.js`);
    const stat = statSync(filePath);

    if (stat.isFile() && filePath.endsWith('.js')) {
      // Dynamically import the middleware plugin based on the order
      const plugin = await import(filePath);

      // Use the middleware plugin
      cambusa.app.use(plugin.default);
    }
  }
}

export default loadMiddlewares;
