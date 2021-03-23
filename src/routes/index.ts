import {flatten} from 'lodash';
import Health from './HealthRoute';
import Auth from './AuthRoute';
import User from './UserRoute';
import Permission from './PermissionRoute';
import Role from './RoleRoute';

export default flatten([
  Role as any,
  Permission as any,
  Health as any,
  Auth as any,
  User as any
]);