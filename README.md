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

Define your application's routes in config/routes.js, mapping HTTP methods and paths to controller actions.

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

Controllers handle the logic for your routes. Place them in the `api/controllers/` directory.

**Example** `api/controllers/UserController.js`:

```js
export async function getUsers({ request, response }) {
  // Your logic to retrieve users
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
}
```

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

### Helpers

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

[🔗 Database documentation](./docs/DATABASE.md)

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
