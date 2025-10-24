import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Global, Module } from "@nestjs/common";

import { LoggerModule } from "../../log/loggerModule";
import { KVService } from "./kv.service";
import { KVGlobalCache } from "./kv.global.cache";
import { loadRedisConnectionConfig } from "./kv.config";

@Global()
@Module({
  imports: [RedisModule.forRoot(loadRedisConnectionConfig()) ],
  controllers: [],
  providers: [KVService, KVGlobalCache],
  exports: [KVService,  KVGlobalCache],
})
export class KVModule {}
