import { Elysia } from 'elysia';
import { extractRelations } from '@lib/datastore/extractRelations';

/**
 * Refactored blueprints module to support relations and pagination.
 * @param {Array} schema - Array of model definitions.
 * @returns {Array} - Array of Elysia routers.
 */
export function blueprints(schema) {
  const routers = [];

  schema.forEach((model) => {
    // Extract route options from the model definition
    const { routes } = model.options;
    const disabledRoutes = routes?.disabled || [];
    const basePath = routes?.basePath || model.options.tableName;

    // If routes are disabled, skip creating routes for this model
    if (routes?.disabled === true) {
      cambusa.log.verbose(`[Blueprints] Blueprints for ${model.options.name} are disabled.`);
      return;
    }

    const router = new Elysia({
      name: `routes-${basePath}`,
      prefix: `/${basePath}`,
    });

    /**
     * Helper Function: Validate and Extract Relations
     * @param {Object} body - The request body.
     * @param {Object} relationsDef - The relations definition from model options.
     * @returns {Object} - An object containing relations and cleaned data.
     */
    const validateAndExtractRelations = async (body, relationsDef) => {
      const { relations, cleanedData } = await extractRelations(body, relationsDef);
      return { relations, cleanedData };
    };

    /**
     * Create Route
     * Accepts relations as arrays of IDs.
     */
    if (!disabledRoutes.includes('create')) {
      router.post('', async ({ body, set }) => {
        try {
          const { relations, cleanedData } = await validateAndExtractRelations(
            body,
            model.options.relations
          );

          // Create entity instance with relations
          const entity = cambusa.models[model.options.name].create({
            ...cleanedData,
            ...relations,
          });

          // Save entity
          const result = await cambusa.models[model.options.name].save(entity);

          return result;
        } catch (error) {
          cambusa.log.error(`Error creating ${model.options.name}:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    /**
     * Read All Route
     * Supports pagination via 'skip' and 'limit' query parameters.
     * Uses 'populate' instead of 'relations' for including related data.
     */
    if (!disabledRoutes.includes('readAll')) {
      router.get('', async ({ query, set }) => {
        try {
          // Parse 'populate' query parameter instead of 'relations'
          const populate = query.populate
            ? query.populate.split(',').map((rel) => rel.trim())
            : [];

          // Validate populate relations
          const validRelations = model.options.relations
            ? Object.keys(model.options.relations)
            : [];
          const invalidRelations = populate.filter(
            (rel) => !validRelations.includes(rel)
          );

          if (invalidRelations.length > 0) {
            set.status = 400;
            return {
              error: `Invalid relations to populate: ${invalidRelations.join(', ')}`,
            };
          }

          // Parse 'skip' and 'limit' for pagination
          const skip = query.skip ? parseInt(query.skip, 10) : 0;
          const limit = query.limit ? parseInt(query.limit, 10) : 10;

          // Validate 'skip' and 'limit'
          if (isNaN(skip) || skip < 0) {
            set.status = 400;
            return { error: `'skip' must be a non-negative integer.` };
          }

          if (isNaN(limit) || limit <= 0) {
            set.status = 400;
            return { error: `'limit' must be a positive integer.` };
          }

          // Fetch entities with relations and pagination
          const results = await cambusa.models[model.options.name].find({
            relations: populate,
            skip: skip,
            take: limit,
          });

          // Fetch total count for pagination meta
          const total = await cambusa.models[model.options.name].count();

          return {
            data: results,
            meta: {
              total: total,
              skip: skip,
              limit: limit,
              lastPage: Math.ceil(total / limit),
            },
          };
        } catch (error) {
          cambusa.log.error(`Error fetching ${model.options.name}s:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    /**
     * Read One Route
     * Uses 'populate' instead of 'relations' for including related data.
     */
    if (!disabledRoutes.includes('readOne')) {
      router.get('/:id', async ({ params, query, set }) => {
        try {
          const id = params.id;

          // Parse 'populate' query parameter instead of 'relations'
          const populate = query.populate
            ? query.populate.split(',').map((rel) => rel.trim())
            : [];

          // Validate populate relations
          const validRelations = model.options.relations
            ? Object.keys(model.options.relations)
            : [];
          const invalidRelations = populate.filter(
            (rel) => !validRelations.includes(rel)
          );

          if (invalidRelations.length > 0) {
            set.status = 400;
            return {
              error: `Invalid relations to populate: ${invalidRelations.join(', ')}`,
            };
          }

          // Fetch entity with relations
          const result = await cambusa.models[model.options.name].findOne({
            where: { id: id },
            relations: populate,
          });

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

    /**
     * Update Route
     * Accepts relations as arrays of IDs.
     */
    if (!disabledRoutes.includes('update')) {
      router.put('/:id', async ({ params, body, set }) => {
        try {
          const id = params.id;
          const { relations, cleanedData } = await validateAndExtractRelations(
            body,
            model.options.relations
          );

          // Update entity with relations
          const updateData = {
            ...cleanedData,
            ...relations,
          };

          await cambusa.models[model.options.name].update(id, updateData);

          // Fetch updated entity with relations
          const updated = await cambusa.models[model.options.name].findOne({
            where: { id: id },
            relations: Object.keys(relations),
          });

          if (updated) {
            return updated;
          } else {
            set.status = 404;
            return { error: `${model.options.name} not found after update.` };
          }
        } catch (error) {
          cambusa.log.error(`Error updating ${model.options.name}:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    /**
     * Delete Route
     */
    if (!disabledRoutes.includes('delete')) {
      router.delete('/:id', async ({ params, set }) => {
        try {
          const id = params.id;
          const result = await cambusa.models[model.options.name].delete(id);

          if (result.affected > 0) {
            return { message: `${model.options.name} deleted.` };
          } else {
            set.status = 404;
            return { error: `${model.options.name} not found.` };
          }
        } catch (error) {
          cambusa.log.error(`Error deleting ${model.options.name}:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    // Add the configured router to the routers array
    routers.push(router);
  });

  return routers;
}

export default blueprints;
