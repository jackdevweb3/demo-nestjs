import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { PrismaService } from '../persistence/prisma/prisma.service';
import { ILogger } from '../log/interfaces/logger.interface';
import { InjectLogger } from '../log/decorators/logger.inject';
import { SimpleLogger } from '../base/simpleLogger/simpleLogger';
import { LoginPayload } from './model/LoginPayLoad';
import { JWTAuthService } from '../base/auth/jwt-auth.service';

@Injectable()
export class AuthService {


  private logger: SimpleLogger;
  constructor(
    @InjectLogger() private readonly iLogger: ILogger,
    @Inject(REQUEST) private readonly request: Request,
    private prisma: PrismaService,
    private readonly jwtAuthService: JWTAuthService,

  ) {
    this.logger = new SimpleLogger().setLogger(AuthService.name, this.iLogger);
  }

  async login(payload: LoginPayload): Promise<string | null> {
    if (payload && payload.account) {
      const token = await this.jwtAuthService.grantToken({
        account: payload.account,
        extraInfo: 'test only from defaut service',
      });
      return token;
    }

    return null;
  }

  async queryMe(account: string) {
    return await this.prisma.userProfile.findFirst({
      where: {
        email: account
      }
    });
  }

}
