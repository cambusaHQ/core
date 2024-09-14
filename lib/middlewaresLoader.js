import { statSync } from 'fs';
import path from 'path';
import middlewareConfig from '@/config/middlewares';

async function loadMiddlewares(app, dir = 'middlewares') {
  const orderedMiddlewares = middlewareConfig.middlewares;

  for (const middlewareName of orderedMiddlewares) {
    const filePath = path.join(dir, `${middlewareName}.js`);
    const stat = statSync(filePath);

    if (stat.isFile() && filePath.endsWith('.js')) {
      // Dynamically import the middleware plugin based on the order
      const plugin = await import(filePath);

      // Use the middleware plugin
      app.use(plugin.default);
    }
  }
}

export default loadMiddlewares;
