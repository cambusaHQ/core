import pino from 'pino';
import pinoPretty from 'pino-pretty';

/**
 * Custom log levels extending Pino's default levels
 * @type {Object}
 * @property {number} http - Level for HTTP-related logs (25, below 'info')
 * @property {number} verbose - Level for detailed logs (5)
 * @property {number} silly - Level for extremely detailed logs (1)
 */
const customLevels = {
  http: 25, // below 'info'
  verbose: 5,
  silly: 1,
};

/**
 * Creates and configures a Pino logger instance
 * @param {Object} cambusa - The Cambusa instance containing configuration
 * @returns {Object} Configured Pino logger instance
 */
export const logger = (cambusa) => {
  // Determine log level from config or environment
  const logLevel =
    cambusa.config.logger?.level ||
    (cambusa.config.env === 'development' ? 'debug' : 'info');

  return pino(
    {
      customLevels,
      level: logLevel,
      transport:
        cambusa.config.env === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                customLevels: 'http:25,verbose:5,silly:1',
                customColors: 'http:blue,verbose:cyan,silly:gray',
                useOnlyCustomProps: false,
              },
            }
          : undefined,
    },
    cambusa.config.env === 'development' ? pinoPretty() : undefined
  ); // Use pinoPretty for prettier logs in development mode
};

export default logger;
