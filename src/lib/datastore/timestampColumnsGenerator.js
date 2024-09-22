/**
 * Generates timestamp columns configuration for database entities.
 * This function creates a standard structure for 'createdAt' and 'updatedAt' columns,
 * which are commonly used to track the creation and last update times of database records.
 *
 * @returns {Object} An object containing configurations for 'createdAt' and 'updatedAt' columns.
 */
export function timestampColumnsGenerator() {
  // Base configuration for timestamp columns
  const timestampColumns = {
    createdAt: {
      nullable: false,
      createDate: true, // TypeORM will automatically set this to the current date/time when an entity is created
    },
    updatedAt: {
      nullable: false,
      updateDate: true, // TypeORM will automatically update this to the current date/time whenever an entity is modified
    },
  };

  // Set type to 'date' for both columns as per the common type definition
  // This ensures compatibility with the 'date' type defined in commonTypes.js
  timestampColumns.createdAt.type = 'date';
  timestampColumns.updatedAt.type = 'date';

  return timestampColumns;
}

// Export the generator function as the default export for easier importing
export default timestampColumnsGenerator;
