import { Global, Module } from '@nestjs/common';

import { InnerLoggerModule } from './logger.module';
import { Log4jsInterceptor } from './interceptor/log4js.interceptor';

@Global()
@Module({
  imports: [
    InnerLoggerModule.forRootAsync({
      level: process.env.SHOW_DEBUG_LOG == 'true' ? 'debug' : 'info',
    }),
  ],
  providers: [Log4jsInterceptor],
  exports: [Log4jsInterceptor],
})
export class LoggerModule { }
