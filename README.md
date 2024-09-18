# Cambusa

🚣 A modern, high-performance web framework built with Bun and modern JavaScript.

## Introduction

Cambusa is a web framework designed to provide a comfortable developer experience with modern JavaScript syntax and enhanced performance using Bun as the runtime. Inspired by Sails.js, if you want to build applications using the latest JavaScript features while enjoying better performance, **Cambusa** is the framework for you.

## Why Cambusa?

In Italian, cambusa means "ship's pantry" or "galley"—the place where provisions are stored on a vessel. Just like a cambusa supplies sailors with essential provisions for their journey, this framework aims to supply developers with the essential tools and conventions needed for building scalable and efficient applications.

The name reflects my modest approach to web development, inspired by Sails.js but streamlined for modern development practices.

## Features

- Sails.js-Inspired Conventions: Familiar MVC structure, blueprints, and configuration patterns.
- Modern JavaScript Syntax: Utilize the latest ES modules, async/await, and other modern language features.
- Powered by Bun: Experience significantly faster performance with Bun's high-speed runtime and bundler.
- Flexible Configuration: Manage settings via config files, environment variables, or command-line arguments.
- Automatic Routing: Define routes in configuration files that map directly to controller actions.
- Modular Architecture: Organize your codebase with a clear structure for controllers, services, and utilities.

## Getting Started

### Prerequisites

