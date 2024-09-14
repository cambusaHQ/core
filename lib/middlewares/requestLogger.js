import { Elysia } from 'elysia';

const plugin =  new Elysia({
    name: 'requestLogger',
  })
  .onRequest(({ request, path }) => {
    cambusa.log.http(`[${request.method}] ${path}`);
  });

export default plugin;
