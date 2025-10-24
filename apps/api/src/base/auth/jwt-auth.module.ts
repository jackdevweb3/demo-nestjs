import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JWTAuthService } from './jwt-auth.service';
import { JWTConfig } from './JWTConfig';
import { JwtStrategy } from './strategy/jwt.strategy';
import { KeyManagementService } from './strategy/key-management.service';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({

      // 这里只是为 sign 方法提供默认选项，对于 verify 来说不重要
      // 如果你的服务也需要签发 JWT，可以在这里配置 privateKey 等

      //jwt的验证是 通过 jwt.strategy

      privateKey: JWTConfig.keys[0].privateKey,
      signOptions: {
        algorithm: JWTConfig.keys[0].algorithm as any,
        expiresIn: JWTConfig.keys[0].expiresIn
      },

      publicKey: JWTConfig.keys[0].publicKey,
      verifyOptions: {
        algorithms: [JWTConfig.keys[0].algorithm as any],  //指定算法
        ignoreExpiration: false,                //禁止过期
        allowInvalidAsymmetricKeyTypes: false, //禁止无效的非对称密钥类型
      },
    }),
  ],
  controllers: [],
  providers: [JwtStrategy, JWTAuthService, KeyManagementService],
  exports: [JwtStrategy, JWTAuthService],
})
export class JWTAuthModule { }
