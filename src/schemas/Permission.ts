import Joi from 'joi'

const date = new Date()

const PermissionResponse = Joi.object({
  id: Joi.number().required().example(1),
  name: Joi.string().required().example('models.method'),
  level: Joi.string().optional().example('low'),
  status: Joi.boolean().default(false),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('Permission')

const PermissionResponseList = Joi.object({
  list: Joi.array().items(PermissionResponse).required().label('List Data'),
  meta: Joi.object({
    total: Joi.number().required().example(0),
    page: Joi.number().required().example(1),
    per_page: Joi.number().required().example(1)
  }).unknown().label('List Meta')
}).unknown().label('Permission List')

const PermissionDropdownResponseList = Joi.object({
  items: Joi.array().items(PermissionResponse).required().label('List Dropdown')
}).unknown().label('Permission Dropdown')

export const PermissionListResponseSchema = PermissionResponseList
export const PermissionResponseSchema = PermissionResponse
export const PermissionDropdownListResponseSchema = PermissionDropdownResponseList
