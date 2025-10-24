import {Injectable, ExecutionContext, NestInterceptor, CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {stringify} from 'circular-json-es6';
import {Logger, ILogger} from '../interfaces/logger.interface';
import {InjectLogger} from '../decorators/logger.inject';
import {AuthorizedUser} from '../../auth/AuthorizedUser';
import {strUtil} from '@repo/helper';
import {Fields} from '../../base/constant';

@Injectable()
export class Log4jsInterceptor implements NestInterceptor {
    private logger: Logger;

    constructor(
        @InjectLogger() private readonly iLogger: ILogger,
        private readonly authorizedUser: AuthorizedUser,
    ) {
        this.logger = this.iLogger.getLogger(Log4jsInterceptor.name);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpRequest = context.switchToHttp().getRequest();
        const correlationId = (httpRequest.headers['x-correlation-id'] || strUtil.uuid()).toString();
        const accountInIM =
            this.authorizedUser.get()?.account ||
            httpRequest.body[Fields.accountInIM];
        this.logger.addContext(Fields.accountInIM, accountInIM);
        this.logger.addContext(Fields.correlationId, correlationId);
        httpRequest.headers[Fields.accountInIM] = accountInIM;
        httpRequest.headers[Fields.correlationId] = correlationId;
        this.logger.info('REQUEST ==>: ' + this.requestFormat(httpRequest));
        return next.handle().pipe(
            tap((httpResponse) => {
                this.logger.info('<=== RESPONSE: ' + this.responseFormat(httpResponse, httpRequest));
            }),
        );
    }

    requestFormat(httpRequest: any): string {
        return stringify({
            url: httpRequest.url,
            method: httpRequest.method,
            params: httpRequest.params,
            query: httpRequest.query,
            body: httpRequest.body,
            // httpVersion: httpRequest.httpVersion,
            // headers: httpRequest.headers,
            // route: httpRequest.route,
            accountInIM: httpRequest.headers[Fields.accountInIM],
            correlationId: httpRequest.headers[Fields.correlationId]
        });
    }

    responseFormat(httpResponse: any, httpRequest: any): string {
        return stringify(httpResponse) + " <=== REQUEST: " + stringify({
            url: httpRequest.url,
            // params: httpRequest.params,
            // query: httpRequest.query,
            // body: httpRequest.body,
            accountInIM: httpRequest.headers[Fields.accountInIM],
            correlationId: httpRequest.headers[Fields.correlationId]
        });
    }
}
