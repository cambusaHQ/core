export const commonTypes = {
  string: {
    elysiaType: 'String',
    defaultType: {
      postgres: 'text',
      mysql: 'varchar(255)',
      mariadb: 'varchar(255)',
      sqlite: 'text',
      mongodb: 'string',
      oracle: 'varchar2(255)',
      mssql: 'nvarchar(255)',
    },
  },
  text: {
    elysiaType: 'String', // Use this for the longest possible text fields
    defaultType: {
      postgres: 'text', // Can hold up to 1GB of text
      mysql: 'longtext', // Holds up to 4GB
      mariadb: 'longtext', // Holds up to 4GB
      sqlite: 'text', // No maximum length
      mongodb: 'string', // MongoDB can store large strings, no practical limit
      oracle: 'clob', // Can hold up to 4GB
      mssql: 'nvarchar(max)', // Holds up to 2GB
    },
  },
  integer: {
    elysiaType: 'Integer',
    defaultType: {
      postgres: 'integer',
      mysql: 'bigint',
      mariadb: 'bigint',
      sqlite: 'integer',
      mongodb: 'int',
      oracle: 'number',
      mssql: 'int',
    },
  },
  boolean: {
    elysiaType: 'Boolean',
    defaultType: {
      postgres: 'boolean',
      mysql: 'tinyint(1)',
      mariadb: 'tinyint(1)',
      sqlite: 'integer',
      mongodb: 'boolean',
      oracle: 'number(1)',
      mssql: 'bit',
    },
  },
  date: {
    elysiaType: 'Date',
    defaultType: {
      postgres: 'timestamp with time zone',
      mysql: 'datetime',
      mariadb: 'datetime',
      sqlite: 'datetime',
      mongodb: 'date',
      oracle: 'timestamp',
      mssql: 'datetime2',
    },
  },
  decimal: {
    elysiaType: 'Number',
    defaultType: {
      postgres: 'numeric',
      mysql: 'decimal',
      mariadb: 'decimal',
      sqlite: 'real',
      mongodb: 'decimal',
      oracle: 'number',
      mssql: 'decimal',
    },
  },
  ref: {
    elysiaType: 'Unknown',
    defaultType: {
      postgres: 'integer',
      mysql: 'int',
      mariadb: 'int',
      sqlite: 'integer',
      mongodb: 'objectId',
      oracle: 'number',
      mssql: 'int',
    },
    nativeType: null, // Custom native type for foreign key
  },
  json: {
    elysiaType: 'Any',
    defaultType: {
      postgres: 'jsonb',
      mysql: 'json',
      mariadb: 'json',
      sqlite: 'text', // SQLite has no JSON type but can store JSON as text
      mongodb: 'document', // MongoDB supports storing documents directly
      oracle: 'clob',
      mssql: 'nvarchar(max)',
    },
  },
  uuid: {
    elysiaType: 'String',
    defaultType: {
      postgres: 'uuid',
      mysql: 'char(36)',
      mariadb: 'char(36)',
      sqlite: 'text', // SQLite has no UUID type but can store as text
      mongodb: 'string', // MongoDB stores UUIDs as strings
      oracle: 'raw(16)', // Oracle's raw type for UUIDs
      mssql: 'uniqueidentifier',
    },
  },
};

export default commonTypes;
