// - Npm modules
const { createLogger, format, transports } = require('winston');

/*
 * Log each level in its files
 * https://github.com/winstonjs/winston/issues/614#issuecomment-405015322
 * https://github.com/winstonjs/winston#filtering-info-objects
 */
const errorFilter = format((info) => (info.level === 'error' ? info : false));
const warnFilter = format((info) => (info.level === 'warn' ? info : false));
const infoFilter = format((info) => (info.level === 'info' ? info : false));

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'hl_bot' },
  transports: [
    new transports.File({
      filename: './logs/error.log',
      level: 'error',
      format: format.combine(
        errorFilter(),
      ),
    }),

    new transports.File({
      filename: './logs/warn.log',
      level: 'warn',
      format: format.combine(
        warnFilter(),
      ),
    }),

    new transports.File({
      filename: './logs/info.log',
      level: 'info',
      format: format.combine(
        infoFilter(),
      ),
    }),
  ],
});

logger.add(new transports.Console({
  format: format.combine(
    format.colorize(),
    format.simple(),
  ),
}));

module.exports = logger;
