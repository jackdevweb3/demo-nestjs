export interface JWTConfigItem {
    kid: string;

    privateKey: string;
    publicKey: string;
    algorithm: string;
    expiresIn: string;
}