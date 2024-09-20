import { readdirSync, statSync } from 'fs';
import path from 'path';

export function loadHelpers(dir = 'api/helpers') {
  const helpersDir = path.join(process.cwd(), dir); // Correct directory path
  const files = readdirSync(helpersDir);

  // Object to hold all helper functions
  const helpers = {};

  files.forEach((file) => {
    const filePath = path.join(helpersDir, file);
    const stat = statSync(filePath);

    // Only load .js files that are not directories
    if (stat.isFile() && file.endsWith('.js')) {
      const helperFunction = require(filePath).default;
      const helperName = path.basename(file, '.js'); // Use filename as key for the helper
      helpers[helperName] = helperFunction;
      cambusa.log.verbose(`[Helper]: ${helperName} loaded`);
    }
  });

  return helpers;
}

export default loadHelpers;
