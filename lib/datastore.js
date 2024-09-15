import { readdirSync, statSync } from 'fs';
import path from 'path';
import { DataSource, EntitySchema } from 'typeorm';

// Automatically wrap models in EntitySchema
function loadModels(dir = 'api/models') {
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

      // Automatically wrap the model definition in EntitySchema
      const entitySchema = new EntitySchema(modelDefinition);
      entities.push(entitySchema);
    }
  });

  return entities;
}

// Initialize TypeORM DataSource with dynamically loaded entities
export const datastore = (cambusa) => {
  return new DataSource({
    type: cambusa.config.database.type,
    database: cambusa.config.database.url,  // Correct SQLite path
    entities: loadModels('api/models'),
    synchronize: true,
  });
};

export default datastore;
