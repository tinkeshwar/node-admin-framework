import Joi from 'joi'
import SchemaBuilder from './SchemaBuilder'

const { item, items, list } = SchemaBuilder(Joi.object({
  name: Joi.string().required().example('Developer'),
  alias: Joi.string().required().example('developer'),
  description: Joi.string().optional(),
  status: Joi.boolean().default(false)
}), {
  itemLabel: 'Role Response',
  listLabel: 'Role List Response',
  dropdownLabel: 'Role Dropdown List Response'
})

export const RoleListResponseSchema = list
export const RoleResponseSchema = item
export const RoleDropdownListResponseSchema = items
