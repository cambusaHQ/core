import commonTypes from './commonTypes';

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
    throw new Error(
      `Unsupported dbType: '${dbType}' for column type: '${column.type}'`
    );
  }

  // Return the nativeType if provided, otherwise fall back to the db-specific type
  return column.nativeType || dbSpecificType;
}

export default mapToDatabaseType;
