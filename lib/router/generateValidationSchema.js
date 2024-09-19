// generateValidationSchema.js

import { t } from "elysia";
import { mapToElysiaType } from "@lib/datastore/mapTypes";

/**
 * Generates Elysia.js validation schemas based on model definitions.
 * @param {Object} schema - The model definition.
 * @param {Object} modelMap - An object containing all models mapped by their names.
 * @returns {Object} - An object containing validation schemas: { body, params, query }
 */
export function generateValidationSchema(schema, modelMap) {
  const { columns, relations } = schema;
  const bodyProperties = {};
  const requiredFields = [];

  // Generate body properties based on columns
  Object.keys(columns).forEach((columnName) => {
    const column = columns[columnName];
    const type = column.type.toLowerCase();

    // Determine if field is required
    if (!column.nullable && !column.primary && column.default === undefined) {
      requiredFields.push(columnName);
    }

    bodyProperties[columnName] = mapToElysiaType(type);
  });

  // Include relations in body properties as optional fields
  if (relations) {
    Object.keys(relations).forEach((relationName) => {
      const relation = relations[relationName];
      switch (relation.type) {
        case "many-to-one":
        case "one-to-one":
          // Single related entity ID
          // Assuming integer IDs; adjust if using UUIDs or strings
          bodyProperties[relationName] = t.Integer();
          break;
        case "one-to-many":
        case "many-to-many":
          // Array of related entity IDs
          bodyProperties[relationName] = t.Array(t.Integer());
          break;
        default:
          throw new Error(`Unsupported relation type: '${relation.type}'`);
      }
    });
  }

  // Correctly construct the body schema
  const bodySchema = t.Object(bodyProperties, {
    required: requiredFields.length > 0 ? requiredFields : undefined,
    additionalProperties: false,
  });

  // Params schema (assuming only 'id' as number)
  const paramsSchema = t.Object({
    id: t.Integer(),
  });

  // Query schema for Read All and Read One
  const querySchema = t.Object(
    {
      populate: t.Optional(t.String()), // Comma-separated list of relations
      limit: t.Optional(t.Integer({ minimum: 1 })), // Defaults to 20
      skip: t.Optional(t.Integer({ minimum: 0 })), // Defaults to 0
      sort: t.Optional(t.String()), // e.g., 'field1:asc,field2:desc'
      where: t.Optional(t.String()), // JSON string
    },
    { additionalProperties: false }
  );

  return {
    body: bodySchema,
    params: paramsSchema,
    query: querySchema,
  };
}

export default generateValidationSchema;
