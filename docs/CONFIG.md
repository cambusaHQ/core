# Configuration

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

## The `cambusa` Global Object

The `cambusa` global object is a central part of the Cambusa framework, providing access to various components and utilities throughout your application.

### Key Properties and Methods

- `cambusa.config`: Contains all configuration settings for your application.
- `cambusa.app`: The main Elysia application instance.
- `cambusa.log`: The Pino logger instance for logging.
- `cambusa.db`: The TypeORM DataSource instance for database operations.
- `cambusa.helpers`: Contains all loaded helper functions.

Example Usage:

```js
// Accessing configuration
const serverPort = cambusa.config.server.port;

// Logging
cambusa.log.info('Application started');

// Database operations
const users = await cambusa.db.getRepository('User').find();

// Using a helper
const formattedDate = cambusa.helpers.formatDate(new Date());
```

The `cambusa` object is automatically available in your controllers, models, and other parts of your application, allowing easy access to core functionalities without the need for manual imports.
