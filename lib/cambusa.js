/**
 * Cambusa - A flexible and extensible backend framework
 *
 * This file defines the core Cambusa class, which serves as the central hub for the application.
 * It manages configuration, initialization, database connections, routing, and various other
 * aspects of the application lifecycle.
 */

import 'dotenv/config';
import { Elysia } from 'elysia';
import { createRequire } from 'module';
import { WebSocket } from 'ws';

import loadMiddlewares from '@lib/middlewaresLoader';
import blueprints from '@lib/router/blueprints';
import defineRoutes from '@lib/router/routes.js';
import loadHelpers from '@lib/helpersLoader';
import {
  loadSchemas,
  prepareEntities,
  datastore,
} from '@lib/datastore/datastore.js';
import logger from '@lib/logger';
import welcomeBanner from '@lib/welcomeBanner';
import loadHooks from '@lib/hooksLoader';

import config from '@/config';

class Cambusa {
  // Public properties
  config;
  app;
  log;
  helpers = {};
  db = null;
  schemas = [];

  #hooks = {};
  #wsClients = new Set();

  /**
   * Constructor for the Cambusa class
   * Initializes core components like configuration, Elysia app instance, and logger
   */
  constructor() {
    this.config = config;
    this.app = new Elysia();
    this.log = logger(this);
  }

  /**
   * Initializes the Cambusa instance
   * This method orchestrates the loading of various components and executes initialization hooks
   */
  async initialize() {
    process.env.TZ = this.config.localization.timezone;
    await this.executeHook('beforeInitialization');
    await this.#loadHooks();
    await this.executeHook('afterHooksLoaded');
    await this.#loadSchemas();
    await this.#initializeDatabase();
    await this.#loadMiddlewares();
    await this.#loadBlueprints();
    await this.#loadRoutes();
    await this.#loadHelpers();
    await this.executeHook('onInitialized');
  }

  /**
   * Loads and initializes hooks
   * Hooks allow for extending functionality at various points in the application lifecycle
   */
  async #loadHooks() {
    await loadHooks();
    this.log.info('🔗 All hooks have been loaded.');
  }

  /**
   * Loads and applies middlewares
   * Middlewares are used to process requests and responses globally
   */
  async #loadMiddlewares() {
    const middlewares = await loadMiddlewares(this.config.middlewares);
    middlewares.forEach((middleware) => this.app.use(middleware));
    this.log.info('⚙️ All middlewares loaded.');
    await this.executeHook('afterMiddlewaresLoaded');
  }

  /**
   * Loads and initializes blueprints
   * Blueprints are used to automatically generate RESTful routes based on schemas
   */
  async #loadBlueprints() {
    const routes = await blueprints(this.schemas);
    routes.forEach((router) => this.app.use(router));
    this.log.info('🚀 Blueprints loaded.');
    await this.executeHook('afterBlueprintLoaded');
  }

  /**
   * Loads and registers custom routes
   * These routes are defined in the configuration and complement the blueprint routes
   */
  async #loadRoutes() {
    await defineRoutes(this.config.routes);
    this.log.info('🗺️ All routes registered.');
    await this.executeHook('afterRoutesLoaded');
  }

  /**
   * Loads helper functions
   * Helpers are utility functions that can be used throughout the application
   */
  async #loadHelpers() {
    this.helpers = await loadHelpers();
    this.log.info('💁‍♂️ Helpers loaded.');
    await this.executeHook('afterHelpersLoaded');
  }

  /**
   * Loads database schemas
   * Schemas define the structure of the data models used in the application
   */
  async #loadSchemas() {
    this.schemas = await loadSchemas(this.config.database);
  }

  /**
   * Initializes the database connection
   * This method sets up the database using the configured schemas and connection settings
   */
  async #initializeDatabase() {
    const entities = prepareEntities(this.schemas, this.config.database.type);
    this.db = await datastore(this.config.database, entities);
    await this.db.initialize();
    cambusa.log.info(this.db);
    this.log.info('📚 Database initialized.');
    await this.executeHook('afterDatabaseInitialized');
  }

  /**
   * Starts the server and listens for incoming requests
   * This method is called after all initialization is complete
   */
  async lift() {
    const { host, port, sockets } = this.config.server;
    const normalizedPort = parseInt(port, 10);

    if (sockets) {
      const { websocketHandler } = await import('./router/websocketHandler.js');
      this.app.ws('/', (ws) => websocketHandler(ws));
      this.log.info('🔌 WebSocket support enabled.');
    }

    this.app.listen(
      {
        port: normalizedPort,
        hostname: host,
      },
      async () => {
        welcomeBanner({ host, port });
        await this.executeHook('onServerStarted');
      }
    );
  }

  /**
   * Registers a new hook
   * @param {string} hookName - The name of the hook to register
   * @param {Function} fn - The function to be executed when the hook is triggered
   */
  registerHook(hookName, fn) {
    if (!this.#hooks[hookName]) {
      this.#hooks[hookName] = [];
    }
    this.#hooks[hookName].push(fn);
  }

  /**
   * Executes all functions registered for a specific hook
   * @param {string} hookName - The name of the hook to execute
   * @param {...any} args - Arguments to pass to the hook functions
   */
  async executeHook(hookName, ...args) {
    if (this.#hooks[hookName]) {
      for (const fn of this.#hooks[hookName]) {
        try {
          await fn(...args);
        } catch (error) {
          this.log.error(
            `Error executing hook "${hookName}": ${error.message}`
          );
        }
      }
    }
  }

  /**
   * Registers a WebSocket client
   * @param {WebSocket} ws - The WebSocket instance
   */
  registerWsClient(ws) {
    this.#wsClients.add(ws);
  }

  /**
   * Unregisters a WebSocket client
   * @param {WebSocket} ws - The WebSocket instance
   */
  unregisterWsClient(ws) {
    this.#wsClients.delete(ws);
  }

  broadcastEntityUpdate(message) {
    console.log('Broadcasting entity update:', message);
    // We'll implement the actual broadcasting later
    // For now, let's just log it
  }

  /**
   * Broadcasts a WebSocket message to all connected clients
   * @param {Object} message - The message to broadcast
   */
  broadcastWebSocketMessage(message) {
    this.#wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  /**
   * Getter for database models
   * Provides a proxy to access database repositories for each model
   */
  get models() {
    const modelsHandler = {
      get: (target, prop) => {
        if (typeof prop === 'string') {
          return this.db.getRepository(prop);
        }
        return undefined;
      },
    };
    return new Proxy({}, modelsHandler);
  }

  /**
   * Getter for the application version
   * Retrieves the version from package.json
   */
  get version() {
    const require = createRequire(import.meta.url);
    const { version } = require('../package.json');

    return version;
  }
}

export default Cambusa;
