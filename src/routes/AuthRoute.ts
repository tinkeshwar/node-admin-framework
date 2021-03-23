import Joi from 'joi';
import { AuthUserResponseSchema } from '../schemas/User';
import LoginController from '../controllers/LoginController';
import { UnauthorizedErrorSchema, InternalServerErrorSchema, BadRequestErrorSchema } from '../schemas/Common';

const controller = new LoginController();

export default[
    {
        path: '/api/auth/login',
        method: 'POST',
        handler: controller.login.bind(controller),
        config: {
            description: 'Login Admin User',
            notes: 'Login admin user into system',
            tags: ['api', 'Auth'],
            validate: {
                options: {abortEarly: false},
                payload:Joi.object({
                    email: Joi.string().email().required().example('admin@vidhyasaga.com'),
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
    }
]