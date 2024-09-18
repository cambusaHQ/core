export function primaryKeyGenerator(dbType) {
  switch (dbType) {
    case 'postgres':
    case 'sqlite':
      return { name: 'id', type: 'integer', generated: true }; // Changed 'int' to 'integer'
    case 'mysql':
    case 'mariadb':
      return { name: 'id', type: 'integer', generated: true };
    case 'mssql':
      return { name: 'id', type: 'integer', generated: 'increment' }; // Changed 'int' to 'integer'
    case 'oracle':
      return { name: 'id', type: 'integer', generated: 'increment' }; // Changed 'number' to 'integer'
    case 'mongodb':
      return { name: '_id', type: 'ref', nativeType: 'objectId', generated: true };
    default:
      return { name: 'id', type: 'integer', generated: true }; // Changed 'int' to 'integer'
  }
}

export default primaryKeyGenerator;
