import pino from 'pino';
import pinoPretty from 'pino-pretty';

const customLevels = {
  http: 25, // below 'info'
  verbose: 5,
  silly: 1,
};

export const logger = (cambusa) => {
  const logLevel = cambusa.config.logger?.level || (cambusa.config.env === 'development' ? 'debug' : 'info');
  return pino({
    customLevels,
    level: logLevel,
    transport: cambusa.config.env === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        customLevels: 'http:25,verbose:5,silly:1',
        customColors: 'http:blue,verbose:cyan,silly:gray',
        useOnlyCustomProps: false,
      },
    } : undefined,
  }, cambusa.config.env === 'development' ? pinoPretty() : undefined);  // Use pinoPretty in dev mode
}

export default logger;
