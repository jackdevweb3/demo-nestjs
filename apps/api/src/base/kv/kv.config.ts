import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import { SentinelAddress } from 'ioredis';

export function parseSentinelHosts(sentinel_hosts: string): Partial<SentinelAddress>[] {
  const parsedHosts: SentinelAddress[] = [];
  const hosts = sentinel_hosts.split(',');
  for (const host of hosts) {
    const items = host.split(':');
    parsedHosts.push({
      host: items[0],
      port: Number(items[1]),
    });
  }
  return parsedHosts;
}
export function loadRedisConnectionConfig(): RedisModuleOptions {
  if ((process.env.USE_SENTINEL || '').toLowerCase() === 'true')
    return {
      config: {
        role: 'master',
        password: process.env.SENTINEL_REDIS_PWD,
        db: Number(process.env.SENTINEL_REDIS_DB),
        name: process.env.SENTINEL_NAME,
        sentinels: parseSentinelHosts(process.env.SENTINEL_HOSTS),
        keepAlive: 3000,
      },
    };
  else {
    return {
      config: {
        keepAlive: 3000,
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PWD,
        db: Number(process.env.REDIS_DB),
      },
    };
  }
}
