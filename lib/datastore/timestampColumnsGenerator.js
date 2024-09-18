export function timestampColumnsGenerator() {
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

  // Set type to 'date' as per the common type definition
  timestampColumns.createdAt.type = 'date';
  timestampColumns.updatedAt.type = 'date';

  return timestampColumns;
}

export default timestampColumnsGenerator;
