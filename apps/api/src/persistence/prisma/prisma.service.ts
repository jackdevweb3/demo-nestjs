import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';


import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging
            log: (process.env.DATABASE_LOG ? process.env.DATABASE_LOG.split(',') : undefined) as any,
        });

        this.$use(async (params, next) => {

            console.log(`prisma query`);
            return next(params);
        }

        );
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();

        if (process.env.DATABASE_LOG) {
            process.env.DATABASE_LOG.split(',').forEach((log) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.$on(log, async (e) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(`${e.query} ${e.params}`);
                });
            });
        }

        console.log('Prisma client connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('Prisma client disconnected');
    }
}
