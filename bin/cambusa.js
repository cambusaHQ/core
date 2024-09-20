#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { program } from 'commander';

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
  .command("models:list")
  .description("List all models")
  .action(() => {
    const modelsDir = path.join(process.cwd(), "api", "models");
    const models = fs
      .readdirSync(modelsDir)
      .filter((file) => file.endsWith(".js"))
      .map((file) => path.basename(file, ".js"));

    console.log("Available models:");
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
  .command("controllers:generate <name>")
  .description("Generate a new controller")
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
    const filePath = path.join(process.cwd(), "api", "controllers", fileName);

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

program.parse(process.argv);
