import {JWTConfigItem} from './JWTConfigItem';

export const JWTConfig: {
    keys: JWTConfigItem[]
} = {
    keys: [
        {
            kid: 'default',
            privateKey:
                (process.env.JWT_PRIVATEKEY || "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgpjSzkHM5aE99g0FX\noonYby81C7gLGcIAoaQ0b9FBItahRANCAASNDlodPX1kgr8Hu3ddvBYgJMVEtuC5\nwFlGYdVQB2yJ+Sk+/5ENX25wN8rBgcJ9pooU3nSv1F3LrtaIytKiQafx\n-----END PRIVATE KEY-----\n"),
            // 

            publicKey: (process.env.JWT_PUBLICKEY || "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjQ5aHT19ZIK/B7t3XbwWICTFRLbg\nucBZRmHVUAdsifkpPv+RDV9ucDfKwYHCfaaKFN50r9Rdy67WiMrSokGn8Q==\n-----END PUBLIC KEY-----\n"),
            //public key to verify jwt 
            algorithm: process.env.JWT_ALGORITHM || 'ES256',
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        }  
    ]

};
console.log(`JWTConfig:`, JWTConfig.keys.flatMap(t=>"kid:"+t.kid+", algorithm:"+t.algorithm));

 
// {
//   "result": true,
//   "resultCode": "SUCCESS",
//   "message": "success",
//   "data": {
//     "privateKey": "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgpjSzkHM5aE99g0FX\noonYby81C7gLGcIAoaQ0b9FBItahRANCAASNDlodPX1kgr8Hu3ddvBYgJMVEtuC5\nwFlGYdVQB2yJ+Sk+/5ENX25wN8rBgcJ9pooU3nSv1F3LrtaIytKiQafx\n-----END PRIVATE KEY-----\n",
//     "publicKey": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjQ5aHT19ZIK/B7t3XbwWICTFRLbg\nucBZRmHVUAdsifkpPv+RDV9ucDfKwYHCfaaKFN50r9Rdy67WiMrSokGn8Q==\n-----END PUBLIC KEY-----\n"
//   }
// }