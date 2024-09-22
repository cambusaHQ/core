import commonTypes from './commonTypes';

/**
 * Maps a column definition to its corresponding database-specific type
 * and retrieves the appropriate transformer if available.
 *
 * @param {Object} column - The column definition from the model.
 * @param {string} dbType - The type of the database (e.g., 'postgres', 'mysql').
 * @returns {Object} - An object containing the database-specific type and the transformer.
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

  // Retrieve the transformer if available for this type and dbType
  const transformer =
    typeDefinition.transformer && typeDefinition.transformer[dbType]
      ? typeDefinition.transformer[dbType]
      : undefined;

  // Return both the type and transformer
  return {
    type: column.nativeType || dbSpecificType,
    transformer: transformer || undefined,
  };
}

export default mapToDatabaseType;
