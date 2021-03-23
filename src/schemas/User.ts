import Joi from 'joi';

const date = new Date();

const UserResponse = Joi.object({
    id: Joi.number().required().example(1),
    firstname: Joi.string().required().example('John'),
    middlename: Joi.string().allow(null).example('Unknown'),
    lastname: Joi.string().required().example('Doe'),
    email: Joi.string().email().required().example('john@doe.com'),
    phone: Joi.string().required().example('9876543210'),
    email_verified_at:Joi.date().optional().allow(null),
    phone_verified_at:Joi.date().optional().allow(null),
    status:Joi.boolean().default(false),
    created_at:Joi.date().optional().allow(null).example(date),
    updated_at:Joi.date().optional().allow(null).example(date)
}).unknown().label('User');

const UserResponseList = Joi.object({
    list: Joi.array().items(UserResponse).required().label('List Data'),
    meta:Joi.object({
        total:Joi.number().required().example(0),
        page:Joi.number().required().example(1),
        per_page:Joi.number().required().example(1)
    }).unknown().label('List Meta')
}).unknown().label('User List');

const AuthUserResponse = Joi.object({
    user: UserResponse.required(),
    permissions: Joi.array().items(Joi.string()).optional().label('Permission'),
    token: Joi.string().required()
}).unknown().label('Auth User');


export const UserResponseSchema = UserResponse;
export const UserListResponseSchema = UserResponseList;
export const AuthUserResponseSchema = AuthUserResponse;