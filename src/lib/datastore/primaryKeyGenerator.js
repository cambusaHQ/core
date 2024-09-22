/**
 * Generates a primary key configuration based on the database type.
 * This function ensures that the primary key is appropriately defined
 * for each supported database system.
 *
 * @param {string} dbType - The type of database (e.g., 'postgres', 'mysql', 'mongodb')
 * @returns {Object} An object containing the primary key configuration
 */
export function primaryKeyGenerator(dbType) {
  switch (dbType) {
    case 'postgres':
    case 'sqlite':
      // PostgreSQL and SQLite use auto-incrementing integer primary keys
      return { name: 'id', type: 'integer', generated: true };
    case 'mysql':
    case 'mariadb':
      // MySQL and MariaDB also use auto-incrementing integer primary keys
      return { name: 'id', type: 'integer', generated: true };
    case 'mssql':
      // Microsoft SQL Server uses an identity column for auto-incrementing
      return { name: 'id', type: 'integer', generated: 'increment' };
    case 'oracle':
      // Oracle uses a sequence and trigger for auto-incrementing
      return { name: 'id', type: 'integer', generated: 'increment' };
    case 'mongodb':
      // MongoDB uses ObjectId as its default primary key
      return {
        name: '_id',
        type: 'ref',
        nativeType: 'objectId',
        generated: true,
      };
    default:
      // Default to a generic auto-incrementing integer primary key
      return { name: 'id', type: 'integer', generated: true };
  }
}

export default primaryKeyGenerator;
