import 'dotenv/config';
import { Elysia } from 'elysia';

import loadMiddlewares from '@lib/middlewaresLoader';
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
    await this.executeHook('beforeInitialization');
    await this.#loadHooks();
    await this.executeHook('afterHooksLoaded');
    await this.#loadMiddlewares();
    await this.#loadRoutes();
    await this.#loadHelpers();
    await this.#initializeDatabase();
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

  async startServer() {
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
}

export default Cambusa;
