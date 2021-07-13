import Joi from 'joi';
import { PermissionDropdownListResponseSchema, PermissionListResponseSchema, PermissionResponseSchema } from '../../schemas/Permission';
import PermissionController from '../../controllers/user/PermissionController';
import { BadRequestErrorSchema, InternalServerErrorSchema, StatusChangeSchema, UnauthorizedErrorSchema } from '../../schemas/Common';

const controller = new PermissionController();

export default[
    {
        path: '/api/user/permissions',
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
                    records: Joi.number().min(1).default(10),
                    sort: Joi.string().optional(),
                    order: Joi.string().optional(),
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
        path: '/api/user/permissions',
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
        path: '/api/user/permissions/{id}',
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
        path: '/api/user/permissions/{id}',
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
        path: '/api/user/permissions/{id}',
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
        path: '/api/user/permissions/{id}',
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
    },
    {
        path: '/api/user/permissions/dropdown',
        method: 'GET',
        handler: controller.dropdown.bind(controller),
        config: {
            description: 'Dropdown List',
            notes: 'Get permissions dropdown list',
            tags: ['api', 'Permission'],
            auth: {
                strategy: 'token',
            },
            validate: {
                options: {abortEarly: false},
                query: {
                    sort: Joi.string().default('created_at'),
                    order: Joi.string().default('DESC')
                }
            },
            response: {
                status: {
                    200: PermissionDropdownListResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        }
    }
]