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

## Models

### Loading Models
Models are automatically loaded from the `api/models/` directory. Each model is defined by exporting a default object that specifies the model's schema using TypeORM's EntitySchema format.

### Model Definition

A basic model definition looks like this:

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
export const User = {
  name: 'UserProfile', // Custom model name
  tableName: 'user_profiles', // Custom table name
  columns: {
    name: { type: 'varchar' },
    email: { type: 'varchar', unique: true },
  },
};

export default User;
```

#### Example Disabling Automatic Primary Key and Timestamps:

```js
export const User = {
  primaryKey: false, // Disable automatic primary key
  createdAt: false,  // Disable automatic createdAt column
  updatedAt: false,  // Disable automatic updatedAt column
  columns: {
    customId: { primary: true, type: 'uuid', generated: 'uuid' },
    name: { type: 'varchar' },
    email: { type: 'varchar', unique: true },
  },
};

export default User;
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

### Defining Relationships

You can define relationships between models using TypeORM's relation definitions.

#### Example with Relations:

`api/models/User.js`

```js
export default {
  columns: {
    name: { type: 'varchar' },
    email: { type: 'varchar', unique: true },
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
    title: { type: 'varchar' },
    content: { type: 'text' },
  },
  relations: {
    author: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'posts',
    },
  },
};
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
