import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTConfig } from '../JWTConfig';
import { JWTConfigItem } from '../JWTConfigItem';

@Injectable()
export class KeyManagementService {
    private readonly publicKeys: Map<string, JWTConfigItem>;

    constructor(private readonly configService: ConfigService) {
        this.publicKeys = new Map<string, JWTConfigItem>();
        this.loadPublicKeys();
    }

    // 从配置中加载所有公钥到 Map 中，方便快速查找
    private loadPublicKeys(): void {
        const keyConfigs = JWTConfig.keys;

        if (!keyConfigs || keyConfigs.length === 0) {
            // 在生产环境中，这里应该用 Logger 记录一个严重的错误
            console.error('FATAL: No public keys configured for JWT verification.');
            return;
        }

        for (const key of keyConfigs) {
            this.publicKeys.set(key.kid, key);
            console.log(`Loaded public key for kid: ${key.kid}`);
        }
    }

    // 根据 kid 查找公钥
    public getKeyConfigItem(kid: string): JWTConfigItem | null {
        if (!kid || !this.publicKeys.has(kid)) {
            return null;
        }
        return this.publicKeys.get(kid);
    }
}