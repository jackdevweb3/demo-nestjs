import { Global, Module } from '@nestjs/common';

import { SimpleLogger } from './simpleLogger';

@Global()
@Module({
  providers: [SimpleLogger],
  exports: [SimpleLogger],
})
export class SimpleLoggerModule {}
