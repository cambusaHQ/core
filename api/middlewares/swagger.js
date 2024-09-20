// Conditionally enable swagger documentation
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

const plugin = new Elysia({
  name: 'swagger',
});

if (cambusa.config.swagger.enabled) {
  plugin.use(swagger(cambusa.config.swagger));
}

export default plugin;
