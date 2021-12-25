import Joi from 'joi'
import SchemaBuilder from './SchemaBuilder'

const { item } = SchemaBuilder(Joi.object({
  expires_at: Joi.date().required().example(new Date())
}), {
  id: false,
  timestamps: false,
  itemLabel: 'Password Recovery Response'
})

export const PasswordRecoveryResponseSchema = item
export const PasswordResetResponseSchema = Joi.object({
  status: Joi.string().optional()
})
