import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Logger, ILogger } from "../../log/interfaces/logger.interface";
import { Fields } from "../constant";
import { stringify } from "circular-json-es6";
import { NormalBusinessException } from "./NormalBusinessException";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger: Logger;
  constructor(private readonly iLogger: ILogger) {
    this.logger = iLogger.getLogger(GlobalExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.addContext(
      Fields.accountInIM,
      request.headers[Fields.accountInIM],
    );
    this.logger.addContext(
      Fields.correlationId,
      request.headers[Fields.correlationId],
    );

    if (exception instanceof NormalBusinessException) {
      //convert NormalBusinessException to HTTP 200 response
      const exp = exception as NormalBusinessException;
      const responseBody = exp.getResponseBody();
      this.logger.error(
        `***Return NormalBusinessException: ${stringify(responseBody)}`,
      );

      response.status(exp.getStatus()).json(responseBody);
    } else {
      if (exception instanceof HttpException) {
        this.logger.error(`***exception : ${stringify(exception)}`);
        this.logger.error("***exception stack: ", (exception as Error).stack);
        response.status(status).json(exception);
      } else {
        const msg = (exception as Error).message;
        this.logger.error(`***exception : ${msg}`);
        this.logger.error("***exception stack: ", (exception as Error).stack);
        response.status(status).json({ message: msg });
      }
    }
  }
}
