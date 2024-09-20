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
