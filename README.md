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
├── api/
│   └── controllers/
│       └── root.js
│       └── users/
│           └── create.js
│           └── delete.js
│           └── read.js
│           └── update.js
├── config/
│   ├── index.js
│   ├── routes.js
│   ├── server.js
│   └── env/
│       ├── development.js
│       ├── production.js
│       └── test.js
├── lib/
│   └── routesLoader.js
├── middlewares/
│   └── cors.js
│   └── requestLogger.js
│   └── swagger.js
├── app.js
├── package.json
└── bunfig.toml
```

### Run

```bash
bun run app.js
```

## Configuration

Cambusa uses a flexible configuration system. Configurations are split into files within the `config/` directory, allowing you to manage settings for different aspects of your application, such as server settings, database connections, and custom configurations.

### **Example** config/server.js

```js
export default {
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
};
```

### Type Conversion

Cambusa automatically converts configuration values to the appropriate data types:

- **Booleans**: Strings like 'true', 'false', 'on', 'off', 'yes', and 'no' are converted to booleans.
- **Numbers**: Strings that represent numbers (e.g., '8080') are automatically converted to numbers.
- **Arrays** and **Objects**: JSON-like strings are parsed into arrays or objects.

### Environment-Specific Configurations

Create environment-specific configuration files in the config/env/ directory to override default settings.

**Example** `config/env/development.js`:

```js
export default {
  server: {
    host: 'localhost',
    port: 3000,
  },
};
```

**Example** `config/env/production.js`:

```js
export default {
  server: {
    host: '0.0.0.0',
    port: 80,
  },
};
```

### Environment Variables

Cambusa supports the use of environment variables with a specific prefix. By default, the prefix is `CAMBUSA__`, and the double underscores (`__`) are used to create nested configuration keys.

For example, the following environment variables:

```bash
export CAMBUSA__SERVER__HOST=localhost
export CAMBUSA__SERVER__PORT=8080
```

Will dynamically result in the following configuration:

```js
{
  "server": {
    "host": "localhost",
    "port": 8080
  },
}
```

- **Double underscores** (`__`): Used to represent nested keys in the configuration. For example, `CAMBUSA__SERVER__HOST` maps to `server.host`.
- **Automatic Type Conversion**: As with other configuration sources, environment variables are automatically converted to the appropriate types (e.g., booleans, numbers).

### User-Specific Configurations

You can add user-specific configurations in a file located in your home directory: `~/.cambusa/config.js`. These configurations will automatically be merged into the application's configuration.

**Example:**

```js
// ~/.cambusa/config.js
export default {
  server: {
    port: 5000,
  },
};
```

### Using Command-Line Arguments

You can override any configuration using command-line arguments when launching the application. Use dot notation to reference nested configuration values.

**Example:**

```bash
bun run app.js --server.port=8080
```

This command will set server.port to `8080`.

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

## Philosophy

**Cambusa** is born out of a deep appreciation for Sails.js and its developer-friendly conventions. The goal is to replicate that enjoyable development experience using modern JavaScript features and harnessing the performance benefits of Bun. By adopting a modest and essentialist approach—just like a ship's cambusa—we focus on providing only what's necessary to build robust applications without unnecessary complexity.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve Cambusa.

## License

MIT License

## Author
[Enrico Deleo](https://enricodeleo.com/)
