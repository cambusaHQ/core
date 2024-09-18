# Database

## Supported Databases

You can configure the project to use one of the supported databases:

- PostgreSQL
- MySQL
- MariaDB
- SQLite
- MongoDB
- Oracle
- MS SQL

### Configuration

Update the `config/datastore.js` file to define the database connection:

Example with sqlite:

```js
export default {
  database: {
    type: 'sqlite',
    database: './database.sqlite',
  },
};
```

Example with PostgreSQL:

```js
export default {
  database: {
    type: 'postgres',  // Example: Switch to PostgreSQL
    url: 'postgresql://username:password@localhost:5432/mydb',  // Database connection URL
  },
};
```

The configuration should follow the TypeORM's [Data Source Options](https://orkhan.gitbook.io/typeorm/docs/data-source-options)

### Loading Models
Models are automatically loaded from the `api/models/` directory. Each model is defined using TypeORM's EntitySchema.

**Example:** `api/models/User.js`

```js
export const User = {
  columns: {
    name: { type: 'varchar' },
    email: { type: 'varchar', unique: true },
  },
};

export default User;
```

**The model name, table name and primary id are automatically generated for you.** In case you need to override the default values you can add them explicitly in the model definition:

```js
export const User = {
  name: 'User',
  tableName: 'users',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    name: { type: 'varchar' },
    email: { type: 'varchar', unique: true },
  },
};

export default User;
```
