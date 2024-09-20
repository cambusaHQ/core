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
    type: 'postgres', // Example: Switch to PostgreSQL
    url: 'postgresql://username:password@localhost:5432/mydb', // Database connection URL
  },
};
```

The configuration should follow the TypeORM's [Data Source Options](https://orkhan.gitbook.io/typeorm/docs/data-source-options)

## Models

### Loading Models

Models are automatically loaded from the `api/models/` directory. Each model is defined by exporting a default object that specifies the model's schema using TypeORM's EntitySchema format.

### Model Definition and Types

Cambusa provides support for defining models using a set of common types that map to various database-specific column types. You can define your models in the `api/models` directory.

#### Supported Types

Here are the predefined types you can use when defining columns in your models:

- **string**: Maps to a short string field (e.g., varchar(255) in MySQL, text in PostgreSQL).
- **text**: Maps to the longest possible text field for the target database (e.g., longtext in MySQL, clob in Oracle).
- **integer**: Maps to an integer type (e.g., int in MySQL, integer in PostgreSQL).
- **boolean**: Maps to a boolean value (e.g., tinyint(1) in MySQL, boolean in PostgreSQL).
- **date**: Maps to a date/time field (e.g., timestamp with time zone in PostgreSQL, datetime in MySQL).
- **decimal**: Maps to a decimal type for precise numeric values (e.g., decimal in MySQL, numeric in PostgreSQL).
- **json**: Maps to a JSON field (e.g., jsonb in PostgreSQL, json in MySQL).
- **uuid**: Maps to a UUID type (e.g., uuid in PostgreSQL, char(36) in MySQL).

#### Defining Columns with Types

Each column in a model can be defined with one of the above types. Here’s an example of defining various column types in a User model:

**Example:** `api/models/User.js`

```js
export default {
  columns: {
    firstName: {
      type: 'string',
      nullable: true,
    },
    lastName: {
      type: 'string',
      nullable: true,
    },
    email: {
      type: 'string',
      unique: true,
    },
    age: {
      type: 'integer',
      nullable: true,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
  },
};
```

#### Native types

You can optionally specify a `nativeType` for more control over a specific database, if needed. In this case you must use `ref` as `type`.

```js
export default {
  columns: {
    name: {
      type: 'string',
      unique: true,
    },
    ownerId: {
      type: 'ref',
      nativeType: 'bigint', // Optional: specify native type for the foreign key
    },
  },
};
```

#### Relations

Define relationships (e.g., `one-to-many`, `many-to-one`, `many-to-many`, `one-to-one`) in the `relations` property of your model. These relationships connect models together and are required for associations like joining tables or referencing foreign keys.

**Example**: **many-to-one** relationship

```js
export default {
  columns: {
    orderNumber: {
      type: 'string',
      unique: true,
    },
    totalAmount: {
      type: 'decimal',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User', // References the User model
      joinColumn: { name: 'userId' },
      onDelete: 'SET NULL',
    },
  },
};
```

**Example** of self-referential relations

```js
export default {
  columns: {
    name: {
      type: 'string',
      unique: true,
    },
  },
  relations: {
    parent: {
      type: 'many-to-one',
      target: 'Category', // Self-referential relation
      joinColumn: { name: 'parentId' },
      onDelete: 'SET NULL',
    },
  },
};
```

**Example** of bi-directional relations

`api/models/User.js`

```js
export default {
  columns: {
    // columns definition
  },
  relations: {
    posts: {
      type: 'one-to-many',
      target: 'Post',
      inverseSide: 'author',
    },
  },
};
```

`api/models/Post.js`

```js
export default {
  columns: {
    // columns definition
  },
  relations: {
    author: {
      type: 'many-to-one',
      target: 'User', // The target entity is the User model
      inverseSide: 'posts', // Reference to the 'posts' property in the User model
      joinColumn: { name: 'userId' }, // The foreign key column in the Post table
      onDelete: 'CASCADE', // If a user is deleted, the posts are also deleted
    },
  },
};
```

### Automatic Features

Cambusa provides several automatic features to simplify model definitions:

- **Automatic Model Name**: The model name is inferred from the filename. For example, `User.js` results in a model named `User`.
- **Automatic Table Name**: The table name is inferred from the model name, pluralized and lowercased. For example, the `User` model corresponds to the `users` table.
- **Automatic Primary Key**: Unless you set `primaryKey: false` in your model definition, a primary key column is automatically added to your model. The primary key is named `id` (or `_id` for MongoDB), and its type and generation strategy are determined based on the database type.
- **Automatic Timestamps**: `createdAt` and `updatedAt` timestamp columns are automatically added to your models unless you set `createdAt: false` or `updatedAt: false` in your model definition. These columns store Unix milliseconds and are automatically managed by TypeORM.

### Customizing Model Definitions

You can override any of the automatic features by specifying them in your model definition.

#### Example with Custom Model Name and Table Name:

```js
export default {
  name: 'UserProfile', // Custom model name
  tableName: 'user_profiles', // Custom table name
  columns: {
    // columns definition
  },
};
```

#### Example Disabling Automatic Primary Key and Timestamps:

```js
export default {
  primaryKey: false, // Disable automatic primary key
  createdAt: false, // Disable automatic createdAt column
  updatedAt: false, // Disable automatic updatedAt column
  columns: {
    // columns definition
  },
};
```

In the above example, we:

- **Disable Automatic Primary Key**: Set `primaryKey: false` and define a custom primary key customId.
- **Disable Automatic Timestamps**: Set `createdAt: false` and `updatedAt: false` to prevent the automatic addition of timestamp columns.

### Accessing Models

You can access models via `cambusa.models.ModelName`.

**Example:**

```js
// Fetch all users
const users = await cambusa.models.User.find();

// Create a new user
const newUser = cambusa.models.User.create({
  name: 'Alice',
  email: 'alice@example.com',
});

await cambusa.models.User.save(newUser);
```

**Notes**

- **Primary Key Generation**: The primary key is generated based on the database type using a helper function. For most SQL databases, it's an auto-incrementing `bigint` named `id`.
- **Timestamps**: The `createdAt` and `updatedAt` columns are automatically managed by TypeORM. They store timestamps in Unix milliseconds and represent the creation and last update times of the records.
- **Disabling Automatic Features**: Set `primaryKey: false`, `createdAt: false`, or `updatedAt: false` in your model definition to disable automatic generation of these features.
- **Custom Columns**: You can define custom columns, including primary keys and timestamps, if you need specific configurations.
- **EntitySchema**: Cambusa uses TypeORM's `EntitySchema` under the hood. You can leverage all of its features for advanced configurations.

#### Example with All Features

`api/models/Comment.js`

```js
export default {
  name: 'Comment',
  tableName: 'comments',
  columns: {
    content: { type: 'text' },
  },
  relations: {
    post: {
      type: 'many-to-one',
      target: 'Post',
      inverseSide: 'comments',
    },
    author: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'comments',
    },
  },
};
```

#### Accessing Related Data

You can access related entities using TypeORM's relations.

**Example:**

```js
// Fetch posts with their authors
const posts = await cambusa.models.Post.find({ relations: ['author'] });

