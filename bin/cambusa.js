#!/usr/bin/env bun

import fs from 'fs';
import { unlinkSync } from 'node:fs';
import path from 'path';
import { createRequire } from 'module';
import readline from 'readline';
import { program } from 'commander';
import { $ } from 'bun';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

program
  .version(version)
  .description('CLI for Cambusa Framework')
  .option(
    '-l, --log-level <level>',
    'Set log level (error, warn, info, verbose, debug, silly)',
    'warn'
  );

// Helper function to import Cambusa with the specified log level
async function importCambusa() {
  const cambusa = await import('../app.js');
  return cambusa.default;
}

/**
 * Recursively retrieves all .js script paths within a directory.
 * @param {string} dir - The directory to search.
 * @param {string} baseDir - The base directory for relative paths.
 * @returns {string[]} - An array of script paths relative to baseDir.
 */
function getAllScripts(dir, baseDir) {
  let scripts = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      scripts = scripts.concat(getAllScripts(fullPath, baseDir));
    } else if (file.isFile() && file.name.endsWith('.js')) {
      scripts.push(path.relative(baseDir, fullPath).replace(/\.js$/, ''));
    }
  }

  return scripts;
}

program
  .command('models:generate <name>')
  .description('Generate a new model')
  .action((name) => {
    const modelTemplate = `
export default {
  columns: {
    // Define your columns here
  },
  relations: {
    // Define your relations here
  },
};
    `;
    const fileName = `${name}.js`;
    const filePath = path.join(process.cwd(), 'api', 'models', fileName);

    fs.writeFileSync(filePath, modelTemplate.trim());
    console.log(`Model ${name} created at ${filePath}`);
  });

program
  .command('models:list')
  .description('List all models')
  .action(() => {
    const modelsDir = path.join(process.cwd(), 'api', 'models');
    if (!fs.existsSync(modelsDir)) {
      console.error('Models directory does not exist.');
      process.exit(1);
    }

    const models = fs
      .readdirSync(modelsDir)
      .filter((file) => file.endsWith('.js'))
      .map((file) => path.basename(file, '.js'));

    if (models.length === 0) {
      console.log('No models found.');
      return;
    }

    console.log('Available models:');
    models.forEach((model) => console.log(`- ${model}`));
  });

program
  .command('lift')
  .description('Start the Cambusa server')
  .action(async () => {
    try {
      const cambusa = await importCambusa();
      if (cambusa) {
        await cambusa.lift();
      } else {
        console.error(
          'Cambusa instance not found. Please check your app.js file.'
        );
      }
    } catch (error) {
      console.error('Failed to start Cambusa server:', error);
    }
  });

program
  .command('routes:list')
  .description('List all registered routes')
  .action(async () => {
    try {
      const cambusa = await importCambusa();
      if (cambusa && cambusa.app) {
        const routes = cambusa.app.routes;
        console.log('Registered routes:');
        routes.forEach((route) => {
          console.log(`${route.method} ${route.path}`);
        });
      } else {
        console.error(
          'Cambusa instance or routes not found. Please check your app.js file.'
        );
      }
    } catch (error) {
      console.error('Failed to list routes:', error);
    }
  });

program
  .command('controllers:generate <name>')
  .description('Generate a new controller')
  .action((name) => {
    const controllerTemplate = `
export default {
  index: async (ctx) => {
    // List all resources
  },
  show: async (ctx) => {
    // Show a specific resource
  },
  create: async (ctx) => {
    // Create a new resource
  },
  update: async (ctx) => {
    // Update a specific resource
  },
  delete: async (ctx) => {
    // Delete a specific resource
  }
};
    `;
    const fileName = `${name}.js`;
    const filePath = path.join(process.cwd(), 'api', 'controllers', fileName);

    fs.writeFileSync(filePath, controllerTemplate.trim());
    console.log(`Controller ${name} created at ${filePath}`);
  });

