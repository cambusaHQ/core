import pino from 'pino';
import config from '@/config';
import pinoPretty from 'pino-pretty';

const logLevel = config.logger?.level || (config.env === 'development' ? 'debug' : 'info');

const logger = pino({
  level: logLevel,
  transport: config.env === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
}, config.env === 'development' ? pinoPretty() : undefined);  // Use pinoPretty in dev mode

export default logger;
