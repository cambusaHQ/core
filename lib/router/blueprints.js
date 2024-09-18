import { Elysia } from 'elysia';

export function blueprints(models) {
  const routers = [];

  models.forEach((model) => {
    // Extract route options from the model definition
    const { routes } = model.options;
    const disabledRoutes = routes?.disabled || [];
    const basePath = routes?.basePath || model.options.tableName;

    // If disabled is set to false, skip creating routes
    if (routes?.disabled === true) {
      cambusa.log.verbose(`Routes for ${model.options.name} are disabled.`);
      return;
    }

    const router =  new Elysia({
      name: `routes-${basePath}`,
      prefix: `/${basePath}`,
    });

    // Create
    if (!disabledRoutes.includes('create')) {
      router.post('', async ({ body, set }) => {
        try {
          const data = body;
          const entity = cambusa.models[model.options.name].create(data);
          const result = await cambusa.models[model.options.name].save(entity);
          return result;
        } catch (error) {
          cambusa.log.error(`Error creating ${model.options.name}:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    // Read all
    if (!disabledRoutes.includes('readAll')) {
      router.get('', async () => {
        try {
          const results = await cambusa.models[model.options.name].find();
          return results;
        } catch (error) {
          cambusa.log.error(`Error fetching ${model.options.name}s:`, error.message);
          return { error: error.message };
        }
      });
    }

    // Read One
    if (!disabledRoutes.includes('readOne')) {
      router.get('/:id', async ({ params, set }) => {
        try {
          const id = params.id;
          const result = await cambusa.models[model.options.name].findOne({ where: { id } });
          if (result) {
            return result;
          } else {
            set.status = 404;
            return { error: `${model.options.name} not found` };
          }
        } catch (error) {
          cambusa.log.error(`Error fetching ${model.options.name}:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    // Update
    if (!disabledRoutes.includes('update')) {
      router.put('/:id', async ({ params, body, set }) => {
        try {
          const id = params.id;
          const data = body;
          await cambusa.models[model.options.name].update(id, data);
          const updated = await cambusa.models[model.options.name].findOne({ where: { id } });
          return updated;
        } catch (error) {
          cambusa.log.error(`Error updating ${model.options.name}:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    // Delete
    if (!disabledRoutes.includes('delete')) {
      router.delete('/:id', async ({ params, set }) => {
        try {
          const id = params.id;
          const result = await cambusa.models[model.options.name].delete(id);
          if (result.affected > 0) {
            return { message: `${model.options.name} deleted` };
          } else {
            set.status = 404;
            return { error: `${model.options.name} not found` };
          }
        } catch (error) {
          cambusa.log.error(`Error deleting ${model.options.name}:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    routers.push(router);
  });

  return routers;
}

export default blueprints;
