import { Elysia } from 'elysia';
import { extractRelations } from '@lib/datastore/extractRelations';

/**
 * Blueprints module to support relations, pagination, filtering, sorting, and header-based meta.
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
      cambusa.log.verbose(`Routes for ${model.options.name} are disabled.`);
      return;
    }

    const router = new Elysia({
      name: `routes-${basePath}`,
      prefix: `/${basePath}`,
    });

    /**
     * Helper Function: Parse and Validate Sort Parameter
     * @param {String} sortParam - The raw sort query parameter.
     * @returns {Object} - TypeORM-compatible order object.
     * @throws {Error} - Throws error if validation fails.
     */
    const parseSort = (sortParam) => {
      const sortOrder = {};

      if (!sortParam) return sortOrder;

      const sortFields = sortParam.split(',').map(field => field.trim());

      sortFields.forEach(field => {
        const [key, order] = field.split(':').map(part => part.trim());

        if (order && !['asc', 'desc'].includes(order.toLowerCase())) {
          throw new Error(`Invalid sort order '${order}' for field '${key}'. Use 'asc' or 'desc'.`);
        }

        sortOrder[key] = order ? order.toUpperCase() : 'ASC';
      });

      return sortOrder;
    };

    /**
     * Create Route
     */
    if (!disabledRoutes.includes('create')) {
      router.post('', async ({ body, set }) => {
        try {
          const { relations, cleanedData } = await extractRelations(body, model.options.relations);

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
     * Read All Route with Pagination, Filtering, and Sorting
     */
    if (!disabledRoutes.includes('readAll')) {
      router.get('', async ({ query, set }) => {
        try {
          // Parse 'populate' query parameter instead of 'relations'
          const populate = query.populate
            ? query.populate.split(',').map(rel => rel.trim())
            : [];

          // Validate populate relations
          const validRelations = model.options.relations
            ? Object.keys(model.options.relations)
            : [];
          const invalidPopulate = populate.filter(rel => !validRelations.includes(rel));

          if (invalidPopulate.length > 0) {
            set.status = 400;
            return {
              error: `Invalid relations to populate: ${invalidPopulate.join(', ')}`,
            };
          }

          // Parse 'page' and 'limit' for pagination
          const page = query.page ? parseInt(query.page, 10) : 1;
          const limit = query.limit ? parseInt(query.limit, 10) : 10;
          const skip = (page - 1) * limit;

          // Validate 'page' and 'limit'
          if (isNaN(page) || page < 1) {
            set.status = 400;
            return { error: `'page' must be a positive integer.` };
          }

          if (isNaN(limit) || limit <= 0) {
            set.status = 400;
            return { error: `'limit' must be a positive integer.` };
          }

          // Parse 'where' query parameter for filtering
          let where = {};
          if (query.where) {
            try {
              where = JSON.parse(query.where);
              // Optional: Add validation for 'where' here
            } catch (parseError) {
              set.status = 400;
              return { error: `'where' parameter must be valid JSON.` };
            }
          }

          // Parse 'sort' query parameter
          let order = {};
          if (query.sort) {
            try {
              order = parseSort(query.sort);
            } catch (sortError) {
              set.status = 400;
              return { error: sortError.message };
            }
          }

          // Fetch entities with relations, filtering, pagination, and sorting
          const [results, total] = await cambusa.models[model.options.name].findAndCount({
            where: where,
            relations: populate,
            skip: skip,
            take: limit,
            order: order,
          });

          // Calculate current page number
          const currentPage = page;

          // Set pagination headers
          set.headers['X-Pagination-Total-Count'] = total.toString();
          set.headers['X-Pagination-Page-Count'] = results.length.toString();
          set.headers['X-Pagination-Limit'] = limit.toString();
          set.headers['X-Pagination-Page'] = currentPage.toString();

          return results; // Return the array directly
        } catch (error) {
          cambusa.log.error(`Error fetching ${model.options.name}s:`, error.message);
          set.status = 400;
          return { error: error.message };
        }
      });
    }

    /**
     * Read One Route
     */
    if (!disabledRoutes.includes('readOne')) {
      router.get('/:id', async ({ params, query, set }) => {
        try {
          const id = params.id;
          const populate = query.populate
            ? query.populate.split(',').map(rel => rel.trim())
            : [];

          // Validate populate relations
          const validRelations = model.options.relations
            ? Object.keys(model.options.relations)
            : [];
          const invalidPopulate = populate.filter(rel => !validRelations.includes(rel));

          if (invalidPopulate.length > 0) {
            set.status = 400;
            return {
              error: `Invalid relations to populate: ${invalidPopulate.join(', ')}`,
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
     */
    if (!disabledRoutes.includes('update')) {
      router.put('/:id', async ({ params, body, set }) => {
        try {
          const id = params.id;
          const { relations, cleanedData } = await extractRelations(body, model.options.relations);

          // Update entity with relations
          const updateData = {
            ...cleanedData,
            ...relations,
          };

          await cambusa.models[model.options.name].update(id, updateData);

          // Fetch updated entity
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
