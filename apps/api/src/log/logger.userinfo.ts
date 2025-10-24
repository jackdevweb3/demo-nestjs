import { Logger } from './interfaces/logger.interface';
import { Fields } from '../base/constant';

/**
 * Logger with user info
 */
export class LoggerWithUserInfo {
  constructor(
    private readonly logger: Logger,
    private readonly request: Request,
  ) { }

  getLogger = () => {
    return this.logger;
  };

  setContext = () => {
    if (this.request) {
      this.logger.addContext(Fields.accountInIM, this.request.headers[Fields.accountInIM]);
      this.logger.addContext(Fields.correlationId, this.request.headers[Fields.correlationId]);
    }
  };

  debug(message: any): void {
    this.setContext();
    this.logger.debug(message);
  }

  info(message: any): void {
    this.setContext();
    this.logger.info(message);
  }

  warn(message: any): void {
    this.setContext();
    this.logger.warn(message);
  }

  error(message: any): void {
    this.setContext();
    this.logger.error(message);
  }

  log(message: any): void {
    this.setContext();
    this.logger.log(message);
  }
}
