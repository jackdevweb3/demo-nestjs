import { Global, Module } from '@nestjs/common';

import { JWTAuthModule } from '../base/auth/jwt-auth.module';
import { PersistenceModule } from '../persistence/persistence.module';

import { AuthorizedUser } from './AuthorizedUser';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [JWTAuthModule, PersistenceModule],
  controllers: [AuthController],
  providers: [AuthorizedUser, AuthService, ],
  exports: [AuthorizedUser, AuthService],
})
export class AuthModule { }
