# Cambusa CLI

🚣 Cambusa CLI is a command-line interface for the Cambusa Framework, designed to streamline development tasks and manage your Cambusa application.

## Installation

Install Cambusa CLI globally using npm:

```bash
npm install -g @cambusa/cli
```

## Usage

After installing globally, you can use the Cambusa CLI from any directory:

```bash
cambusa [command] [options]
```

### Global Options

- `-v, --version`: Output the version number
- `-l, --log-level <level>`: Set log level (error, warn, info, verbose, debug, silly). Default is 'warn'.
- `-h, --help`: Display help for command

## Commands

### Initialize a New Project

Create a new Cambusa project:

```bash
cambusa init [projectName]
```

### Generate a Model

Generate a new model:

```bash
cambusa models:generate User
```

### Start the Server

Start the Cambusa server:

```bash
cambusa lift
```

### Interactive REPL-like Session

Start an interactive REPL-like session:

```bash
cambusa repl
```

In the REPL session, you can interact with the Cambusa instance directly. The Cambusa instance is available as `cambusa`.

#### Custom REPL Commands

- `routes`: List all registered routes
- `models`: List all available models
- `help`: Show available commands
- `exit`: Exit the REPL-like session

#### REPL Examples

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

### Run Custom Scripts

Run custom scripts located within the `./scripts` directory or its subdirectories:

```bash
cambusa run <scriptPath> [args...]
```

#### Example: Running a Script in a Subdirectory

```bash
cambusa run migrations/migrateUsers --batchSize 200 --dryRun true
```

### List Available Scripts

List all scripts available within the `./scripts` directory and its subdirectories:

```bash
cambusa scripts:list
```

## Notes

- When using the CLI commands, ensure you are in the root directory of your Cambusa project.
- The REPL-like session provides a powerful way to interact with your Cambusa application but should be used cautiously, especially when performing operations that could modify your application state.
- Custom scripts should export a default asynchronous function that accepts the Cambusa instance and an array of arguments.

For more detailed information on each command and its options, use the `--help` flag:

```bash
cambusa [command] --help
```
