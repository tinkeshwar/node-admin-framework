import Joi from 'joi'
import { UserListResponseSchema, UserResponseSchema } from '../../schemas/User'
import UserController from '../../controllers/user/UserController'
import { BadRequestErrorSchema, InternalServerErrorSchema, StatusChangeSchema, UnauthorizedErrorSchema } from '../../schemas/Common'

const controller = new UserController()

export default [
  {
    path: '/api/user/users',
    method: 'GET',
    handler: controller.list.bind(controller),
    options: {
      description: 'User list',
      notes: 'Return a list of all users',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.list' }
      },
      validate: {
        options: { abortEarly: false },
        query: {
          page: Joi.number().min(1).default(1),
          records: Joi.number().min(1).default(10),
          sort: Joi.string().optional(),
          order: Joi.string().optional(),
          email: Joi.string().email().optional().example('tinkeshwar@gmail.com'),
          phone: Joi.number().optional().example(9876543210)
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
    }
  },
  {
    path: '/api/user/users',
    method: 'POST',
    handler: controller.store.bind(controller),
    options: {
      description: 'Create User',
      notes: 'Create new user in system',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.create' }
      },
      validate: {
        options: { abortEarly: false },
        payload: {
          firstname: Joi.string().required().example('John'),
          middlename: Joi.string().optional().empty(''),
          lastname: Joi.string().optional().empty(''),
          email: Joi.string().email().required().example('john@doe.com'),
          phone: Joi.number().required().example('9876543210'),
          password: Joi.string().required(),
          image: Joi.object({
            file: Joi.string().optional(),
            ext: Joi.string().optional()
          }).optional().empty('').allow(null)
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
    }
  },
  {
    path: '/api/user/users/{id}',
    method: 'GET',
    handler: controller.show.bind(controller),
    options: {
      description: 'Get A User',
      notes: 'Get a user details',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.show' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
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
    }
  },
  {
    path: '/api/user/users/{id}',
    method: 'PUT',
    handler: controller.update.bind(controller),
    options: {
      description: 'Update A User',
      notes: 'Update a user details',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.update' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().description('provide user id')
        },
        payload: {
          firstname: Joi.string().required().example('John'),
          middlename: Joi.string().optional().empty('').default(null),
          lastname: Joi.string().optional().empty('').default(null),
          email: Joi.string().email().required().example('john@doe.com'),
          phone: Joi.number().required().example('9876543210'),
          image: Joi.object({
            file: Joi.string().optional(),
            ext: Joi.string().optional()
          }).optional().empty('').allow(null)
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
    }
  },
  {
    path: '/api/user/users/{id}',
    method: 'DELETE',
    handler: controller.destroy.bind(controller),
    options: {
      description: 'Delete A User',
      notes: 'Delete a user from system',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.destroy' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
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
    }
  },
  {
    path: '/api/user/users/{id}',
    method: 'PATCH',
    handler: controller.status.bind(controller),
    options: {
      description: 'Activate Deactivate',
      notes: 'Grant Revoke User Login Access',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.status' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
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
    }
  },
  {
    path: '/api/user/users/{id}/roles',
    method: 'PUT',
    handler: controller.roles.bind(controller),
    options: {
      description: 'Update A User Roles',
      notes: 'Update a user roles',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.update' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().description('provide user id')
        },
        payload: {
          roles: Joi.array().required()
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
    }
  },
  {
    path: '/api/user/users/{id}/role',
    method: 'PUT',
    handler: controller.role.bind(controller),
    options: {
      description: 'Update A User Role',
      notes: 'Update a user role',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.update' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().description('provide user id')
        },
        payload: {
          role: Joi.number().required().description('provide role id')
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
    }
  },
  {
    path: '/api/user/users/{id}/permissions',
    method: 'PUT',
    handler: controller.permissions.bind(controller),
    options: {
      description: 'Update A User Permissions',
      notes: 'Update a user permissions',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.update' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().description('provide user id')
        },
        payload: {
          permissions: Joi.array().optional().allow(null).empty()
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
    }
  },
  {
    path: '/api/user/users/{id}/permission',
    method: 'PUT',
    handler: controller.permission.bind(controller),
    options: {
      description: 'Update A User Permission',
      notes: 'Update a user permission',
      tags: ['api', 'Users'],
      auth: {
        strategy: 'token',
        access: { scope: 'users.update' }
      },
      validate: {
        options: { abortEarly: false },
        params: {
          id: Joi.number().required().description('provide user id')
        },
        payload: {
          permission: Joi.number().required().description('provide permission id')
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
    }
  }
]