program
  .command('db:sync')
  .description('Synchronize database schema')
  .action(async () => {
    try {
      const cambusa = await importCambusa();
      if (cambusa && cambusa.db) {
        await cambusa.db.synchronize();
        console.log('Database schema synchronized successfully.');
      } else {
        console.error(
          'Cambusa instance or database connection not found. Please check your app.js file.'
        );
      }
    } catch (error) {
      console.error('Failed to synchronize database schema:', error);
    }
  });

program
  .command('migrations:generate <name>')
  .description('Generate a new migration based on entity changes')
  .action(async (name) => {
    try {
      const cambusa = await importCambusa();
      if (!cambusa || !cambusa.db) {
        throw new Error(
          'Failed to initialize Cambusa instance or database connection.'
        );
      }

      const dataSource = cambusa.db;
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const migrationName = `${Date.now()}-${name}`;
      const migrationPath = path.join(process.cwd(), 'migrations');

      // Ensure the migrations directory exists
      await $`mkdir -p ${migrationPath}`;

      const tempConfigPath = path.join(
        process.cwd(),
        'temp-typeorm-config.cjs'
      );
      const configContent = `
      const { DataSource } = require("typeorm");
      module.exports = new DataSource(${JSON.stringify(
        dataSource.options,
        (key, value) => {
          if (key === 'entities') {
            return value; // This will keep the entities as a JavaScript array
          }
          return value;
        },
        2
      )
        .replace('"entities": [', '"entities": [\n')
        .replace(/\\"/g, '"')});`;

      await Bun.write(tempConfigPath, configContent);

      try {
        // Run TypeORM CLI command to generate migration
        const fullMigrationPath = path.join(migrationPath, migrationName);
        const result =
          await $`bunx typeorm migration:generate -d ${tempConfigPath} ${fullMigrationPath}`;

        if (
          result.stdout.includes('No changes in database schema were found')
        ) {
          console.log(
            'No changes in database schema were detected. No new migration was generated.'
          );
          console.log(
            "If you want to create an empty migration, use the 'migrations:create' command instead."
          );
        } else {
          console.log('Migration generation output:', result.stdout.toString());
          console.log(`Migration ${migrationName} has been generated.`);
        }
      } catch (error) {
        if (
          error.stderr &&
          error.stderr.includes('No changes in database schema were found')
        ) {
          console.log(
            'No changes in database schema were detected. No new migration was generated.'
          );
          console.log(
            "If you want to create an empty migration, use the 'migrations:create' command instead."
          );
        } else {
          throw error;
        }
      } finally {
        // Remove the temporary config file
        unlinkSync(tempConfigPath);
      }
    } catch (error) {
      console.error('Failed to generate migration:', error.message);
    }
  });

program
  .command('migrations:run')
  .description('Run pending migrations')
  .action(async () => {
    try {
      const cambusa = await importCambusa();
      if (!cambusa || !cambusa.db) {
        throw new Error(
          'Failed to initialize Cambusa instance or database connection.'
        );
      }

      const dataSource = cambusa.db;
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      console.log('Running pending migrations...');
      const migrations = await dataSource.runMigrations();

      if (migrations.length === 0) {
        console.log('No pending migrations to run.');
      } else {
        console.log(`Successfully ran ${migrations.length} migration(s):`);
        migrations.forEach((migration) => {
          console.log(`- ${migration.name}`);
        });
      }
    } catch (error) {
      console.error('Failed to run migrations:', error.message);
    } finally {
      if (cambusa && cambusa.db) {
        await cambusa.db.destroy();
      }
    }
  });

program
  .command('migrations:create <name>')
  .description('Create a new empty migration')
  .action(async (name) => {
    try {
      const cambusa = await importCambusa();
      if (!cambusa || !cambusa.db) {
        throw new Error(
          'Failed to initialize Cambusa instance or database connection.'
        );
      }

      const dataSource = cambusa.db;
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const migrationName = `${Date.now()}-${name}`;
      const migrationPath = path.join(process.cwd(), 'migrations');

      // Ensure the migrations directory exists
      await $`mkdir -p ${migrationPath}`;

      const fullMigrationPath = path.join(migrationPath, migrationName);
      const result =
        await $`bunx typeorm migration:create ${fullMigrationPath}`;

      console.log('Migration creation output:', result.stdout.toString());
      console.log(`Empty migration ${migrationName} has been created.`);
    } catch (error) {
      console.error('Failed to create migration:', error.message);
    }
  });

