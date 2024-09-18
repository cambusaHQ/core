import 'dotenv/config';
import { Elysia } from 'elysia';

import loadMiddlewares from '@lib/middlewaresLoader';
import loadAutoRoutes from '@lib/autoRoutesLoader';
import loadRoutes from '@lib/routesLoader.js';
import loadHelpers from '@lib/helpersLoader';
import datastore from '@lib/datastore/datastore.js';
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

  // Private fields and methods
  #hooks = {};

  constructor() {
    this.config = config;
    this.app = new Elysia();
    this.log = logger(this);
  }

  async initialize() {
    process.env.TZ = this.config.localization.timezone;
    await this.executeHook('beforeInitialization');
    await this.#loadHooks();
    await this.executeHook('afterHooksLoaded');
    await this.#initializeDatabase();
    await this.#loadMiddlewares();
    await this.#loadAutoRoutes();
    await this.#loadRoutes();
    await this.#loadHelpers();
    await this.executeHook('onInitialized');
  }

  async #loadHooks() {
    await loadHooks();
    this.log.info('🔗 All hooks have been loaded.');
  }

  async #loadMiddlewares() {
    const middlewares = await loadMiddlewares(this.config.middlewares);
    middlewares.forEach((middleware) => this.app.use(middleware));
    this.log.info('⚙️  All middlewares loaded.');
    await this.executeHook('afterMiddlewaresLoaded');
  }

  async #loadAutoRoutes() {
    const modelNames = this.db.entityMetadatas.map(
      (entity) => entity.name
    );
    const routes = await loadAutoRoutes(modelNames);
    routes.forEach((router) => this.app.use(router));
    this.log.info('🚀 Auto-generated CRUD routes loaded.');
  }

  async #loadRoutes() {
    await loadRoutes(this.config.routes);
    this.log.info('🗺️  All routes registered.');
    await this.executeHook('afterRoutesLoaded');
  }

  async #loadHelpers() {
    this.helpers = await loadHelpers();
    this.log.info('💁‍♂️  Helpers loaded.');
    await this.executeHook('afterHelpersLoaded');
  }

  async #initializeDatabase() {
    this.db = await datastore(this.config.database);
    await this.db.initialize();
    this.log.info('📚  Database initialized.');
    await this.executeHook('afterDatabaseInitialized');
  }

  async lift() {
    const { host, port } = this.config.server;
    const normalizedPort = parseInt(port, 10);
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

  // Hook system
  registerHook(hookName, fn) {
    if (!this.#hooks[hookName]) {
      this.#hooks[hookName] = [];
    }
    this.#hooks[hookName].push(fn);
  }

  async executeHook(hookName, ...args) {
    if (this.#hooks[hookName]) {
      for (const fn of this.#hooks[hookName]) {
        try {
          await fn(...args);
        } catch (error) {
          this.log.error(`Error executing hook "${hookName}": ${error.message}`);
        }
      }
    }
  }

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
}

export default Cambusa;
