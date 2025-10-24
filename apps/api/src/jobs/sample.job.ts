import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { SimpleLogger } from '../base/simpleLogger/simpleLogger';
import { InjectLogger } from '../log/decorators/logger.inject';
import { ILogger } from '../log/interfaces/logger.interface';
import { isEnableCronJob, isMainInstance } from '../base/util';
import { PrismaService } from '../persistence/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SampleJob {
  isRunningFlag: boolean;
  readonly logger: SimpleLogger;


  constructor(
    @InjectLogger() private readonly iLogger: ILogger,
    private prisma: PrismaService,

  ) {
    this.logger = new SimpleLogger().setLogger(SampleJob.name, this.iLogger);
    this.isRunningFlag = false;
  }

  /**
   *
   * @memberof SampleJob
   */
  // run every 5 minute
  @Cron('0 */5 * * * *')
  async cronjob() {
    if (!isMainInstance()) {
      return;
    }
    if (!isEnableCronJob()) {
      return;
    }

    if (this.isRunningFlag) {
      this.logger.warn(`isRunningFlag=${this.isRunningFlag}`);
      return;
    }

    try {
      // read from db
      this.isRunningFlag = true;


      //do something

      this.logger.info(`finished`);
    } catch (error) {
      console.error(``, error);
    } finally {
      this.isRunningFlag = false;
    }
  }

}