// Fetch a user and their posts
const user = await cambusa.models.User.findOne({
  where: { id: 1 },
  relations: ['posts'],
});

// Create a new comment
const comment = cambusa.models.Comment.create({
  content: 'Great post!',
  author: user,
  post: posts[0],
});

await cambusa.models.Comment.save(comment);
```

## Database Migrations

Cambusa provides commands to manage database migrations, allowing you to version control your database schema changes.

### Creating a Migration

To create a new empty migration file:

```bash
bun run bin/cambusa.js migrations:create <MigrationName>
```

This command will:
- Generate a new TypeScript file in the `migrations` directory.
- The file will be named with a timestamp and the name you provide.
- It will contain empty `up` and `down` methods for you to fill in with your schema changes.

Example:
```bash
bun run bin/cambusa.js migrations:create AddUserTable
```

### Generating a Migration

To generate a migration based on the differences between your entity models and the current database schema:

```bash
bun run bin/cambusa.js migrations:generate <MigrationName>
```

This command will:
- Compare your current entity models with the database schema.
- If there are differences, it will generate a new migration file with the necessary changes.
- If no changes are detected, it will inform you that no migration is needed.

Example:
```bash
bun run bin/cambusa.js migrations:generate UpdateUserSchema
```

### Running Migrations

To apply pending migrations to your database:

```bash
bun run bin/cambusa.js migrations:run
```

This command will:
- Check for any pending migrations that haven't been applied to the database.
- Run these migrations in order, updating your database schema.
- Display a list of successfully applied migrations.

If there are no pending migrations, it will inform you that no migrations need to be run.

### Notes on Migration Commands

- **Creating Migrations**: Use this when you want to manually write migration steps.
- **Generating Migrations**: Use this when you've made changes to your entity models and want to automatically create a migration based on those changes.
- **Running Migrations**: Always run this command after creating or generating new migrations to apply the changes to your database.

### Best Practices

1. Always review generated migrations before applying them to ensure they match your intended changes.
2. Keep migrations small and focused on specific changes to make them easier to review and revert if necessary.
3. Test migrations thoroughly in a development environment before applying them to production.
4. Use descriptive names for your migrations to easily understand what each one does.
5. Run the `migrations:run` command as part of your deployment process to ensure your database schema is always up to date.
