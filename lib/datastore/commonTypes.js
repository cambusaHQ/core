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
    transformer: null, // No transformation needed for standard strings
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
    transformer: null,
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
    transformer: null, // No transformation needed; treated as numbers
  },
  boolean: {
    elysiaType: 'Boolean',
    defaultType: {
      postgres: 'boolean',
      mysql: 'tinyint(1)', // Stores as 1/0
      mariadb: 'tinyint(1)', // Stores as 1/0
      sqlite: 'integer', // Stores as 1/0
      mongodb: 'boolean',
      oracle: 'number(1)', // Stores as 1/0
      mssql: 'bit', // Stores as 1/0
    },
    transformer: {
      sqlite: {
        to: (value) => (value ? 1 : 0),
        from: (value) => Boolean(value),
      },
      oracle: {
        to: (value) => (value ? 1 : 0),
        from: (value) => Boolean(value),
      },
      mysql: {
        to: (value) => (value ? 1 : 0),
        from: (value) => Boolean(value),
      },
      mariadb: {
        to: (value) => (value ? 1 : 0),
        from: (value) => Boolean(value),
      },
      mssql: {
        to: (value) => (value ? 1 : 0),
        from: (value) => Boolean(value),
      },
      // Postgres and MongoDB support native boolean types; no transformers needed
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
    transformer: null, // TypeORM handles date conversions; no custom transformer needed
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
    transformer: null, // TypeORM handles decimal as strings to preserve precision
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
    nativeType: null, // Custom native type
    transformer: null,
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
    transformer: null, // TypeORM handles JSON serialization/deserialization
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
    transformer: {
      oracle: {
        to: (value) => Buffer.from(value.replace(/-/g, ''), 'hex'), // Convert UUID string to Buffer
        from: (value) =>
          [...value].reduce((uuid, byte, i) => {
            uuid += byte.toString(16).padStart(2, '0');
            if ([4, 6, 8, 10].includes(i + 1)) uuid += '-';
            return uuid;
          }, ''),
      },
      // Add transformers for other databases if needed
      // Postgres, MySQL, MariaDB, SQLite, MongoDB, MSSQL support UUIDs as strings; no transformers needed
    },
  },
};

export default commonTypes;
