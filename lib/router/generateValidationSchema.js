import { t } from 'elysia';
import { commonTypes } from '@lib/datastore/commonTypes';

export function generateValidationSchema(modelSchema) {
  const validationSchema = {};

  for (const [fieldName, fieldDefinition] of Object.entries(
    modelSchema.columns
  )) {
    const commonType = commonTypes[fieldDefinition.type];

    if (!commonType) {
      console.warn(`Unknown type for field ${fieldName}. Skipping validation.`);
      continue;
    }

    let fieldSchema;

    switch (commonType.elysiaType) {
      case 'String':
        fieldSchema = t.String();
        break;
      case 'Integer':
        fieldSchema = t.Integer();
        break;
      case 'Number':
        fieldSchema = t.Number();
        break;
      case 'Boolean':
        fieldSchema = t.Boolean();
        break;
      case 'Date':
        fieldSchema = t.Date();
        break;
      case 'Any':
        fieldSchema = t.Any();
        break;
      case 'Unknown':
        fieldSchema = t.String();
        break;
      default:
        console.warn(
          `Unsupported Elysia type for field ${fieldName}. Using 'Any' type.`
        );
        fieldSchema = t.Any();
    }

    // Apply additional constraints
    if (fieldDefinition.nullable || fieldDefinition.default !== undefined) {
      fieldSchema = t.Optional(fieldSchema);
    }

    if (fieldDefinition.unique) {
      fieldSchema = t.Transform(fieldSchema, (value) => {
        // Here you could add custom logic to check uniqueness
        return value;
      });
    }

    // Add any custom validators defined in the model schema
    if (fieldDefinition.validate) {
      fieldSchema = t.Transform(fieldSchema, (value) => {
        if (!fieldDefinition.validate(value)) {
          throw new Error(`Validation failed for field ${fieldName}`);
        }
        return value;
      });
    }

    validationSchema[fieldName] = fieldSchema;
  }

  // Handle relations
  if (modelSchema.relations) {
    for (const [relationName, relationDefinition] of Object.entries(
      modelSchema.relations
    )) {
      let relationSchema;

      if (
        relationDefinition.type === 'one-to-many' ||
        relationDefinition.type === 'many-to-many'
      ) {
        relationSchema = t.Array(t.String()); // Assuming IDs are strings
      } else {
        relationSchema = t.String(); // For 'many-to-one' or 'one-to-one'
      }

      // Relations are optional by default in TypeORM
      relationSchema = t.Optional(relationSchema);

      validationSchema[relationName] = relationSchema;
    }
  }

  return t.Object(validationSchema);
}

export function generateBlueprintValidations(modelSchema) {
  const baseSchema = generateValidationSchema(modelSchema);

  return {
    create: baseSchema, // Use the base schema for create, which includes required fields
    update: t.Partial(baseSchema),
    readAll: t.Object({
      skip: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
      where: t.Optional(t.String()),
      sort: t.Optional(t.String()),
      populate: t.Optional(t.String()),
    }),
    readOne: t.Object({
      id: t.Union([t.String(), t.Number()]),
      populate: t.Optional(t.String()),
    }),
    delete: t.Object({
      id: t.Union([t.String(), t.Number()]),
    }),
  };
}
