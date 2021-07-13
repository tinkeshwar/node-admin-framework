import Joi from 'joi';
import { ImageResponseSchema } from './Image';
import { PermissionResponseSchema } from './Permission';
import { RoleResponseSchema } from './Role';

const date = new Date();

const UserResponse = Joi.object({
    id: Joi.number().required().example(1),
    firstname: Joi.string().required().example('John'),
    middlename: Joi.string().optional().allow(null).example('Unknown'),
    lastname: Joi.string().optional().allow(null).example('Doe'),
    email: Joi.string().email().required().example('john@doe.com'),
    phone: Joi.string().required().example('9876543210'),
    email_verified_at:Joi.date().optional().allow(null),
    phone_verified_at:Joi.date().optional().allow(null),
    status:Joi.boolean().default(false),
    created_at:Joi.date().optional().allow(null).example(date),
    updated_at:Joi.date().optional().allow(null).example(date),
    permissions:Joi.array().optional().items(PermissionResponseSchema),
    roles:Joi.array().items(RoleResponseSchema),
    image: ImageResponseSchema
}).unknown().label('User');

const UserCreateUpdateResponse = Joi.object({
    id: Joi.number().required().example(1),
    firstname: Joi.string().required().example('John'),
    middlename: Joi.string().optional().allow(null).example('Unknown'),
    lastname: Joi.string().optional().allow(null).example('Doe'),
    email: Joi.string().email().required().example('john@doe.com'),
    phone: Joi.string().required().example('9876543210'),
    email_verified_at:Joi.date().optional().allow(null),
    phone_verified_at:Joi.date().optional().allow(null),
    status:Joi.boolean().default(false),
    created_at:Joi.date().optional().allow(null).example(date),
    updated_at:Joi.date().optional().allow(null).example(date)
}).unknown().label('User Create Update');

const UserResponseList = Joi.object({
    list: Joi.array().items(UserResponse).required().label('List Data'),
    meta:Joi.object({
        total:Joi.number().required().example(0),
        page:Joi.number().required().example(1),
        per_page:Joi.number().required().example(1)
    }).unknown().label('List Meta')
}).unknown().label('User List');

const UserSettingList = Joi.object({
    key: Joi.string().optional(),
    value: Joi.string().optional(),
});

const AuthUserResponse = Joi.object({
    user: UserResponse.required(),
    scope: Joi.array().items(Joi.string()).optional().label('Permission'),
    setting: Joi.array().items(UserSettingList).optional().label('Setting'),
    token: Joi.string().required()
}).unknown().label('Auth User');

const AuthUserProfileResponse = Joi.object({
    user: UserResponse.required(),
    scope: Joi.array().items(Joi.string()).optional().label('Permission'),
    setting: Joi.array().items(UserSettingList).optional().label('Setting')
}).unknown().label('Auth User');

const PasswordRecoveryResponse = Joi.object({
    expire_at: Joi.date().optional().allow(null).example(date),
}).unknown().label('Password Recover');


export const UserResponseSchema = UserResponse;
export const UserCreateUpdateResponseSchema = UserCreateUpdateResponse;
export const UserListResponseSchema = UserResponseList;
export const AuthUserResponseSchema = AuthUserResponse;
export const AuthUserProfileResponseSchema = AuthUserProfileResponse;
export const PasswordRecoveryResponseSchema = PasswordRecoveryResponse;