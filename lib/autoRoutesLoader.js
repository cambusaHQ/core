import { Elysia } from 'elysia';

export default function loadAutoRoutes(modelNames) {
  const routers = [];

  modelNames.forEach((modelName) => {
    const repository = cambusa.models[modelName];
    const basePath = repository.metadata.tableName;

    const router =  new Elysia({
      name: `routes-${basePath}`,
      prefix: `/${basePath}`,
    });

    // Create
    router.post('/', async ({ body, set }) => {
      try {
        const data = body;
        const entity = repository.create(data);
        const result = await repository.save(entity);
        return result;
      } catch (error) {
        cambusa.log.error(`Error creating ${modelName}:`, error.message);
        set.status = 400;
        return { error: error.message };
      }
    });

    // Read All
    router.get('/', async () => {
      try {
        const results = await repository.find();
        return results;
      } catch (error) {
        cambusa.log.error(`Error fetching ${modelName}s:`, error.message);
        return { error: error.message };
      }
    });

    // Read One
    router.get('/:id', async ({ params, set }) => {
      try {
        const id = params.id;
        const result = await repository.findOne({ where: { id } });
        if (result) {
          return result;
        } else {
          set.status = 404;
          return { error: `${modelName} not found` };
        }
      } catch (error) {
        cambusa.log.error(`Error fetching ${modelName}:`, error.message);
        set.status = 400;
        return { error: error.message };
      }
    });

    // Update
    router.put('/:id', async ({ params, body, set }) => {
      try {
        const id = params.id;
        const data = body;
        await repository.update(id, data);
        const updated = await repository.findOne({ where: { id } });
        return updated;
      } catch (error) {
        cambusa.log.error(`Error updating ${modelName}:`, error.message);
        set.status = 400;
        return { error: error.message };
      }
    });

    // Delete
    router.delete('/:id', async ({ params, set }) => {
      try {
        const id = params.id;
        const result = await repository.delete(id);
        if (result.affected > 0) {
          return { message: `${modelName} deleted` };
        } else {
          set.status = 404;
          return { error: `${modelName} not found` };
        }
      } catch (error) {
        cambusa.log.error(`Error deleting ${modelName}:`, error.message);
        set.status = 400;
        return { error: error.message };
      }
    });

    routers.push(router);
  });

  return routers;
}
