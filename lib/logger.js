import pino from 'pino';
import config from '@/config';
import pinoPretty from 'pino-pretty';

const logLevel = config.logger?.level || (config.env === 'development' ? 'debug' : 'info');
const customLevels = {
  http: 25, // below 'info'
  verbose: 5,
  silly: 1,
};
const logger = pino({
  customLevels,
  level: logLevel,
  transport: config.env === 'development' ? {
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
}, config.env === 'development' ? pinoPretty() : undefined);  // Use pinoPretty in dev mode

export default logger;
