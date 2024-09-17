import { readdirSync, statSync } from 'fs';
import path from 'path';
import { DataSource, EntitySchema } from 'typeorm';
import pluralize from 'pluralize';
import primaryKeyGenerator from './primaryKeyGenerator';

// Automatically wrap models in EntitySchema
function loadModels(cambusa, dir = 'api/models') {
  const modelsDir = path.join(process.cwd(), dir);
  const files = readdirSync(modelsDir);

  // Array to hold all entity classes
  const entities = [];

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
      if (!modelDefinition.columns.id) {
        modelDefinition.columns = {
          id: {
            primary: true,
            ...primaryKeyGenerator(cambusa.config.database.type),
          },
          ...modelDefinition.columns,
        }
      }

      // Automatically wrap the model definition in EntitySchema
      const entitySchema = new EntitySchema({
        name: modelDefinition.name || inferredName,
        tableName: modelDefinition.tableName || inferredTableName,
        columns: modelDefinition.columns,
      });

      entities.push(entitySchema);
    }
  });

  return entities;
}

// Initialize TypeORM DataSource with dynamically loaded entities
export const datastore = (cambusa) => {
  return new DataSource({
    type: cambusa.config.database.type,
    database: cambusa.config.database.url,
    entities: loadModels(cambusa, 'api/models'),
    synchronize: true,
  });
};

export default datastore;
