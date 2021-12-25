---
to: src/schemas/<%= h.inflection.classify(name) %>.ts
---

import Joi from 'joi';
import SchemaBuilder from './SchemaBuilder'

const { item, items, list } = SchemaBuilder(Joi.object({
  
}), {
  itemLabel: '<%= h.inflection.classify(name) %> Response',
  listLabel: '<%= h.inflection.classify(name) %> List Response',
  dropdownLabel: '<%= h.inflection.classify(name) %> Dropdown List Response'
})

export const <%= h.inflection.classify(name) %>ListResponseSchema = list
export const <%= h.inflection.classify(name) %>ResponseSchema = item
export const <%= h.inflection.classify(name) %>DropdownListResponseSchema = items