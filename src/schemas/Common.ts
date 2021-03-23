import Joi from "joi";

export const InternalServerErrorSchema = Joi.object({
    statusCode: Joi.any().optional().example(500),
    error: Joi.any().example('Internal Server Error'),
    message: Joi.any().example('An internal server error occured')
}).label('Server Error');

export const BadRequestErrorSchema = Joi.object({
    statusCode: Joi.any().optional().example(400),
    error: Joi.any().example('Bad Request'),
    message: Joi.any().example('Missing Required Field.')
}).label('Bad Request Error');

export const UnauthorizedErrorSchema = Joi.object({
    statusCode: Joi.any().optional().example(401),
    error: Joi.any().example('Unauthorized'),
    message: Joi.any().example('Missing authentication')
}).label('Unauthorized Error');

export const StatusChangeSchema = Joi.object({
    success: Joi.any().example('Success'),
    status: Joi.boolean().required().example(true)
}).label('Unauthorized Error');