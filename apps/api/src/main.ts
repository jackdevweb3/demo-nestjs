import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {envDetect} from "@repo/helper";
import {join} from "path"; 

import {$} from "@cspotcode/zx";
import {Logger, ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {NestExpressApplication} from "@nestjs/platform-express";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

import {AppModule} from "./app.module"; 
import {GlobalExceptionFilter} from "./base/exception/global-exception.filter";
import {ILogger} from "./log/interfaces/logger.interface";
 
const logger = new Logger("EntryPoint");

async function bootstrap() {
    if (process.env && process.env.PRINT_PROCESS_ENV==='true') {
        console.debug(`=====process.env=====`);
        console.debug(process.env);
        console.debug(`=====process.env=====`);
    }

    const showDebugLog =
        (process.env.SHOW_DEBUG_LOG || "true").toLowerCase() ===
        "true".toLowerCase();
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger:
            showDebugLog === false
                ? ["log", "error", "warn"]
                : ["log", "error", "warn", "debug", "verbose"],
    });

    // https://expressjs.com/en/guide/behind-proxies.html
    app.set("trust proxy", 1);

    // migrate database on startup
    // or you can manually execute the script to sync database

    //format prisma

    let ignorePrismaDeploy = false;
    if (process.env.IGNORE_PRISMA_DEPLOY !== undefined) {
        ignorePrismaDeploy =
            process.env.IGNORE_PRISMA_DEPLOY.toLowerCase() === "true";
    }
    console.log("ignorePrismaDeploy:", ignorePrismaDeploy);
    if (ignorePrismaDeploy === false) {
        if (envDetect.isProd) {
            const prismaSchema = `${join(__dirname, "./prisma/schema.prisma")}`;
            const prismaJs = `${join(__dirname, "./node_modules/prisma/build/index.js")}`;
            await $`${prismaJs} format --schema=${prismaSchema}`;
            await $`${prismaJs} generate --schema=${prismaSchema}`;
            await $`${prismaJs} migrate deploy --schema=${prismaSchema}`;
        }
    }

    app.use(cookieParser());

    // allow cros if domains contains any of corsHostnameWhitelist
    const corsHostnameWhitelist = [
        "localhost",
        "127.0.0.1",
        "::1",
        "chrome-extension://" 
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            } 
            const url = new URL(origin);
            if (corsHostnameWhitelist.includes(url.hostname)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    });

    const iLogger = app.get<ILogger>("LOG_PROVIDER");
    app.useGlobalFilters(new GlobalExceptionFilter(iLogger));

    //eg. To transform string to number for controller parameters
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.use(bodyParser.json({limit: "100kb"}));

    app.setGlobalPrefix("api", {
        exclude: ["api-doc"],
    });

    // hide api doc for production env, to prevent api analysis
    if (process.env.ENABLE_API_DOC_FOR_DEVELOPMENT === "true") {
        const config = new DocumentBuilder()
            .setTitle("platform API")
            .setDescription("Api Docs for platform API")
            .setVersion("1.0")
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("api-doc", app, document);
    }

    const PORT = process.env.PORT_API || 3001;

    process.on("SIGTERM", async () => {
        logger.log("SIGTERM signal received.");
        await app.close();
        process.exit(1);
    });
    process.on("SIGINT", async function () {
        logger.log("SIGINT signal received.");
        await app.close();
        process.exit(2);
    });

    await app.listen(PORT);
    logger.log(`Server running on http://localhost:${PORT}`);
}
 

bootstrap(); 
