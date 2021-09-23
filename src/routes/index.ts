import { flatten } from 'lodash'
import Health from './master/HealthRoute'
import Auth from './auth/AuthRoute'
import User from './user/UserRoute'
import Permission from './user/PermissionRoute'
import Role from './user/RoleRoute'
import Upload from './master/UploadRoute'
import AuthUser from './auth/AuthUserRoute'

export default flatten([
  AuthUser as any,
  Upload as any,
  DocumentType as any,
  Role as any,
  Permission as any,
  Health as any,
  Auth as any,
  User as any
])
