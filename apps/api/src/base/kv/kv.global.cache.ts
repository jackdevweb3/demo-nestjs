import { Injectable } from "@nestjs/common";

import { KVService } from "./kv.service";
import { SimpleLogger } from "../simpleLogger/simpleLogger";
import { InjectLogger } from "../../log/decorators/logger.inject";
import { ILogger } from "../../log/interfaces/logger.interface";

@Injectable()
export class KVGlobalCache {
  static EX_NEVER = 0;
  static EX_DEFAULT_SECONDS = 300;
  static EX_120_SECONDS = 120;
  static EX_10_SECONDS = 10;
  static EX_1_DAY = 24 * 60 * 60;

  logger: SimpleLogger;

  constructor(
    readonly kvService: KVService,
    @InjectLogger() private readonly iLogger: ILogger,
  ) {
    this.logger = new SimpleLogger().setLogger(
      KVGlobalCache.name,
      this.iLogger,
    );
  }

  //functions
  // GET
  async get(key: string): Promise<string> {
    const obj = await this.kvService.get(key);
    if (obj) {
      this.logger.debug(`KV-Cache-GET[${key}]:${obj}`);
    } else {
      this.logger.debug(`KV-Cache-MISS[${key}]`);
    }
    return obj;
  }
  // SET
  async set(key: string, value: any, expireSeconds: number) {
    if (value === null || value === undefined) {
      this.logger.warn(`KV-Cache-IGNORE-NULL[${key}]`);
      return;
    }

    await this.kvService.set(key, value, expireSeconds);
    this.logger.debug(`KV-Cache-SET[${key}]:${value}`);
  }

  async getObj<T>(key: string) {
    const obj = await this.kvService.getObj<T>(key);
    if (obj) {
      this.logger.debug(`KV-Cache-GET-OBJ[${key}]`);
    } else {
      this.logger.debug(`KV-Cache-MISS-OBJ[${key}]`);
    }
    return obj;
  }

  async setObj(key: string, value: object, expireSeconds: number) {
    if (value === null || value === undefined) {
      this.logger.warn(`KV-Cache-IGNORE-NULL[${key}]`);
      return;
    }
    await this.kvService.setObj(key, value, expireSeconds);
    this.logger.debug(`KV-Cache-SET-OBJ[${key}]`);
  }

  async delObj(key: string) {
    this.logger.debug(`KV-Cache-DEL-OBJ[${key}]`);
    return this.kvService.del(key);
  }
}
