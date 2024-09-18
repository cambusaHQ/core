import { t } from 'elysia';
import commonTypes from './commonTypes';

export function mapTypes(columns) {
  const model = {};

  Object.keys(columns).forEach((columnName) => {
    const column = columns[columnName];
    const typeDefinition = commonTypes[column.type];

    // Throw an error for unsupported types or undefined types
    if (!typeDefinition) {
      throw new Error(`Unsupported column type: '${column.type}' for column '${columnName}'`);
    }

    // Map the Elysia.js type based on commonTypes
    switch (typeDefinition.elysiaType) {
      case 'String':
        model[columnName] = t.String();
        break;
      case 'Integer':
        model[columnName] = t.Integer();
        break;
      case 'Boolean':
        model[columnName] = t.Boolean();
        break;
      case 'Date':
        model[columnName] = t.Date();
        break;
      case 'Decimal':
        model[columnName] = t.Number();
        break;
      case 'Ref':
        model[columnName] = column.nativeType ? t.String() : t.Integer();
        break;
      case 'UUID':
        model[columnName] = t.String(); // UUIDs are usually strings
        break;
      default:
        throw new Error(`Unknown Elysia.js type '${typeDefinition.elysiaType}' for column '${columnName}'`);
    }
  });

  return t.Object(model);
}

/**
 * Maps a column definition to its corresponding database-specific type.
 * Throws an error if the type is unsupported or if the dbType is invalid.
 *
 * @param {Object} column - The column definition from the model.
 * @param {string} dbType - The type of the database (e.g., 'postgres', 'mysql').
 * @returns {string} - The database-specific type.
 */
export function mapToDatabaseType(column, dbType) {
  const typeDefinition = commonTypes[column.type];

  if (!typeDefinition) {
    throw new Error(`Unsupported column type: '${column.type}'`);
  }

  const dbSpecificType = typeDefinition.defaultType[dbType];

  if (!dbSpecificType) {
    throw new Error(`Unsupported dbType: '${dbType}' for column type: '${column.type}'`);
  }

  // Return the nativeType if provided, otherwise fall back to the db-specific type
  return column.nativeType || dbSpecificType;
}

export default mapToDatabaseType;
