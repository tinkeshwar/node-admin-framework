/**
 * @module services/error
 *
 * Module for authentication and authorization.
 * Covers registration, login, session maintenance, access control and other related aspects.
 */
 export { default as UserNotActiveError } from './UserNotActiveError';
 export { default as UserNotExistError } from './UserNotExistError';
 export { default as UserInvalidCredentialError } from './UserInvalidCredentialError';
 export { default as PasswordRecoveryDoesNotExistError } from './PasswordRecoveryDoesNotExistError';
 export { default as PasswordRecoveryExpiredError } from './PasswordRecoveryExpiredError';
 export { default as UserSettingsNotDefined } from './UserSettingsNotDefined';
 export { default as UserSettingsNotExist } from './UserSettingsNotExist';