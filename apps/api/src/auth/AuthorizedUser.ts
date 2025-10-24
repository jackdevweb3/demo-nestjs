import {Request} from 'express';
import {Global, Inject, Injectable, Scope} from '@nestjs/common';
import {REQUEST} from '@nestjs/core';
import {BearedUser} from '../base/auth/BearedUser';

// import {JWTAuthService} from '../base/auth/jwt-auth.service';

@Global()
@Injectable({scope: Scope.REQUEST})
export class AuthorizedUser {
    constructor(
        @Inject(REQUEST) private readonly request: Request,
        
    ) {
    }

    get(): BearedUser {
         
        if (this.request && (this.request as any).user) {
            return (this.request as any).user as BearedUser || null;
        }
        return null;
    }

}
