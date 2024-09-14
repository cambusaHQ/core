import { readdirSync, statSync } from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';

// Load models dynamically from the 'models' directory
function loadModels(dir = 'models') {
  const modelsDir = path.join(process.cwd(), dir);
  const files = readdirSync(modelsDir);

  // Array to hold all entity classes
  const entities = [];

  files.forEach((file) => {
    const filePath = path.join(modelsDir, file);
    const stat = statSync(filePath);

    // Only load .js files that are not directories
    if (stat.isFile() && file.endsWith('.js')) {
      const entity = require(filePath).default;  // Import the entity
      entities.push(entity);  // Add the entity to the array
    }
  });

  return entities;
}

// Initialize TypeORM DataSource with dynamically loaded entities
export const datastore = (cambusa) => {
  return new DataSource({
    type: cambusa.config.database.provider || 'better-sqlite3',
    url: cambusa.config.database.url,
    entities: loadModels('models'),  // Dynamically load entities
    synchronize: true,  // Use only in development, otherwise use migrations
  });
}

export default datastore;
