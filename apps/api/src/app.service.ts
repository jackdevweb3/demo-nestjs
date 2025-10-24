import { Injectable } from "@nestjs/common";

import { PrismaService } from "./persistence/prisma/prisma.service";
import { KVService } from "./base/kv/kv.service";
import { SimpleLogger } from "./base/simpleLogger/simpleLogger";
import { InjectLogger } from "./log/decorators/logger.inject";
import { ILogger } from "./log/interfaces/logger.interface";

@Injectable()
export class AppService {
  readonly logger: SimpleLogger;
  constructor(
    @InjectLogger() private readonly iLogger: ILogger,
    private prisma: PrismaService,
    private kvService: KVService,
  ) {
    this.logger = new SimpleLogger().setLogger(AppService.name, this.iLogger);
  }

  async checkStatus(): Promise<{
    a: string;
    b: string;
  }> {
    const status = { a: "", b: "" }; //a=db, b=cache
    const dbResult = await this.prisma.$queryRaw<string[]>`SELECT NOW()`;
    this.logger.debug(`dbResult:${JSON.stringify(dbResult)}`);
    if (dbResult && dbResult.length > 0) {
      status.a = `connected: ${JSON.stringify(dbResult)}`;
    } else {
      status.a = "failed to connect";
    }

    const key = "w-connect-to-cache-test";
    await this.kvService.set(key, new Date().toISOString(), 60);
    const kvCacheResult = await this.kvService.get(key);
    this.logger.debug(`kvCacheResult:${kvCacheResult}`);
    if (kvCacheResult && kvCacheResult.length > 0) {
      status.b = `connected: ${kvCacheResult}`;
    } else {
      status.b = "failed to connect";
    }

    return status;
  }
}
