export function timestampColumnsGenerator(dbType) {
  // Base configuration for timestamp columns
  const timestampColumns = {
    createdAt: {
      nullable: false,
      createDate: true, // TypeORM will automatically set this on entity creation
      transformer: {
        to: (value) => (value ? value.getTime() : null),
        from: (value) => (value ? new Date(Number(value)) : null),
      },
    },
    updatedAt: {
      nullable: false,
      updateDate: true, // TypeORM will automatically set this on entity update
      transformer: {
        to: (value) => (value ? value.getTime() : null),
        from: (value) => (value ? new Date(Number(value)) : null),
      },
    },
  };

  // Adjust the type based on the database
  switch (dbType) {
    case 'postgres':
    case 'mysql':
    case 'mariadb':
    case 'sqlite':
    case 'mssql':
    case 'oracle':
      // Use 'bigint' for Unix milliseconds
      timestampColumns.createdAt.type = 'bigint';
      timestampColumns.updatedAt.type = 'bigint';
      break;
    case 'mongodb':
      // Use 'date' type for MongoDB
      timestampColumns.createdAt.type = 'date';
      timestampColumns.updatedAt.type = 'date';
      // Remove transformers as MongoDB handles dates natively
      delete timestampColumns.createdAt.transformer;
      delete timestampColumns.updatedAt.transformer;
      break;
    default:
      // Default to 'bigint'
      timestampColumns.createdAt.type = 'bigint';
      timestampColumns.updatedAt.type = 'bigint';
      break;
  }

  return timestampColumns;
}

export default timestampColumnsGenerator;
