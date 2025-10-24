import { CacheModule } from "@nestjs/cache-manager";
import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JWTAuthModule } from "./base/auth/jwt-auth.module";
import { KVModule } from "./base/kv/kv.module";

import { validationSchemaForEnv } from "./config/environment-variables";
import { ThrottlerBehindProxyGuard } from "./interceptor/throttler-behind-proxy.guard";

import { PersistenceModule } from "./persistence/persistence.module";

import { SimpleLogger } from "./base/simpleLogger/simpleLogger";

import { JobsModule } from "./jobs/jobs.module";
import { InjectLogger } from "./log/decorators/logger.inject";
import { ILogger } from "./log/interfaces/logger.interface";
import { AuthModule } from "./auth/auth.module";
import { CryptoModule } from "./crypto/crypto.module";
import { LoggerModule } from "./log/loggerModule";


//SPECIAL CODE to support JSON.stringify() with any BigInt value
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export async function getThrottlerModule() {
    await ConfigModule.envVariablesLoaded;
    if (process.env.ENABLE_THROTTLER === "true") {
        return ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60, // time window to log limit state, seconds
                    limit: 60, // how many requests will be allowed for each IP and single endpoint, in the ttl o'ntime window.
                },
            ],
        });
    }

    return ThrottlerModule.forRoot({
        throttlers: [
            {
                ttl: 60,
                limit: 999999,
            },
        ],
    });
}

@Module({
    imports: [
        getThrottlerModule(),

        CacheModule.register({ isGlobal: true }),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: validationSchemaForEnv,
        }),
        PersistenceModule,
        JWTAuthModule,
        LoggerModule,
        KVModule,

        AuthModule,
        JobsModule,
        CryptoModule

    ].filter((m) => m),
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerBehindProxyGuard, // IMPORTANT!!!
        },
        AppService,
        LoggerModule
    ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
    readonly logger: SimpleLogger;

    constructor(@InjectLogger() private readonly iLogger: ILogger) {
        this.logger = new SimpleLogger().setLogger(AppModule.name, this.iLogger);
    }

    async onModuleInit() {
        // init something
        this.logger.info("AppModule onModuleInit");
    }

    async onModuleDestroy() {
        this.logger.warn("AppModule onModuleDestroy");
    }
}
