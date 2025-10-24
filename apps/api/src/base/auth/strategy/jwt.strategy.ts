import {ExtractJwt, Strategy} from 'passport-jwt';

import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import {BearedUser} from '../BearedUser';
import {KeyManagementService} from './key-management.service';
// 定义 done 回调函数的类型，使代码更清晰
type DoneCallback = (err: Error | null, payload: any | false) => void;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly keyService: KeyManagementService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            ignoreExpiration: false, // Do not ignore token expiration
            // 使用 secretOrKeyProvider 代替 secretOrKey
            secretOrKeyProvider: (
                request: any,
                rawJwt: string,
                done: DoneCallback,
            ) => {

                try {

                    // 1. 解码 JWT 获取 Header，此时不验证签名
                    const decodedToken = jwt.decode(rawJwt, {complete: true});

                    if (!decodedToken || typeof decodedToken === 'string') {
                        return done(new UnauthorizedException('Invalid token format'), false);
                    }

                    //kid 默认是im
                    const kid = decodedToken.header.kid || 'dev';
                    // console.log('JwtStrategy kid:', kid);
                    if (!kid) {
                        return done(new UnauthorizedException('Token is missing "kid" in header'), false);
                    }

                    // 2. 使用 kid 从我们的服务中查找对应的公钥
                    const keyConfigItem = this.keyService.getKeyConfigItem(kid);
                    // console.log('keyConfigItem:', keyConfigItem);
                    if (!keyConfigItem || !keyConfigItem.publicKey) {
                        return done(new UnauthorizedException(`Unknown key ID (kid: ${kid})`), false);
                    }

                    // 3. 将找到的公钥通过回调函数 done 返回
                    // passport-jwt 内部会使用这个公钥来验证 JWT 签名
                    done(null, keyConfigItem.publicKey);

                } catch (error: any) {
                    done(error, false);
                }

            }
        });
    }

    // 这个 validate 方法会在签名验证成功后被调用
    async validate(payload: any): Promise<BearedUser> {
        // console.log('JwtStrategy payload:', payload);
        // payload 是解码后的 JWT 载荷
        const userData: BearedUser = {
            ...payload,
            id: payload.id || payload.sub || '',
            name: payload.name || payload.first_name || '',
        };
        // console.log('JwtStrategy', " userData:", userData);
        return userData;
    }
}
