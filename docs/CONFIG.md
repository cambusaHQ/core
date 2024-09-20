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

**Environment variables can also be added to a `.env` file.**

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