- Bun: Make sure you have Bun installed ([installation Guide](https://bun.sh/docs/installation)).

### Installation

```bash
# Clone the repository (assuming Cambusa is hosted on GitHub)
git clone https://github.com/enricodeleo/cambusa.git
cd cambusa

# Install dependencies
bun install
```

### Project Structure

```bash
cambusa-app/
├── api
│   ├── controllers
│   ├── helpers
│   ├── hooks
│   ├── middlewares
│   └── models
├── app.js
├── config
│   ├── database.js
│   ├── index.js
│   ├── logger.js
│   ├── middlewares.js
│   ├── routes.js
│   ├── security.js
│   ├── server.js
│   └── swagger.js
```

### Run

```bash
bun run app.js
```

## Configuration

**Cambusa** uses a flexible configuration system. Configurations are split into files within the `config/` directory, allowing you to manage settings for different aspects of your application, such as server settings, database connections, and custom configurations.

Cambusa automagically supports **envirnoment variables** and **command line arguments** blending them into configuration properties.

[🔗 Config documentation](./docs/CONFIG.md)

## Creating Routes and Controllers

### Defining Routes

You can define your application's custom routes in `config/routes.js`, where you map HTTP methods and paths to controller actions. These routes are manually defined and give you fine-grained control over the behavior of your API.

**Example** `config/routes.js`:

```js
export default {
  routes: {
    'GET /users': 'users/read',
    'DELETE /users/:id': 'users/delete',
  },
};
```

### Creating Controllers

Controllers handle the business logic for your routes. These should be placed in the `api/controllers/` directory and correspond to the actions defined in your `config/routes.js`.

**Example** `api/controllers/users/read.js`:

```js
export async function getUsers({ request, response }) {
  // Your logic to retrieve users
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
}
```

## Blueprints: Automatic CRUD Routes for Models

In addition to defining custom routes, Cambusa provides blueprints, which automatically generate RESTful CRUD routes based on your model definitions. This saves you time and effort by automating the creation of common operations like **create**, **read**, **update**, and **delete** for your database models.

### How Blueprints Work

Blueprints are auto-generated routes that are created based on the model definitions in your `api/models/` directory. These routes are automatically registered when the server starts, following a standard RESTful pattern:

- **POST** `/modelName` – Create a new record.
- **GET** `/modelName` – Retrieve all records.
- **GET** `/modelName/:id` – Retrieve a specific record by ID.
- **PUT** `/modelName/:id` – Update a specific record by ID.
- **DELETE** `/modelName/:id` – Delete a specific record by ID.

### Example of Blueprints in Action

For a model defined in `api/models/User.js`:

```js
export const User = {
  routes: {
    basePath: 'users', // Custom base path for this model
    disabled: ['delete'], // Disable the DELETE route
  },
  columns: {
    firstName: {
      type: 'varchar',
      nullable: true,
    },
    lastName: {
      type: 'varchar',
      nullable: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
  },
};

export default User;
```

The following routes will be automatically generated:

- `POST` `/users` – Create a new user.
- `GET` `/users` – Retrieve all users.
- `GET` `/users/:id` – Retrieve a user by ID.
- `PUT` `/users/:id` – Update a user by ID.
- `DELETE` route is **disabled** for this model as specified in the `disabled` property.

### Disabling and Customizing Routes

You can easily customize or disable specific routes for each model by defining the routes property in the model:

- **Disable All Routes**: Set `disabled: true` to disable all auto-generated routes for a model.
- **Disable Specific Routes**: You can disable individual routes by specifying an array of routes to disable (`create`, `readAll`, `readOne`, `update`, `delete`).

**Example**:

```js
export const Product = {
  routes: {
    disabled: ['delete', 'update'], // Disable DELETE and UPDATE routes
    basePath: 'products',  // Custom base path for this model
  },
  columns: {
    name: { type: 'varchar' },
    price: { type: 'decimal' },
  },
};

export default Product;
```

This will generate routes for **POST**, **GET (all)**, and **GET (by ID)**, but not for **DELETE** or **UPDATE**.

### How to Use Blueprints

Blueprints are loaded automatically during the server startup process. Cambusa will scan your model definitions and create the corresponding CRUD routes based on the routes configuration in each model. This allows you to focus on writing the business logic for more complex or custom routes while letting Cambusa handle the basic CRUD operations.

### Handling Route Collisions

In cases where a route is defined both in your custom `config/routes.js` and is automatically generated by the blueprint system, **the user-defined route will take precedence** over the blueprint route. This allows you to override or extend the behavior of auto-generated routes with custom logic.

For example, if you define a custom `GET /users/:id` route in `config/routes.js`, it will override the blueprint route for that path, allowing you to fully control the behavior of that route.

### Query Parameters for Blueprints

Blueprints support several query parameters that allow developers to paginate, filter, and sort the returned data in `GET` requests.

#### Pagination

- `limit`: Specifies the maximum number of results to return per page (default is `20`).
- `skip`: Specifies the number of records to skip from the beginning (used for pagination).

**Example**:

```bash
GET /users?limit=10&skip=20
```

This will return 10 users starting from the 21st user.

**Pagination Headers:** The response will include the following pagination-related headers:

- `X-Pagination-Total-Count`: Total number of records for the current query.
- `X-Pagination-Page-Count`: Total number of pages based on the query.
- `X-Pagination-Limit`: The `limit` used in the query.
- `X-Pagination-Page`: The current page number.

#### Sorting

`sort`: Allows sorting by one or more fields. You can specify the field and the direction (`asc` for ascending or `desc` for descending) using the format `field:direction`.

**Example**:

```bash
GET /users?sort=firstName:asc,lastName:desc
```

#### Filtering

`where`: Allows filtering based on specific conditions. The `where` parameter should be provided as a JSON string that matches TypeORM's `find()` method syntax.

**Example**:

```bash
GET /users?where={"isActive":true,"age":30}
```

This will return all active users who are 30 years old.

#### Population of Related Data

`populate`: Allows fetching related data by specifying relations to include. Multiple relations can be specified, separated by commas.

```bash
GET /users?populate=orders,profile
```

This will return users along with their related orders and profile information.

## Middleware System
Cambusa uses a flexible middleware system that allows you to easily add functionality to your application's request/response cycle.

### Configuring Middlewares

Middlewares are configured in your application's configuration files. You can specify the order in which middlewares should be applied:

```js
// config/middlewares.js
export default {
  middlewares: ['cors', 'requestLogger', 'swagger'],
};
```

### Creating Custom Middlewares

To create a custom middleware, add a new file in the api/middlewares/ directory. Each middleware should export a default function that returns an Elysia plugin.

**Example** `api/middlewares/cors.js`

```js
// Cors support
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const plugin =  new Elysia({
    name: 'cors',
  })
  .use(cors(cambusa.config.security.cors));

export default plugin;
```

Cambusa will automatically load and apply middlewares based on the order specified in your configuration.

## Helpers

Helpers in Cambusa are utility functions that can be used across your application. They are automatically loaded and made available globally.

### Creating Helpers

To create a helper, add a new file in the `api/helpers/` directory. Each helper should export a default function.

**Example** `api/helpers/formatDate.js`

```js
export default function (date) {
  return date.toISOString().split('T')[0];
}
```

### Using Helpers

Helpers are available globally through the `cambusa.helpers` object:

```js
const formattedDate = cambusa.helpers.formatDate(new Date());
```

## Models

Models in `api/models/` will automatically be available as `cambusa.models.ModelName`, for example `User` model will be available as `cambusa.models.User`.

Cambusa uses **TypeORM** and you can configure the database used (e.g., PostgreSQL, MySQL, MariaDB, SQLite) by updating the `config/datastore.js`.

[🔗 Database and Models documentation](./docs/DATABASE.md)

## Swagger documentation

Cambusa dynamically generates a swagger api documentation at `/swagger` if enabled in config.

## Logging

Cambusa uses [Pino](https://github.com/pinojs/pino) for fast, structured logging. The logger is available globally as cambusa.log, and its configuration can be customized per environment.

### Log Levels

The log level can be configured in the `logger` section of your configuration files. For example:

```js
// config/logger.js
export default {
  logger: {
    level: 'info',  // Default log level
    logRequests: true,  // Log requests by default
  },
};
```

In development, logs are prettified for better readability, while in production, logs are structured JSON for performance and better integration with logging systems.

### Request Logging

You can enable or disable logging of each incoming HTTP request. When enabled, each request will be logged with the HTTP method, URL, response status, and duration.

To disable request logging (e.g., in production):

```js
export default {
  logger: {
    logRequests: false,
  },
};
```

### Usage

The logger can be accessed globally via `cambusa.log`:

```js
cambusa.log.info('Server is starting...');
cambusa.log.error('An error occurred', err);
```

## Hooks

Cambusa's hook system provides a powerful and flexible way to extend and customize your application. By leveraging hooks, you can inject custom logic at various stages of the application lifecycle without modifying the core framework code.

[🔗 Hooks documentation](./docs/HOOKS.md)

## Philosophy

**Cambusa** is born out of a deep appreciation for Sails.js and its developer-friendly conventions. The goal is to replicate that enjoyable development experience using modern JavaScript features and harnessing the performance benefits of Bun. By adopting a modest and essentialist approach—just like a ship's cambusa—we focus on providing only what's necessary to build robust applications without unnecessary complexity.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve Cambusa.

## License

MIT License

## Author
[Enrico Deleo](https://enricodeleo.com/)
