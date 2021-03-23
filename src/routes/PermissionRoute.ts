import Joi from 'joi';
import { PermissionListResponseSchema, PermissionResponseSchema } from '../schemas/Permission';
import PermissionController from '../controllers/PermissionController';
import { BadRequestErrorSchema, InternalServerErrorSchema, StatusChangeSchema, UnauthorizedErrorSchema } from '../schemas/Common';

const controller = new PermissionController();

export default[
    {
        path: '/api/permissions',
        method: 'GET',
        handler: controller.list.bind(controller),
        config: {
            description: 'Permissions list',
            notes: 'Return a list of all permissions',
            tags: ['api', 'Permission'],
            auth: {
                strategy: 'token',
                access: { scope: 'permissions.list' }
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
                    200: PermissionListResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        }
    },
    {
        path: '/api/permissions',
        method: 'POST',
        handler: controller.store.bind(controller),
        config: {
            description: 'Create Permission',
            notes: 'Create new permission in system',
            tags: ['api', 'Permission'],
            auth: {
                strategy: 'token',
                access: { scope: 'permissions.create' }
            },
            validate: {
                options: {abortEarly: false},
                payload: {
                    name: Joi.string().required().example('models.method'),
                    level: Joi.string().required().example('low'),
                }
            },
            response: {
                status: {
                    200: PermissionResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/permissions/{id}',
        method: 'GET',
        handler: controller.show.bind(controller),
        config: {
            description: 'Get A Permission',
            notes: 'Get a permission details',
            tags: ['api', 'Permission'],
            auth: {
                strategy: 'token',
                access: { scope: 'permissions.show' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required permission'),
                }
            },
            response: {
                status: {
                    200: PermissionResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/permissions/{id}',
        method: 'PUT',
        handler: controller.update.bind(controller),
        config: {
            description: 'Update A Permission',
            notes: 'Update a permission details',
            tags: ['api', 'Permission'],
            auth: {
                strategy: 'token',
                access: { scope: 'permissions.update' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required permission'),
                },
                payload: {
                    name: Joi.string().required().example('models.method'),
                    level: Joi.string().required().example('low | medium | high'),
                }
            },
            response: {
                status: {
                    200: PermissionResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/permissions/{id}',
        method: 'DELETE',
        handler: controller.destroy.bind(controller),
        config: {
            description: 'Delete A Permission',
            notes: 'Delete a permission from system',
            tags: ['api', 'Permission'],
            auth: {
                strategy: 'token',
                access: { scope: 'permissions.destroy' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required permission'),
                }
            },
            response: {
                status: {
                    200: PermissionResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/permissions/{id}',
        method: 'PATCH',
        handler: controller.status.bind(controller),
        config: {
            description: 'Activate Deactivate',
            notes: 'Enable-disable permission',
            tags: ['api', 'Permission'],
            auth: {
                strategy: 'token',
                access: { scope: 'permissions.status' }
            },
            validate: {
                options: {abortEarly: false},
                params:{
                    id: Joi.number().required().description('id of required permission'),
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