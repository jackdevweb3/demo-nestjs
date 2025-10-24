import { Configuration } from 'log4js';
import { LogConfig } from './interfaces/logger.interface';
import { Fields } from '../base/constant';

// configuration guide: https://log4js-node.github.io/log4js-node/layouts.html
const layout = {
  type: 'pattern',
  pattern: '%[ [%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] [%x{user}] - %m %]',
  tokens: {
    user: function (logEvent) {
      return `${logEvent.context[Fields.accountInIM] || ''}|${logEvent.context[Fields.correlationId] || ''}`;
    },
  },
};

export class LoggerConfigService {
  constructor(private readonly logConfig: LogConfig) { }

  loader(): Configuration {
    return {
      appenders: {
        console: {
          type: 'console',
          layout: layout,
          level: 'debug',
        },
        app: {
          type: 'dateFile',
          filename: '~/demo-service/logs/app.log',
          pattern: 'yyyy-MM-dd',
          alwaysIncludePattern: true,
          maxLogSize: '10M',
          keepFileExt: true,
          compress: true,
          layout: layout,
        },
        appFilter: { type: 'logLevelFilter', appender: 'app', level: 'info' },
      },
      categories: {
        default: {
          appenders: ['console', 'appFilter'],
          level: this.logConfig.level || 'info',
        },
      },
      pm2: true,
    };
  }
}
