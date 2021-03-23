import Joi from 'joi';
import { RoleListResponseSchema, RoleResponseSchema } from '../schemas/Role';
import RoleController from '../controllers/RoleController';
import { BadRequestErrorSchema, InternalServerErrorSchema, StatusChangeSchema, UnauthorizedErrorSchema } from '../schemas/Common';

const controller = new RoleController();

export default[
    {
        path: '/api/roles',
        method: 'GET',
        handler: controller.list.bind(controller),
        config: {
            description: 'Roles list',
            notes: 'Return a list of all roles',
            tags: ['api', 'Role'],
            auth: {
                strategy: 'token',
                access: { scope: 'roles.list' }
            },
            validate: {
                options: {abortEarly: false},
                query:{
                    page: Joi.number().min(1).default(1),
                    records: Joi.number().min(1).default(10)
                }
            },
            response: {
                status: {
                    200: RoleListResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/roles',
        method: 'POST',
        handler: controller.store.bind(controller),
        config: {
            description: 'Create Role',
            notes: 'Create new role in system',
            tags: ['api', 'Role'],
            auth: {
                strategy: 'token',
                access: { scope: 'roles.create' }
            },
            validate: {
                options: {abortEarly: false},
                payload:{
                    name: Joi.string().required().example('Admin Role'),
                    alias: Joi.string().required().example('admin-role'),
                    description: Joi.string().optional().example('some text'),
                }
            },
            response: {
                status: {
                    200: RoleResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/roles/{id}',
        method: 'GET',
        handler: controller.show.bind(controller),
        config: {
            description: 'Get A Role',
            notes: 'Get a role details',
            tags: ['api', 'Role'],
            auth: {
                strategy: 'token',
                access: { scope: 'roles.show' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required role'),
                }
            },
            response: {
                status: {
                    200: RoleResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/roles/{id}',
        method: 'PUT',
        handler: controller.update.bind(controller),
        config: {
            description: 'Update A Role',
            notes: 'Update a role details',
            tags: ['api', 'Role'],
            auth: {
                strategy: 'token',
                access: { scope: 'roles.update' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required role'),
                },
                payload:{
                    name: Joi.string().required().example('Admin Role'),
                    alias: Joi.string().required().example('admin-role'),
                    description: Joi.string().optional().example('some text'),
                }
            },
            response: {
                status: {
                    200: RoleResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/roles/{id}',
        method: 'DELETE',
        handler: controller.destroy.bind(controller),
        config: {
            description: 'Delete A Role',
            notes: 'Delete a role from system',
            tags: ['api', 'Role'],
            auth: {
                strategy: 'token',
                access: { scope: 'roles.destroy' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required role'),
                }
            },
            response: {
                status: {
                    200: RoleResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/roles/{id}',
        method: 'PATCH',
        handler: controller.status.bind(controller),
        config: {
            description: 'Activate Deactivate',
            notes: 'Enable-disable role',
            tags: ['api', 'Role'],
            auth: {
                strategy: 'token',
                access: { scope: 'roles.status' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required role'),
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