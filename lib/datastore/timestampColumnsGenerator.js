export function timestampColumnsGenerator(dbType) {
  // Base configuration for timestamp columns
  const timestampColumns = {
    createdAt: {
      nullable: false,
      createDate: true, // TypeORM will automatically set this on entity creation
    },
    updatedAt: {
      nullable: false,
      updateDate: true, // TypeORM will automatically set this on entity update
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
      timestampColumns.createdAt.type = 'datetime';
      timestampColumns.updatedAt.type = 'datetime';
      break;
    case 'mongodb':
      // Use 'date' type for MongoDB
      timestampColumns.createdAt.type = 'date';
      timestampColumns.updatedAt.type = 'date';
      // Remove transformers as MongoDB handles dates natively
      break;
    default:
      // Default to 'bigint'
      timestampColumns.createdAt.type = 'datetime';
      timestampColumns.updatedAt.type = 'datetime';
      break;
  }

  return timestampColumns;
}

export default timestampColumnsGenerator;
