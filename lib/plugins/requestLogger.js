import { Elysia } from 'elysia';

export default () => {
  return new Elysia({
    // Lifecycle hook for logging incoming requests
    onRequest(ctx) {
      const { method, path, query, headers } = ctx;

      cambusa.log.info('test');

      ctx.__startTime = Date.now(); // Save the start time to calculate the duration

      cambusa.log.info({
        method,
        path,
        query,
        headers,
      }, 'Incoming request');
    },

    // Lifecycle hook for logging completed requests
    onResponse(ctx) {
      const { method, path } = ctx;
      const status = ctx.set?.status || 200;
      const duration = Date.now() - ctx.__startTime;

      cambusa.log.info({
        method,
        path,
        status,
        duration,
      }, 'Request completed');
    },
  });
};
