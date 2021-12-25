import Joi from 'joi'
import SchemaBuilder from './SchemaBuilder'

const { item } = SchemaBuilder(Joi.object({
  name: Joi.string().required().example('ed4887af-d11f-4d57-8fcf-caa0f4607d2d.png'),
  path: Joi.string().required().example('upload/file'),
  document: Joi.string().required().example('dcument name'),
  public_url: Joi.string().example('static-files/ed4887af-d11f-4d57-8fcf-caa0f4607d2d.png'),
  status: Joi.boolean().default(false)
}), {
  itemLabel: 'Document Response'
})

export const DocumentResponseSchema = item
