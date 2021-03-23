import zlib from 'zlib';
import JWT from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import { User } from "../../models";
import RedisCacheManager from '../cache/Redis';
import PermissionService from './PermissionService';

const {NODE_ENV, JWT_TOKEN} = process.env;

interface AuthUser {
    user: User;
    scope: string[];
    token: string;
}

interface AuthUserJWT {
    user: User;
    scope: string[];
    tokenType: string;
}

interface AuthUserJWTVerify {
    isValid: boolean,
    credentials?: {
        user: User,
        scope: string[]
    }
}

function getJWTExpireTime() {
    switch(NODE_ENV){
        case 'development':
            return '1y'
        case 'testing':
            return '24h';
        default:
            return '20m'
    }
}

const scopeCache = new RedisCacheManager('scope');
const SCOPE_CACHE_EXPIRES_IN_SECONDS = 600;

class AuthService{
    public static async authorize(user: User): Promise<AuthUser>{
        const scope = await PermissionService.getUserRoles(user.id);
        const token = JWT.sign({
            user,
            scope: await AuthService.secureScope(user, scope),
            tokenType: 'access'
        }, JWT_TOKEN as string, {
            algorithm: 'HS256',
            expiresIn: getJWTExpireTime()
        });
        return {
            user,
            scope,
            token
        };
    }

    public static async verify(toVerify: AuthUserJWT): Promise<AuthUserJWTVerify>{
        const { user, scope: scopeKey, tokenType } = toVerify;

        if (tokenType !== 'access' || (typeof scopeKey !== 'string')) {
            return { isValid: false };
        }
        let scope: string[] | null = await AuthService.getScope(user, scopeKey);
        if (!scope) {
            scope = await PermissionService.getUserRoles(user.id);
            await AuthService.secureScope(user, scope, scopeKey);
        }

        return { isValid: true, credentials: { user,  scope} };
    }

    private static async secureScope(user: User, scope: string[], hashKey?: string): Promise<string> {
        const scopeKey = hashKey || cryptoRandomString({length: 10, type: 'alphanumeric'});
        const serializedScope = AuthService.serializeScope(scope);
        await scopeCache.set(`${user.id}:${scopeKey}`, serializedScope, SCOPE_CACHE_EXPIRES_IN_SECONDS);
        return scopeKey;
    }

    private static async getScope(user: User, scopeKey: string): Promise<string[] | null> {
        const serializedScope = await scopeCache.get(`${user.id}:${scopeKey}`);
        if (!serializedScope) {
            return null;
        }
        return AuthService.deserializeScope(serializedScope);
    }

    private static serializeScope(scope: string[]): string {
        return zlib.brotliCompressSync(JSON.stringify(scope)).toString('base64');
    }

    private static deserializeScope(serializedScope: string): string[] {
        return JSON.parse(zlib.brotliDecompressSync(Buffer.from(serializedScope, 'base64')).toString('utf-8')) as string[];
    }
}

export default AuthService;
