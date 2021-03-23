import Joi from 'joi';

const date = new Date();

const RoleResponse = Joi.object({
    id: Joi.number().required().example(1),
    name: Joi.string().required().example('Developer'),
    alias: Joi.string().required().example('developer'),
    descrription: Joi.string().optional(),
    status:Joi.boolean().default(false),
    created_at:Joi.date().optional().allow(null),
    updated_at:Joi.date().optional().allow(null)
}).unknown().label('Role');

const RoleResponseList = Joi.object({
    list: Joi.array().items(RoleResponse).required().label('List Data'),
    meta:Joi.object({
        total:Joi.number().required().example(0),
        page:Joi.number().required().example(1),
        per_page:Joi.number().required().example(1)
    }).unknown().label('List Meta')
}).unknown().label('Role List');

export const RoleListResponseSchema = RoleResponseList;
export const RoleResponseSchema = RoleResponse;