// Cors support
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const plugin =  new Elysia({
    name: 'cors',
  })
  .use(cors(cambusa.config.security.cors));

export default plugin;
