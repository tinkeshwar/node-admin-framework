import Joi from 'joi'

const date = new Date()

const RoleResponse = Joi.object({
  id: Joi.number().required().example(1),
  name: Joi.string().required().example('Developer'),
  alias: Joi.string().required().example('developer'),
  description: Joi.string().optional(),
  status: Joi.boolean().default(false),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('Role')

const RoleResponseList = Joi.object({
  list: Joi.array().items(RoleResponse).required().label('List Data'),
  meta: Joi.object({
    total: Joi.number().required().example(0),
    page: Joi.number().required().example(1),
    per_page: Joi.number().required().example(1)
  }).unknown().label('List Meta')
}).unknown().label('Role List')

const RoleDropdownResponseList = Joi.object({
  items: Joi.array().items(RoleResponse).required().label('List Dropdown')
}).unknown().label('Role Dropdown')

export const RoleListResponseSchema = RoleResponseList
export const RoleResponseSchema = RoleResponse
export const RoleDropdownListResponseSchema = RoleDropdownResponseList
