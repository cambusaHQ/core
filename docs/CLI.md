# Cambusa CLI

Cambusa CLI is a command-line interface for the Cambusa Framework, designed to streamline development tasks and manage your Cambusa application.

## Installation

The Cambusa CLI is included with your Cambusa project. No additional installation is required.

## Usage

To use the Cambusa CLI, run the following command from your project root:

```bash
bun run bin/cambusa.js [command] [options]
```

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

##  Run Custom Scripts

Run custom scripts located within the `./scripts` directory or its subdirectories.

The run command allows you to execute scripts that perform various tasks, such as data migrations, report generation, or utility operations. Scripts can be organized into subdirectories for better management.

### Syntax:

```bash
bun run bin/cambusa.js run <scriptPath> [args...]
```

- `<scriptPath>`: The path to the script relative to the `./scripts` directory. Use forward slashes (`/`) to denote subdirectories.
- `[args...]`: Optional arguments to pass to the script.

### Example: running a script in a subdirectory

Suppose you have a script `migrateUsers.js` inside the `./scripts/migrations` directory.

**Example code**:

```js
/**
 * Migration Script to Migrate Users
 * @param {Object} cambusa - The Cambusa instance
 * @param {Array} args - Additional arguments passed from the CLI
 */
export default async function (cambusa, args) {
  try {
    const batchSize = args.includes('--batchSize') ? args[args.indexOf('--batchSize') + 1] : 100;
    const dryRun = args.includes('--dryRun') ? args[args.indexOf('--dryRun') + 1] === 'true' : false;

    cambusa.log.info('Starting User Migration...');
    cambusa.log.info(`Batch Size: ${batchSize}`);
    cambusa.log.info(`Dry Run: ${dryRun}`);

    // Fetch users
    const users = await cambusa.models.User.findAll();
    cambusa.log.info(`Found ${users.length} users.`);

    if (dryRun) {
      cambusa.log.info('Dry run enabled. No changes will be made.');
      // Implement dry run logic here
    } else {
      // Implement migration logic here
      for (let i = 0; i < users.length; i += parseInt(batchSize)) {
        const batch = users.slice(i, i + parseInt(batchSize));
        // Process each batch
        // Example: Update user records
        for (const user of batch) {
          user.isMigrated = true;
          await user.save();
        }
        cambusa.log.info(`Migrated batch ${i / batchSize + 1}`);
      }
      cambusa.log.info('User Migration completed successfully.');
    }

    cambusa.log.info('Script executed successfully.');
  } catch (error) {
    console.error('Error executing migrateUsers script:', error);
    process.exit(1);
  }
}
```

**Command:**

```bash
bun run bin/cambusa.js run migrations/migrateUsers
```

### List All Available Scripts

List all scripts available within the `./scripts` directory and its subdirectories.

**Command:**

```bash
bun run bin/cambusa.js scripts:list
```

### Notes

- **Script Structure**: Each script should export a default asynchronous function that accepts the Cambusa instance and an array of arguments.
- **Argument Parsing**: For more sophisticated argument parsing within scripts, consider using libraries like `minimist` or `yargs`.
