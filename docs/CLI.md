# Cambusa CLI

Cambusa CLI is a command-line interface for the Cambusa Framework, designed to streamline development tasks and manage your Cambusa application.

## Installation

The Cambusa CLI is included with your Cambusa project. No additional installation is required.

## Usage

To use the Cambusa CLI, run the following command from your project root:

`bun run bin/cambusa.js [command] [options]`

### Global Options

- -v, --version: Output the version number
- -l, --log-level <level>: Set log level (error, warn, info, verbose, debug, silly). Default is 'warn'.
- -h, --help: Display help for command

**Examples**

Generate a new User model:

`bun run bin/cambusa.js models:generate User`

Start the server:

`bun run bin/cambusa.js lift`

## Interactive REPL-like Session

Cambusa CLI provides an interactive REPL-like session that allows you to interact with your Cambusa application directly from the command line.

To start the REPL-like session, use the following command:

```
bun run bin/cambusa.js repl
```

Once in the session, you can interact with the Cambusa instance directly. The Cambusa instance is available as `cambusa`.

### Custom Commands

- `routes`: List all registered routes
- `models`: List all available models
- `help`: Show available commands
- `exit`: Exit the REPL-like session

### Examples

1. View the current configuration:

   ```
   cambusa> cambusa.config
   ```

2. Use the logger:

   ```
   cambusa> cambusa.log.debug('test message')
   ```

3. Fetch a user from the database (assuming you have a User model):

   ```
   cambusa> await cambusa.models.User.findOne({ where: { id: 1 } })
   ```

4. List all routes:

   ```
   cambusa> routes
   ```

5. List all models:
   ```
   cambusa> models
   ```

This REPL-like session supports both synchronous and asynchronous operations. You can use `await` directly in your commands for asynchronous operations.

Please note that while this environment provides a powerful way to interact with your Cambusa application, it should be used cautiously, especially when performing operations that could modify your application state.
