import Joi from 'joi';
import { AuthUserProfileResponseSchema, AuthUserResponseSchema, PasswordRecoveryResponseSchema } from '../../schemas/User';
import LoginController from '../../controllers/auth/LoginController';
import { UnauthorizedErrorSchema, InternalServerErrorSchema, BadRequestErrorSchema } from '../../schemas/Common';

const controller = new LoginController();

export default[
    {
        path: '/api/auth/user/login',
        method: 'POST',
        handler: controller.login.bind(controller),
        config: {
            description: 'Login Admin User',
            notes: 'Login admin user into system',
            tags: ['api', 'Auth'],
            validate: {
                options: {abortEarly: false},
                payload:Joi.object({
                    email: Joi.string().email().required().example('tinkeshwar@vidhyasaga.com'),
                    password: Joi.string().required().example('admin'),
                }).label('Login')
            },
            response: {
                status: {
                    200: AuthUserResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/auth/user/forget-password',
        method: 'POST',
        handler: controller.forgot.bind(controller),
        config: {
            description: 'Forget password',
            notes: 'Reset password by requesting reset link',
            tags: ['api', 'Auth'],
            validate: {
                options: {abortEarly: false},
                payload:Joi.object({
                    email: Joi.string().email().required().example('tool@vidhyasaga.com'),
                }).label('Forgot Password')
            },
            response: {
                status: {
                    200: PasswordRecoveryResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    },
    {
        path: '/api/auth/user/profile',
        method: 'GET',
        handler: controller.profile.bind(controller),
        config: {
            description: 'Auth user profile',
            notes: 'Return auth user',
            tags: ['api', 'Auth'],
            auth: {
                strategy: 'token',
            },
            validate: {
                options: {abortEarly: false}
            },
            response: {
                status: {
                    200: AuthUserProfileResponseSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    }
]