import zlib from 'zlib'
import JWT from 'jsonwebtoken'
import cryptoRandomString from 'crypto-random-string'
import { User } from '../../models'
import RedisCacheManager from '../cache/Redis'
import PermissionService from './PermissionService'
import UserSettingManager from '../setting/UserSettingService'
import { AuthUser, AuthUserJWT, AuthUserJWTVerify, AuthUserSettings, ResetToken } from './IFace'

const { NODE_ENV, JWT_TOKEN } = process.env

function getJWTExpireTime () {
  switch (NODE_ENV) {
    case 'development':
      return '1y'
    case 'testing':
      return '24h'
    default:
      return '30m'
  }
}

const scopeCache = new RedisCacheManager('scope')
const SCOPE_CACHE_EXPIRES_IN_SECONDS = 600

class AuthService {
  public static async authorize (user: User): Promise<AuthUser> {
    const scope = await PermissionService.getUserRoles(user.id)
    const setting = await UserSettingManager.getUserSettings(user.id)
    const token = JWT.sign({
      user,
      scope: await AuthService.secureScope(user, scope),
      setting: await AuthService.secureSettings(user, setting),
      tokenType: 'access'
    }, JWT_TOKEN as string, {
      algorithm: 'HS256',
      expiresIn: getJWTExpireTime()
    })
    const refresh = JWT.sign({
      user,
      tokenType: 'refresh'
    }, JWT_TOKEN as string, {
      algorithm: 'HS256',
      expiresIn: '14d'
    })
    return {
      user,
      setting,
      token,
      refresh
    }
  }

  public static refresh (token: string): AuthUserJWT {
    const payload = JWT.verify(token, JWT_TOKEN as string)
    if (typeof payload !== 'object') {
      throw new Error('JWT payload is not an object')
    }

    const objectPayload: AuthUserJWT = payload as any
    if (!objectPayload.tokenType) {
      throw new Error('Malformed JWT payload')
    }
    return objectPayload
  }

  public static async verify (toVerify: AuthUserJWT): Promise<AuthUserJWTVerify> {
    const { user, scope: scopeKey, setting: settingKey, tokenType } = toVerify

    if (tokenType !== 'access' || (typeof scopeKey !== 'string') || (typeof settingKey !== 'string')) {
      return { isValid: false }
    }
    let scope: string[] | null = await AuthService.getScope(user, scopeKey)
    if (!scope) {
      scope = await PermissionService.getUserRoles(user.id)
      await AuthService.secureScope(user, scope, scopeKey)
    }

    let setting: AuthUserSettings[] | null = await AuthService.getSetting(user, settingKey)
    if (!setting) {
      setting = await UserSettingManager.getUserSettings(user.id)
      await AuthService.secureSettings(user, setting, settingKey)
    }
    return { isValid: true, credentials: { user, scope, setting } }
  }

  public static async sendVerificationToken (user: User):Promise<ResetToken> {
    return { name: user.firstname as string, email: '' }
  }

  private static async secureScope (user: User, scope: string[], hashKey?: string): Promise<string> {
    const scopeKey = hashKey || cryptoRandomString({ length: 10, type: 'alphanumeric' })
    const serializedScope = AuthService.serializeScope(scope)
    await scopeCache.set(`${user.id}:${scopeKey}`, serializedScope, SCOPE_CACHE_EXPIRES_IN_SECONDS)
    return scopeKey
  }

  private static async getScope (user: User, scopeKey: string): Promise<string[] | null> {
    const serializedScope = await scopeCache.get(`${user.id}:${scopeKey}`)
    if (!serializedScope) {
      return null
    }
    return AuthService.deserializeScope(serializedScope)
  }

  private static async secureSettings (user: User, settings: AuthUserSettings[], hashKey?: string): Promise<string> {
    const settingKey = hashKey || cryptoRandomString({ length: 10, type: 'alphanumeric' })
    const serializedScope = AuthService.serializeSetting(settings)
    await scopeCache.set(`${user.id}:${settingKey}`, serializedScope, SCOPE_CACHE_EXPIRES_IN_SECONDS)
    return settingKey
  }

  private static async getSetting (user: User, settingKey: string): Promise<AuthUserSettings[] | null> {
    const serializedSetting = await scopeCache.get(`${user.id}:${settingKey}`)
    if (!serializedSetting) {
      return null
    }
    return AuthService.deserializeSetting(serializedSetting)
  }

  private static serializeScope (scope: string[]): string {
    return zlib.brotliCompressSync(JSON.stringify(scope)).toString('base64')
  }

  private static deserializeScope (serializedScope: string): string[] {
    return JSON.parse(zlib.brotliDecompressSync(Buffer.from(serializedScope, 'base64')).toString('utf-8')) as string[]
  }

  private static serializeSetting (scope: AuthUserSettings[]): string {
    return zlib.brotliCompressSync(JSON.stringify(scope)).toString('base64')
  }

  private static deserializeSetting (serializedScope: string): AuthUserSettings[] {
    return JSON.parse(zlib.brotliDecompressSync(Buffer.from(serializedScope, 'base64')).toString('utf-8')) as AuthUserSettings[]
  }
}

export default AuthService
