import Joi from 'joi'
import SchemaBuilder from './SchemaBuilder'

const { item, items, list } = SchemaBuilder(Joi.object({
  name: Joi.string().optional().example('models.method'),
  level: Joi.string().optional().example('low'),
  status: Joi.boolean().default(false)
}), {
  itemLabel: 'Permission Response',
  listLabel: 'Permission List Response',
  dropdownLabel: 'Permission Dropdown List Response'
})

export const PermissionListResponseSchema = list
export const PermissionResponseSchema = item
export const PermissionDropdownListResponseSchema = items
