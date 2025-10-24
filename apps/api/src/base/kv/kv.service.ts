import {Redis} from 'ioredis';

import {RedisService} from '@liaoliaots/nestjs-redis';
import {Injectable} from '@nestjs/common';


import Redlock from 'redlock';
import {SimpleLogger} from '../simpleLogger/simpleLogger';
import {InjectLogger} from '../../log/decorators/logger.inject';
import {ILogger} from '../../log/interfaces/logger.interface';

@Injectable()
export class KVService {
    private client: Redis;

    redlock: any;
    readonly logger: SimpleLogger;

    constructor(
        private redisService: RedisService,
        @InjectLogger() private readonly iLogger: ILogger,
    ) {
        const client = this.getClient();
        this.client = client;
        this.redlock = new Redlock([this.client], {
            retryDelay: 200, // time in ms
            retryCount: 10,
        });
        this.logger = new SimpleLogger().setLogger(KVService.name, this.iLogger);
    }

    getClient(): Redis {
        return this.redisService.getClient();
    }

    checkClient() {
        if (!this.client) {
            this.client = this.getClient();
        }
    }

    // SET
    async set(key: string, value: any, seconds?: number) {
        this.checkClient();
        if (!seconds) {
            await this.client.set(key, value);
        } else {
            await this.client.set(key, value, 'EX', seconds);
        }
    }

    async setObj(key: string, value: object, seconds?: number) {
        this.checkClient();
        const str = JSON.stringify(value);
        return this.set(key, str, seconds);
    }

    async getObj<T>(key: string) {
        this.checkClient();
        const data = await this.get(key);
        if (!data) return null;
        return JSON.parse(data) as unknown as T;
    }

    // GET
    async get(key: string): Promise<string> {
        this.checkClient();
        const data = await this.client.get(key);
        if (!data) return null;
        return data;
    }

    // DEL
    async del(key: string) {
        this.checkClient();
        await this.client.del(key);
    }

    // zadd
    async zadd(key: string, score: number, value: string) {
        this.checkClient();
        await this.client.zadd(key, score, value);
    }

    async incr(key: string) {
        this.checkClient();
        return this.client.incr(key);
    }

    // zrange
    async zrange(key: string, start: number, stop: number) {
        this.checkClient();
        const data = await this.client.zrange(key, start, stop);
        if (!data) return;
        return data;
    }

    // zrem
    async zrem(key: string, member: string) {
        this.checkClient();
        await this.client.zrem(key, member);
    }

    async lock(key: string, ttl: number): Promise<any> {
        try {
            const et = await this.client.exists(key);
            if (!et) {
                this.logger.info(`not exists key=${key}\t${et}`);
                return null;
            }
            const lockKey = `lock4${key}`;
            const lock = await this.redlock.lock(lockKey, ttl);
            this.logger.info(
                `redis lock for key=${key},ttl=${ttl},lockValue=${lock.value}lockKey=${lockKey}`,
            );
            return lock;
        } catch (err) {
            this.logger.error(err);
        } finally {
        }
    }

    async unlock(lock: any) {
        try {
            lock.unlock();
            this.logger.info(`redis unlock with lockValue=${lock.value}`);
        } catch (err) {
            this.logger.error(err);
        }
    }

    // BATCH SET with pipeline
    async batchSet(list: { key: string; value: any }[], seconds?: number) {
        this.checkClient();
        const pipeline = this.client.pipeline();

        for (const item of list) {
            if (!seconds) {
                pipeline.set(item.key, item.value);
            } else {
                pipeline.set(item.key, item.value, 'EX', seconds);
            }
        }

        pipeline.exec((err, results) => {
            // `err` is always null, and `results` is an array of responses
            // corresponding to the sequence of queued commands.
            // Each response follows the format `[err, result]`.
        });
    }
}
