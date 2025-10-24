/* eslint-disable @typescript-eslint/no-explicit-any */
import { inspect } from 'util';

import { Logger, ILogger } from '../../log/interfaces/logger.interface';

export class SimpleLogger {
  private logger: Logger;
  modulePrefix = 'unknown';

  constructor() { }
  setLogger(modulePrefix: string = '', iLogger: ILogger) {
    this.modulePrefix = modulePrefix;
    this.logger = iLogger.getLogger(modulePrefix);
    return this;
  }
  
  prefix() {
    return `[${this.modulePrefix}] `;
  }

  addContext(key: string, value: any) {
    this.logger.addContext(key, value);
  }

  constructMessage(msgObj: any[]) {
    let message = this.prefix();
    if (msgObj && msgObj.length > 0) {
      for (let index = 0; index < msgObj.length; index++) {
        const element = msgObj[index];
        if (typeof element === 'string') {
          message += ` ${element}`;
        } else if (element instanceof Error) {
          message += ` ${inspect(element, true, 5, false)}`;
        } else {
          message += ` ${JSON.stringify(element)}`;
        }
      }
    }
    return message;
  }

  debug(...msgObj: any[]) {
    this.logger.debug(this.constructMessage(msgObj));
  }

  info(...msgObj: any[]) {
    this.logger.info(this.constructMessage(msgObj));
  }

  warn(...msgObj: any[]) {
    this.logger.warn(this.constructMessage(msgObj));
  }

  verbose(...msgObj: any[]) {
    this.logger.trace(this.constructMessage(msgObj));
  }

  error(...msgObj: any[]) {
    this.logger.error(this.constructMessage(msgObj));
  }
}
