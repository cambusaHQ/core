export function primaryKeyGenerator(dbType) {
  switch (dbType) {
    case 'postgres':
    case 'sqlite':
      return { name: 'id', type: 'int', generated: true };
    case 'mysql':
    case 'mariadb':
      return { name: 'id', type: 'bigint', primary: true, generated: true };
    case 'mssql':
      return { name: 'id', type: 'int', generated: 'increment' };
    case 'oracle':
      return { name: 'id', type: 'number', generated: 'increment' };
    case 'mongodb':
      return { name: '_id', type: 'objectId', generated: true };
    default:
      return { name: 'id', type: 'int', generated: true };
  }
}

export default primaryKeyGenerator
