// @lib/hooksLoader.js
import fs from 'fs';
import path from 'path';

async function loadHooks(cambusa, hooksDirectory = 'api/hooks') {
  const hooksPath = path.resolve(process.cwd(), hooksDirectory);

  if (!fs.existsSync(hooksPath)) {
    cambusa.log.warn(`Hooks directory does not exist: ${hooksPath}`);
    return;
  }

  let files = fs.readdirSync(hooksPath);

  // Load hooks
  const hooks = [];

  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      const hookPath = path.join(hooksPath, file);
      try {
        const hookModule = await import(hookPath);
        const hookFunction = hookModule.default || hookModule;
        const priority = hookModule.priority || 0;

        if (typeof hookFunction === 'function') {
          hooks.push({ hookFunction, priority, file });
        } else {
          cambusa.log.warn(`Hook file does not export a function: ${file}`);
        }
      } catch (error) {
        cambusa.log.error(`Failed to load hook ${file}: ${error.message}`);
      }
    }
  }

  // Sort hooks by priority
  hooks.sort((a, b) => a.priority - b.priority);

  // Execute hooks
  for (const { hookFunction, file } of hooks) {
    try {
      await hookFunction(cambusa);
      cambusa.log.info(`🔗 Hook loaded: ${file}`);
    } catch (error) {
      cambusa.log.error(`Error executing hook ${file}: ${error.message}`);
    }
  }
}

export default loadHooks;
