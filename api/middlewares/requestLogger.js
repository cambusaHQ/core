// Conditionally apply request logging middleware based on configuration
import { Elysia } from 'elysia';

const plugin = new Elysia({
  name: 'requestLogger',
});

if (cambusa.config.logger?.logRequests) {
  plugin.onRequest(({ request, path }) => {
    cambusa.log.http(`[${request.method}] ${path}`);
  });
}

export default plugin;
