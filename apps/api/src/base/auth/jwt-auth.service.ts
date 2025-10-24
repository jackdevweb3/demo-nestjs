import type {Request as ExpressRequest} from 'express';
import {Injectable, Inject} from '@nestjs/common';
import {REQUEST} from '@nestjs/core';
import {JwtService, JwtSignOptions} from '@nestjs/jwt';

import {ILogger} from '../../log/interfaces/logger.interface';
import {InjectLogger} from '../../log/decorators/logger.inject';
import {BearedUser} from './BearedUser';
import {md5} from 'js-md5';
import {LoggerWithUserInfo} from '../../log/logger.userinfo';
import {constant} from '@repo/helper';

@Injectable()
export class JWTAuthService {
    private logger: LoggerWithUserInfo;

    constructor(
        private readonly jwtService: JwtService,
        @InjectLogger() private readonly iLogger: ILogger,
        @Inject(REQUEST) private readonly request: Request,
    ) {
        this.logger = new LoggerWithUserInfo(this.iLogger.getLogger(JWTAuthService.name), this.request);
    }

    async grantToken(payload: BearedUser): Promise<string> {
        const options: JwtSignOptions = {
            header: {
                kid: 'default',
                alg: "ES256"
            }
        }
        const token = this.jwtService.sign(payload, options);
        this.logger.debug(`signin with payload:${JSON.stringify(payload)}, got token:${token}`);
        return token;
    }

    passwordVerify(id: string, passwordHash: string, password: string) {
        const encrypt = this.passwordEncrypt(id, password);
        return encrypt === passwordHash;
    }

    passwordEncrypt(id: string, password: string): string {
        const encrypt = md5(id + password);
        return encrypt;
    }

    jwt_verify(jwt: string): any {
        const verifyResult = this.jwtService.verify(jwt);
        this.logger.debug(`verify_result:${JSON.stringify(verifyResult)}`);
        return verifyResult;
    }

    jwt_decode(jwt: string, requireVerify: boolean = false): any {

        if (requireVerify === true) {
            this.jwt_verify(jwt);
        }

        const decodeResult = this.jwtService.decode(jwt);
        this.logger.debug(`decode_result:${JSON.stringify(decodeResult)}`);
        return decodeResult;
    }

    decodeAuthUserFromHttpRequest(request: ExpressRequest): BearedUser {
        let jwt = '';

        if (request && request.headers && request.headers.authorization) {
            jwt = request.headers.authorization.replace('Bearer', '').trim();
        } else if (request && request.cookies && request.cookies[constant.StorageKeys.token]) {
            // handle cookie based jwt for temporary use
            jwt = request.cookies[constant.StorageKeys.token].trim();
        } else if (
            request &&
            request.cookies &&
            request.cookies[constant.StorageKeys.token]
        ) {
            // handle cookie based jwt for temporary use
            jwt = request.cookies[constant.StorageKeys.token].trim();
        } else if (request && request.cookies && request.cookies[constant.StorageKeys.token]) {
            // handle cookie based jwt for temporary use
            jwt = request.cookies[constant.StorageKeys.token].trim();
        }
        if (!jwt) {
            this.logger.error('cannot find token info from [token]');
            return null;
        }
        const rawRes = this.jwt_decode(jwt, true);
        if (rawRes) {
            const ur = rawRes as BearedUser;
            const user: BearedUser = {
                account: ur.account || '',
                extraInfo: ur.extraInfo || '',
                iat: ur.iat || 0,
                exp: ur.exp || 0,
            };
            return user;
        }
        return null;
    }
}
