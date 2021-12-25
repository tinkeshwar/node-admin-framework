import Joi from 'joi'
import SchemaBuilder from './SchemaBuilder'

export const { item: InternalServerErrorSchema } = SchemaBuilder(Joi.object({
  statusCode: Joi.any().optional().example(500),
  error: Joi.any().example('Internal Server Error'),
  message: Joi.any().example('An internal server error occured')
}), {
  id: false,
  timestamps: false,
  itemLabel: 'Server Error Response'
})

export const { item: BadRequestErrorSchema } = SchemaBuilder(Joi.object({
  statusCode: Joi.any().optional().example(400),
  error: Joi.any().example('Bad Request'),
  message: Joi.any().example('Missing Required Field.')
}), {
  id: false,
  timestamps: false,
  itemLabel: 'Bad Request Error Response'
})

export const { item: UnauthorizedErrorSchema } = SchemaBuilder(Joi.object({
  statusCode: Joi.any().optional().example(401),
  error: Joi.any().example('Unauthorized'),
  message: Joi.any().example('Missing authentication'),
  attributes: Joi.object({
    error: Joi.any().example('Token Invalid')
  })
}), {
  id: false,
  timestamps: false,
  itemLabel: 'Unauthorized Error Response'
})

export const { item: StatusChangeSchema } = SchemaBuilder(Joi.object({
  success: Joi.any().example('Success'),
  status: Joi.boolean().required().example(true)
}), {
  id: false,
  timestamps: false,
  itemLabel: 'Status Change Response'
})

export const { item: FileUploadSchema } = SchemaBuilder(Joi.object({
  file: Joi.string(),
  ext: Joi.string()
}), {
  id: false,
  timestamps: false,
  itemLabel: 'File Upload Success Response'
})

export const { item: CPUHealthSchema } = SchemaBuilder(Joi.object({
  uptime: Joi.number(),
  timestamp: Joi.number(),
  cpu: Joi.object({
    idle: Joi.number(),
    total: Joi.number()
  }),
  usage: Joi.object({
    cpu: Joi.number(),
    memory: Joi.number(),
    ctime: Joi.number(),
    elapsed: Joi.number(),
    timestamp: Joi.number()
  })
}), {
  id: false,
  timestamps: false,
  itemLabel: 'CPU Health State Response'
})
