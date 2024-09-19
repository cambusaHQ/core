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
        // For 'ref' type, we'll use string as it's likely to be an ID
        fieldSchema = t.String();
        break;
      default:
        console.warn(
          `Unsupported Elysia type for field ${fieldName}. Using 'any' type.`
        );
        fieldSchema = t.Any();
    }

    // Apply additional constraints
    if (fieldDefinition.required) {
      // Nothing to do, as TypeBox schemas are required by default
    } else {
      fieldSchema = t.Optional(fieldSchema);
    }

    if (fieldDefinition.unique) {
      // TypeBox doesn't have a built-in 'unique' validator, so we'll add a custom one
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

  return t.Object(validationSchema);
}

export function generateBlueprintValidations(modelSchema) {
  const baseSchema = generateValidationSchema(modelSchema);

  return {
    create: baseSchema,
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

export default generateValidationSchema;
