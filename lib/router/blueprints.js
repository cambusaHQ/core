import { Elysia } from 'elysia';

import { extractRelations } from '@lib/datastore/extractRelations';
import { generateBlueprintValidations } from './generateValidationSchema';

/**
 * Blueprints module to support relations, pagination, filtering, sorting, and header-based meta.
 * This module dynamically generates RESTful API routes based on provided schema definitions.
 *
 * @param {Array} schemas - Array of model definitions, each containing schema information and route options.
 * @returns {Array} - Array of Elysia routers, each corresponding to a schema.
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

    // Create a new Elysia router for this schema
    const router = new Elysia({
      name: `routes-${basePath}`,
      prefix: `/${basePath}`,
      detail: {
        tags: [schema.name],
      },
    });

    /**
     * Helper Function: Parse and Validate Sort Parameter
     * This function takes a sort parameter string and converts it into a TypeORM-compatible order object.
     *
     * @param {String} sortParam - The raw sort query parameter (e.g., "name:asc,age:desc").
     * @returns {Object} - TypeORM-compatible order object.
     * @throws {Error} - Throws error if the sort parameter is invalid.
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

    // Generate validation schemas for this model
    const validations = generateBlueprintValidations(schema);

    /**
     * Create Route
     * Handles POST requests to create a new entity.
     */
    if (!disabledRoutes.includes('create')) {
      router.post(
        '',
        async ({ body, error }) => {
          try {
            // Extract and validate relations from the request body
            const { relations, cleanedData } = await extractRelations(
              body,
              schema.relations
            );

            // Create entity instance with relations
            const entity = cambusa.models[schema.name].create({
              ...cleanedData,
              ...relations,
            });

            // Save entity to the database
            const result = await cambusa.models[schema.name].save(entity);

            return result;
          } catch (err) {
            cambusa.log.error(`Error creating ${schema.name}:`, err.message);
            return error(400, `Error creating ${schema.name}: ${err.message}`);
          }
        },
        {
          body: validations.create.body,
          response: validations.create.response,
        }
      );
    }

    /**
     * Read All Route with Pagination, Filtering, and Sorting
     * Handles GET requests to retrieve multiple entities with various query parameters.
     */
    if (!disabledRoutes.includes('readAll')) {
      router.get(
        '',
        async ({ query, set, error }) => {
          try {
            // Parse 'populate' query parameter for eager loading of relations
            const populate = query.populate
              ? query.populate.split(',').map((rel) => rel.trim())
              : [];

            // Validate populate relations against schema-defined relations
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

            // Set default limit to 20 if not provided
            const limit = query.limit ? parseInt(query.limit, 10) : 20;
            const skip = query.skip ? parseInt(query.skip, 10) : 0; // Default skip to 0

            // Validate 'skip' and 'limit' parameters
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
              } catch (error) {
                cambusa.log.warn(error);
                return error(400, `'where' parameter must be valid JSON.`);
              }
            }

            // Parse 'sort' query parameter for ordering results
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

            // Calculate current page and total pages for pagination metadata
            const page = Math.floor(skip / limit) + 1;
            const pageCount = Math.ceil(total / limit);

            // Set pagination headers for client-side pagination handling
            set.headers['X-Pagination-Total-Count'] = total.toString();
            set.headers['X-Pagination-Page-Count'] = pageCount.toString();
            set.headers['X-Pagination-Limit'] = limit.toString();
            set.headers['X-Pagination-Page'] = page.toString();

            return results; // Return the array of entities
          } catch (err) {
            cambusa.log.error(`Error fetching ${schema.name}s:`, err.message);
            return error(400, `Error fetching ${schema.name}s: ${err.message}`);
          }
        },
        {
          query: validations.readAll.query,
          response: validations.readAll.response,
        }
      );
    }

    /**
     * Read One Route
     * Handles GET requests to retrieve a single entity by ID.
     */
    if (!disabledRoutes.includes('readOne')) {
      router.get(
        '/:id',
        async ({ params, query, error }) => {
          try {
            const id = params.id;
            // Parse 'populate' query parameter for eager loading of relations
            const populate = query.populate
              ? query.populate.split(',').map((rel) => rel.trim())
              : [];

            // Validate populate relations against schema-defined relations
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

            // Fetch entity with specified relations
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
            cambusa.log.error(`Error fetching ${schema.name}:`, err.message);
            return error(400, `Error fetching ${schema.name}: ${err.message}`);
          }
        },
        {
          params: validations.readOne.params,
          response: validations.readOne.response,
        }
      );
    }

    /**
     * Update Route
     * Handles PUT requests to update an existing entity by ID.
     */
    if (!disabledRoutes.includes('update')) {
      router.put(
        '/:id',
        async ({ params, body, error }) => {
          try {
            const id = params.id;
            // Extract and validate relations from the request body
            const { relations, cleanedData } = await extractRelations(
              body,
              schema.relations
            );

            // Prepare update data by merging cleaned data and relations
            const updateData = {
              ...cleanedData,
              ...relations,
            };

            // Update the entity in the database
            await cambusa.models[schema.name].update(id, updateData);

            // Fetch the updated entity to return in the response
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
            cambusa.log.error(`Error updating ${schema.name}:`, err.message);
            return error(400, `Error updating ${schema.name}: ${err.message}`);
          }
        },
        {
          params: validations.delete.params, // reuse the delete validation for the ID
          body: validations.update.body,
          response: validations.update.response,
        }
      );
    }

    /**
     * Delete Route
     * Handles DELETE requests to remove an entity by ID.
     */
    if (!disabledRoutes.includes('delete')) {
      router.delete(
        '/:id',
        async ({ params, error }) => {
          try {
            const id = params.id;
            // Attempt to delete the entity
            const result = await cambusa.models[schema.name].delete(id);

            if (result.affected > 0) {
              return { message: `${schema.name} deleted.` };
            } else {
              return error(404, `${schema.name} not found.`);
            }
          } catch (err) {
            cambusa.log.error(`Error deleting ${schema.name}:`, err.message);
            return error(400, `Error deleting ${schema.name}: ${err.message}`);
          }
        },
        {
          params: validations.delete.params,
          response: validations.delete.response,
        }
      );
    }

    // Add the configured router to the routers array
    routers.push(router);
  });

  return routers;
}

export default blueprints;
