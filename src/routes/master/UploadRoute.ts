
import Joi from 'joi';
import { BadRequestErrorSchema, FileUploadSchema, InternalServerErrorSchema, UnauthorizedErrorSchema } from '../../schemas/Common';
import UploadController from '../../controllers/master/UploadController';
import path from 'path';

const controller = new UploadController();

export default[
    {
        path: '/static-images/{param*}',
        method: 'GET',
        handler: {
            directory: {
                path: path.join(__dirname, '..', '..','..', 'upload/image/')
            }
        }
    },
    {
        path: '/static-files/{param*}',
        method: 'GET',
        handler: {
            directory: {
                path: path.join(__dirname, '..', '..','..', 'upload/files/')
            }
        }
    },
    {
        path: '/api/common/upload/image',
        method: 'POST',
        handler: controller.image.bind(controller),
        config: {
            description: 'Upload Single Image',
            notes: 'Return a object of uploaded file',
            tags: ['api', 'Common'],
            auth: {
                strategy: 'token',
                access: { scope: 'users.create' || 'registration.create'}
            },
            validate: {
                options: {abortEarly: false}
            },
            payload: {
                maxBytes: 10240000,
                parse: false,
                timeout: false as const,
                output: 'stream' as const,
                allow: 'multipart/form-data'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    validate: {
                        payload: {
                            image: Joi.any().meta({ swaggerType: 'file' }).description('file to upload'),
                        }
                    }
                }
            },
            response: {
                status: {
                    200: FileUploadSchema,
                    400: BadRequestErrorSchema,
                    401: UnauthorizedErrorSchema,
                    500: InternalServerErrorSchema
                }
            }
        },
    }
]