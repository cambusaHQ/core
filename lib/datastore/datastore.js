import { readdirSync, statSync } from 'fs';
import path from 'path';
import { DataSource, EntitySchema } from 'typeorm';
import pluralize from 'pluralize';
import { get as _get, cloneDeep as _cloneDeep } from 'lodash';
import { boolean } from 'boolean';

import primaryKeyGenerator from './primaryKeyGenerator';
import timestampColumnsGenerator from './timestampColumnsGenerator';
import { mapToDatabaseType } from './mapTypes';

// Automatically wrap models in EntitySchema
export function loadSchemas(config, dir = 'api/models') {
  const modelsDir = path.join(process.cwd(), dir);
  const files = readdirSync(modelsDir);
  const dbType = config.type; // Database type (e.g., 'postgres', 'mysql')

  // Array to hold all entity classes
  const models = [];

  files.forEach((file) => {
    const filePath = path.join(modelsDir, file);
    const stat = statSync(filePath);

    // Only load .js files that are not directories
    if (stat.isFile() && file.endsWith('.js')) {
      const modelDefinition = require(filePath).default;

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

      // Automatically wrap the model definition in EntitySchema
      const name = modelDefinition.name || inferredName;
      const tableName = modelDefinition.tableName || inferredTableName;
      const entitySchema = {
        dbType: config.type,
        name,
        tableName,
        ...modelDefinition,
      };

      models.push(entitySchema);
    }
  });

  return models;
}

// Automatically wrap models in EntitySchema
export function prepareEntities(models) {
  const modelsClone = _cloneDeep(models);
  const entities = modelsClone.map((model) => {
    // Map columns to database-specific types using mapToDatabaseType
    for (const columnName of Object.keys(model.columns)) {
      const column = model.columns[columnName];
      column.type = mapToDatabaseType(column, model.dbType);
    }
    return new EntitySchema(model);
  });

  return entities;
}

// Initialize TypeORM DataSource with dynamically loaded models
export const datastore = (config, models) => {
  return new DataSource({
    ...config,
    entities: models,
    synchronize: true,
    // logging: true,
  });
};

export default datastore;
