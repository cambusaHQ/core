import path from 'path';
import { readdir } from 'node:fs/promises';
import { DataSource, EntitySchema } from 'typeorm';
import pluralize from 'pluralize';
import { get as _get, cloneDeep as _cloneDeep } from 'lodash';
import { boolean } from 'boolean';

import primaryKeyGenerator from './primaryKeyGenerator';
import timestampColumnsGenerator from './timestampColumnsGenerator';
import { mapToDatabaseType } from './mapTypes';

/**
 * Loads and processes schema definitions from model files.
 *
 * @param {Object} config - Configuration object containing database settings.
 * @param {string} [dir='api/models'] - Directory path where model files are located.
 * @returns {Promise<Array>} An array of processed model schemas.
 */
export async function loadSchemas(config, dir = 'api/models') {
  const modelsDir = path.join(process.cwd(), dir);
  let files;

  try {
    files = await readdir(modelsDir);
  } catch (error) {
    cambusa.log.verbose(error);
    cambusa.log.warn(`Models directory not found: ${modelsDir}.`);
    return [];
  }

  const dbType = config.type; // Database type (e.g., 'postgres', 'mysql')

  // Array to hold all entity classes
  const models = [];

  try {
    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(modelsDir, file);
        const fileHandle = Bun.file(filePath);

        if (await fileHandle.exists()) {
          try {
            const modelModule = await import(filePath);
            const modelDefinition = modelModule.default;

            // Infer name and tableName from filename if not provided
            const inferredName = path.basename(file, '.js');
            const inferredTableName = pluralize(inferredName.toLowerCase());

            // Automatically add a primary key if it's missing
            if (
              boolean(_get(modelDefinition, 'primaryKey', true)) &&
              !modelDefinition.columns.id
            ) {
              const primaryKey = primaryKeyGenerator(dbType);
              modelDefinition.columns = {
                [primaryKey.name]: {
                  primary: true,
                  ...primaryKey,
                },
                ...modelDefinition.columns,
              };
            }

            // Automatically add createdAt and updatedAt columns
            const timestampColumns = timestampColumnsGenerator(dbType);
            if (boolean(_get(modelDefinition, 'createdAt', true))) {
              modelDefinition.columns.createdAt = timestampColumns.createdAt;
            }
            if (boolean(_get(modelDefinition, 'updatedAt', true))) {
              modelDefinition.columns.updatedAt = timestampColumns.updatedAt;
            }

            // Prepare the final entity schema
            const name = modelDefinition.name || inferredName;
            const tableName = modelDefinition.tableName || inferredTableName;
            const entitySchema = {
              dbType: config.type,
              name,
              tableName,
              ...modelDefinition,
            };

            models.push(entitySchema);
          } catch (error) {
            cambusa.log.error(
              `Error loading model from file ${filePath}:`,
              error
            );
          }
        }
      }
    }
  } catch (error) {
    cambusa.log.error(`Error reading models directory ${modelsDir}:`, error);
  }

  return models;
}

/**
 * Prepares entity schemas for use with TypeORM.
 *
 * @param {Array} models - Array of model definitions.
 * @returns {Array} An array of EntitySchema instances ready for TypeORM.
 */
export function prepareEntities(models) {
  const modelsClone = _cloneDeep(models);
  const entities = modelsClone.map((model) => {
    // Map columns to database-specific types using mapToDatabaseType
    for (const columnName of Object.keys(model.columns)) {
      const column = model.columns[columnName];
      const mappedTypes = mapToDatabaseType(column, model.dbType);
      column.type = mappedTypes.type;
      column.transformer = mappedTypes.transformer;
    }

    return new EntitySchema(model);
  });

  return entities;
}

/**
 * Initializes and returns a TypeORM DataSource with dynamically loaded models.
 *
 * @param {Object} config - Configuration object for the DataSource.
 * @param {Array} models - Array of prepared entity models.
 * @param {Object} cambusaInstance - The Cambusa instance for broadcasting.
 * @returns {DataSource} A configured TypeORM DataSource instance.
 */
export const datastore = (config, models) => {
  const dataSource = new DataSource({
    entities: models,
    migrations: [path.join(process.cwd(), 'migrations', '*.js')], // Path to migration files
    migrationsTableName: 'migrations',
    ...config,
  });

  return dataSource;
};

export default datastore;
