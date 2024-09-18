import { readdirSync, statSync } from 'fs';
import path from 'path';
import { DataSource, EntitySchema } from 'typeorm';
import pluralize from 'pluralize';
import { get as _get } from 'lodash';
import { boolean } from 'boolean';

import primaryKeyGenerator from './primaryKeyGenerator';
import timestampColumnsGenerator from './timestampColumnsGenerator';

// Automatically wrap models in EntitySchema
export function loadModels(config, dir = 'api/models') {
  const modelsDir = path.join(process.cwd(), dir);
  const files = readdirSync(modelsDir);

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
      if (boolean(_get(modelDefinition, 'primaryKey', true)) && !modelDefinition.columns.id) {
        const primaryKey = primaryKeyGenerator(config.type);
        modelDefinition.columns = {
          [primaryKey.name]: {
            primary: true,
            ...primaryKey,
          },
          ...modelDefinition.columns,
        }
      }

      // Automatically add createdAt and updatedAt columns
      const timestampColumns = timestampColumnsGenerator(config.type);
      if (boolean(_get(modelDefinition, 'createdAt', true))) {
        modelDefinition.columns.createdAt = timestampColumns.createdAt;
      }
      if (boolean(_get(modelDefinition, 'updatedAt', true))) {
        modelDefinition.columns.updatedAt = timestampColumns.updatedAt;
      }

      // Automatically wrap the model definition in EntitySchema
      const name = modelDefinition.name || inferredName;
      const tableName = modelDefinition.tableName || inferredTableName;
      const entitySchema = new EntitySchema({
        name,
        tableName,
        ...modelDefinition,
      });

      cambusa.log.verbose(`[Model]: ${name} loaded`);

      models.push(entitySchema);
    }
  });

  return models;
}

// Initialize TypeORM DataSource with dynamically loaded models
export const datastore = (config, models) => {
  return new DataSource({
    ...config,
    entities: models,
    synchronize: true,
  });
};

export default datastore;
