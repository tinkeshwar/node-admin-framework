import Joi from 'joi'
import SchemaBuilder from './SchemaBuilder'

const { item, list } = SchemaBuilder(Joi.object({
  firstname: Joi.string().required().example('John'),
  middlename: Joi.string().optional().allow(null).example('Unknown'),
  lastname: Joi.string().optional().allow(null).example('Doe'),
  email: Joi.string().email().required().example('john@doe.com'),
  phone: Joi.string().required().example('9876543210'),
  email_verified_at: Joi.date().optional().allow(null),
  phone_verified_at: Joi.date().optional().allow(null),
  status: Joi.boolean().default(false)
}), {
  itemLabel: 'User Response',
  listLabel: 'User List Response'
})

export const UserResponseSchema = item
export const UserListResponseSchema = list
export const AuthenticationResponseSchema = Joi.object({
  user: item,
  token: Joi.string().required(),
  refresh: Joi.string().required()
})

export const UserProfileResponseSchema = Joi.object({
  user: item,
  scope: Joi.array().optional().allow(null).empty(),
  sidebar: Joi.array().optional().allow(null).empty()
})
