import Joi from 'joi';
import { UserListResponseSchema, UserResponseSchema } from '../schemas/User';
import UserController from '../controllers/UserController';
import { BadRequestErrorSchema, InternalServerErrorSchema, StatusChangeSchema, UnauthorizedErrorSchema } from '../schemas/Common';

const controller = new UserController();

export default[
    {
        path: '/api/users',
        method: 'GET',
        handler: controller.list.bind(controller),
        config: {
            description: 'User list',
            notes: 'Return a list of all users',
            tags: ['api', 'Users'],
            auth: {
                strategy: 'token',
                access: { scope: 'users.list' }
            },
            validate: {
                options: {abortEarly: false},
                query:{
                    page: Joi.number().min(1).default(1),
                    records: Joi.number().min(1).default(10),
                    email: Joi.string().email().optional().example('tinkeshwar@gmail.com'),
                    name: Joi.string().optional().example('Tinkeshwar Singh')
                }
            },
            response: {
                status: {
                    200: UserListResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/users',
        method: 'POST',
        handler: controller.store.bind(controller),
        config: {
            description: 'Create User',
            notes: 'Create new user in system',
            tags: ['api', 'Users'],
            auth: {
                strategy: 'token',
                access: { scope: 'users.create' }
            },
            validate: {
                options: {abortEarly: false},
                payload:{
                    firstname: Joi.string().required().example('John'),
                    middlename: Joi.string().optional().example('Unknown'),
                    lastname: Joi.string().required().example('Doe'),
                    email: Joi.string().email().required().example('john@doe.com'),
                    phone: Joi.number().required().example('9876543210'),
                    password: Joi.string().required(),
                    image: Joi.any().meta({ swaggerType: 'image' }).required().description('user image')
                }
            },
            response: {
                status: {
                    200: UserResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/users/{id}',
        method: 'GET',
        handler: controller.show.bind(controller),
        config: {
            description: 'Get A User',
            notes: 'Get a user details',
            tags: ['api', 'Users'],
            auth: {
                strategy: 'token',
                access: { scope: 'users.show' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('provide user id')
                }
            },
            response: {
                status: {
                    200: UserResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/users/{id}',
        method: 'PUT',
        handler: controller.update.bind(controller),
        config: {
            description: 'Update A User',
            notes: 'Update a user details',
            tags: ['api', 'Users'],
            auth: {
                strategy: 'token',
                access: { scope: 'users.update' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('provide user id')
                },
                payload:{
                    firstname: Joi.string().required().example('John'),
                    middlename: Joi.string().optional().example('Unknown'),
                    lastname: Joi.string().required().example('Doe'),
                    email: Joi.string().email().required().example('john@doe.com'),
                    phone: Joi.number().required().example('9876543210'),
                    password: Joi.string().optional(),
                }
            },
            response: {
                status: {
                    200: UserResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/users/{id}',
        method: 'DELETE',
        handler: controller.destroy.bind(controller),
        config: {
            description: 'Delete A User',
            notes: 'Delete a user from system',
            tags: ['api', 'Users'],
            auth: {
                strategy: 'token',
                access: { scope: 'users.destroy' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('provide user id')
                }
            },
            response: {
                status: {
                    200: UserResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/users/{id}',
        method: 'PATCH',
        handler: controller.status.bind(controller),
        config: {
            description: 'Activate Deactivate',
            notes: 'Grant Revoke User Login Access',
            tags: ['api', 'Users'],
            auth: {
                strategy: 'token',
                access: { scope: 'users.status' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('provide user id')
                }
            },
            response: {
                status: {
                    200: StatusChangeSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    }
]