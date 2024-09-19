import { Elysia } from 'elysia';

import { extractRelations } from '@lib/datastore/extractRelations';
import { generateBlueprintValidations } from './generateValidationSchema';

/**
* Blueprints module to support relations, pagination, filtering, sorting, and header-based meta.
* @param {Array} schemas - Array of model definitions.
* @returns {Array} - Array of Elysia routers.
*/
export function blueprints(schemas) {
  const routers = [];

  schemas.forEach((schema) => {
    // Extract route options from the model definition
    const disabledRoutes = schema.routes?.disabled || [];
    const basePath = schema.routes?.basePath || schema.tableName;

    // If routes are disabled, skip creating routes for this model
    if (schema.routes?.disabled === true) {
      cambusa.log.verbose(`Routes for ${schema.name} are disabled.`);
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

      const sortFields = sortParam.split(',').map((field) => field.trim());

      sortFields.forEach((field) => {
        const [key, order] = field.split(':').map((part) => part.trim());

        if (order && !['asc', 'desc'].includes(order.toLowerCase())) {
          throw new Error(
            `Invalid sort order '${order}' for field '${key}'. Use 'asc' or 'desc'.`
          );
        }

        sortOrder[key] = order ? order.toUpperCase() : 'ASC';
      });

      return sortOrder;
    };

    const validations = generateBlueprintValidations(schema);

    /**
     * Create Route
     */
    if (!disabledRoutes.includes('create')) {
      router.post('', async ({ body, error }) => {
        try {
          const { relations, cleanedData } = await extractRelations(
            body,
            schema.relations
          );

          // Create entity instance with relations
          const entity = cambusa.models[schema.name].create({
            ...cleanedData,
            ...relations,
          });

          // Save entity
          const result = await cambusa.models[schema.name].save(entity);

          return result;
        } catch (err) {
          cambusa.log.error(
            `Error creating ${schema.name}:`,
            err.message
          );
          return error(
            400,
            `Error creating ${schema.name}: ${err.message}`
          );
        }
      }, {
        body: validations.create,
      });
    }

    /**
     * Read All Route with Pagination, Filtering, and Sorting
     */
    if (!disabledRoutes.includes('readAll')) {
      router.get('', async ({ query, set, error }) => {
        try {
          // Parse 'populate' query parameter instead of 'relations'
          const populate = query.populate
            ? query.populate.split(',').map((rel) => rel.trim())
            : [];

          // Validate populate relations
          const validRelations = schema.relations
            ? Object.keys(schema.relations)
            : [];
          const invalidPopulate = populate.filter(
            (rel) => !validRelations.includes(rel)
          );

          if (invalidPopulate.length > 0) {
            return error(
              400,
              `Invalid relations to populate: ${invalidPopulate.join(', ')}`
            );
          }

          // Set default limit to 20
          const limit = query.limit ? parseInt(query.limit, 10) : 20;
          const skip = query.skip ? parseInt(query.skip, 10) : 0; // Default skip to 0

          // Validate 'skip' and 'limit'
          if (isNaN(skip) || skip < 0) {
            return error(400, `'skip' must be a non-negative integer.`);
          }

          if (isNaN(limit) || limit <= 0) {
            return error(400, `'limit' must be a positive integer.`);
          }

          // Parse 'where' query parameter for filtering
          let where = {};
          if (query.where) {
            try {
              where = JSON.parse(query.where);
            } catch (parseError) {
              return error(400, `'where' parameter must be valid JSON.`);
            }
          }

          // Parse 'sort' query parameter
          let order = {};
          if (query.sort) {
            try {
              order = parseSort(query.sort);
            } catch (sortError) {
              return error(400, sortError.message);
            }
          }

          // Fetch entities with relations, filtering, pagination, and sorting
          const [results, total] = await cambusa.models[
            schema.name
          ].findAndCount({
            where: where,
            relations: populate,
            skip: skip,
            take: limit,
            order: order,
          });

          // Calculate current page dynamically
          const page = Math.floor(skip / limit) + 1;

          // Calculate total number of pages
          const pageCount = Math.ceil(total / limit);

          // Set pagination headers
          set.headers['X-Pagination-Total-Count'] = total.toString(); // Total number of records
          set.headers['X-Pagination-Page-Count'] = pageCount.toString(); // Total number of pages
          set.headers['X-Pagination-Limit'] = limit.toString(); // Limit per page
          set.headers['X-Pagination-Page'] = page.toString(); // Current page

          return results; // Return the array directly
        } catch (err) {
          cambusa.log.error(
            `Error fetching ${schema.name}s:`,
            err.message
          );
          return error(
            400,
            `Error fetching ${schema.name}s: ${err.message}`
          );
        }
      }, {
        query: validations.readAll,
      });
    }

    /**
     * Read One Route
     */
    if (!disabledRoutes.includes('readOne')) {
      router.get('/:id', async ({ params, query, error }) => {
        try {
          const id = params.id;
          const populate = query.populate
            ? query.populate.split(',').map((rel) => rel.trim())
            : [];

          // Validate populate relations
          const validRelations = schema.relations
            ? Object.keys(schema.relations)
            : [];
          const invalidPopulate = populate.filter(
            (rel) => !validRelations.includes(rel)
          );

          if (invalidPopulate.length > 0) {
            return error(
              400,
              `Invalid relations to populate: ${invalidPopulate.join(', ')}`
            );
          }

          // Fetch entity with relations
          const result = await cambusa.models[schema.name].findOne({
            where: { id: id },
            relations: populate,
          });

          if (result) {
            return result;
          } else {
            return error(404, `${schema.name} not found`);
          }
        } catch (err) {
          cambusa.log.error(
            `Error fetching ${schema.name}:`,
            err.message
          );
          return error(
            400,
            `Error fetching ${schema.name}: ${err.message}`
          );
        }
      }, {
        params: validations.readOne,
      });
    }

    /**
     * Update Route
     */
    if (!disabledRoutes.includes('update')) {
      router.put('/:id', async ({ params, body, error }) => {
        try {
          const id = params.id;
          const { relations, cleanedData } = await extractRelations(
            body,
            schema.relations
          );

          // Update entity with relations
          const updateData = {
            ...cleanedData,
            ...relations,
          };

          await cambusa.models[schema.name].update(id, updateData);

          // Fetch updated entity
          const updated = await cambusa.models[schema.name].findOne({
            where: { id: id },
            relations: Object.keys(relations),
          });

          if (updated) {
            return updated;
          } else {
            return error(404, `${schema.name} not found after update.`);
          }
        } catch (err) {
          cambusa.log.error(
            `Error updating ${schema.name}:`,
            err.message
          );
          return error(
            400,
            `Error updating ${schema.name}: ${err.message}`
          );
        }
      }, {
        params: validations.delete, // reuse the delete validation for the ID
        body: validations.update,
      });
    }

    /**
     * Delete Route
     */
    if (!disabledRoutes.includes('delete')) {
      router.delete('/:id', async ({ params, error }) => {
        try {
          const id = params.id;
          const result = await cambusa.models[schema.name].delete(id);

          if (result.affected > 0) {
            return { message: `${schema.name} deleted.` };
          } else {
            return error(404, `${schema.name} not found.`);
          }
        } catch (err) {
          cambusa.log.error(
            `Error deleting ${schema.name}:`,
            err.message
          );
          return error(
            400,
            `Error deleting ${schema.name}: ${err.message}`
          );
        }
      }, {
        params: validations.delete,
      });
    }

    // Add the configured router to the routers array
    routers.push(router);
  });

  return routers;
}

export default blueprints;