program
  .command('repl')
  .description('Start an interactive REPL session with Cambusa loaded')
  .action(async () => {
    try {
      const cambusa = await importCambusa();
      if (cambusa) {
        console.log('Starting Cambusa REPL session...');
        console.log('Cambusa instance is available as "cambusa"');
        console.log('Type "exit" to exit the session');

        const customCommands = {
          routes: () => {
            const routes = cambusa.app.routes;
            console.log('Registered routes:');
            routes.forEach((route) => {
              console.log(`${route.method} ${route.path}`);
            });
          },
          models: () => {
            const models = Object.keys(cambusa.models);
            console.log('Available models:');
            models.forEach((model) => console.log(`- ${model}`));
          },
          help: () => {
            console.log('Available commands:');
            console.log('  routes - List all registered routes');
            console.log('  models - List all available models');
            console.log('  help   - Show this help message');
            console.log('  exit   - Exit the REPL session');
          },
        };

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          prompt: 'cambusa> ',
        });

        rl.prompt();

        rl.on('line', async (line) => {
          const input = line.trim();
          if (input.toLowerCase() === 'exit') {
            console.log('Exiting Cambusa REPL session...');
            rl.close();
            return;
          }
          if (customCommands[input]) {
            customCommands[input]();
          } else {
            try {
              // Use Function constructor to create a function with 'cambusa' in its scope
              const result = await new Function(
                'cambusa',
                `return (async () => { return ${input} })()`
              ).call(null, cambusa);
              console.log(result);
            } catch (error) {
              console.error('Error:', error.message);
            }
          }
          rl.prompt();
        }).on('close', () => {
          process.exit(0);
        });
      } else {
        console.error('Failed to initialize Cambusa instance.');
      }
    } catch (error) {
      console.error('Failed to start Cambusa REPL session:', error);
    }
  });

program
  .command('run <scriptPath> [args...]')
  .description(
    'Run a script from the ./scripts directory or its subdirectories with optional arguments'
  )
  .action(async (scriptPath, args) => {
    try {
      const cambusa = await importCambusa();

      const scriptsDir = path.resolve(process.cwd(), 'scripts');
      const fullScriptPath = path.resolve(scriptsDir, `${scriptPath}.js`);

      // Ensure the script is within the scripts directory
      if (!fullScriptPath.startsWith(scriptsDir)) {
        console.error(
          'Invalid script path. Scripts must be within the ./scripts directory.'
        );
        process.exit(1);
      }

      if (!fs.existsSync(fullScriptPath)) {
        console.error(`Script '${scriptPath}' not found in scripts directory.`);
        process.exit(1);
      }

      const scriptModule = await import(fullScriptPath);

      if (typeof scriptModule.default !== 'function') {
        console.error(
          `Script '${scriptPath}' does not export a default function.`
        );
        process.exit(1);
      }

      // Execute the script, passing the cambusa instance and additional arguments
      await scriptModule.default(cambusa, args);

      console.log(`Script '${scriptPath}' executed successfully.`);
    } catch (error) {
      console.error(`Failed to run script '${scriptPath}':`, error);
      process.exit(1);
    }
  });

program
  .command('scripts:list')
  .description(
    'List all available scripts in the ./scripts directory and its subdirectories'
  )
  .action(() => {
    try {
      const scriptsDir = path.resolve(process.cwd(), 'scripts');
      if (!fs.existsSync(scriptsDir)) {
        console.error('Scripts directory does not exist.');
        process.exit(1);
      }

      const scripts = getAllScripts(scriptsDir, scriptsDir);

      if (scripts.length === 0) {
        console.log('No scripts found in the scripts directory.');
        return;
      }

      console.log('Available Scripts:');
      scripts.forEach((script) => console.log(`- ${script}`));
    } catch (error) {
      console.error('Failed to list scripts:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
