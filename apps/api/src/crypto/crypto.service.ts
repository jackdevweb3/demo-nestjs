import { Injectable } from '@nestjs/common';
import { createECDH, ECDH, generateKeyPairSync } from 'crypto';

@Injectable()
export class CryptoService {
    private readonly keyPair: { privateKey: string; publicKey: string };

    es256() {

        const { privateKey, publicKey } = generateKeyPairSync('ec', {
            namedCurve: 'prime256v1', // Corresponds to P-256 for ES256
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });

        const keyPair = {
            privateKey,
            publicKey,
        };

        return keyPair;
    }


}