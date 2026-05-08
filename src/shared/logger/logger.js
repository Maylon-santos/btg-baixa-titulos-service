const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const env = require('../../config/env');

const { combine, timestamp, printf, colorize, json } = winston.format;

const simpleFormat = printf(({ level, message, timestamp, ...meta }) => {
  const hasMeta = Object.keys(meta).length > 0;

  return `${timestamp} ${level} ${message}${
    hasMeta && env.log.detailed ? ` ${JSON.stringify(meta)}` : ''
  }`;
});

const logger = winston.createLogger({
  level: env.log.level,
  silent: !env.log.enabled,
  defaultMeta: {
    service: 'btg-baixa-titulos-service'
  },
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        simpleFormat
      )
    }),

    new DailyRotateFile({
      dirname: env.log.dir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10mb',
      maxFiles: '30d',
      zippedArchive: true,
      format: combine(timestamp(), json())
    }),

    new DailyRotateFile({
      dirname: env.log.dir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10mb',
      maxFiles: '30d',
      zippedArchive: true,
      format: combine(timestamp(), json())
    })
  ]
});

module.exports = logger;